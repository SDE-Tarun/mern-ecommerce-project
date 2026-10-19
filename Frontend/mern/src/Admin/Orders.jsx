
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../axios";
import { toast } from "react-toastify";

const statuses = ["All statuses", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function money(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function getStatus(status = "") {
  const value = status.toLowerCase();

  if (value === "delivered") return "delivered";
  if (value === "shipped") return "shipped";
  if (value === "processing") return "processing";
  if (value === "cancelled") return "cancelled";
  return "pending";
}

function getCustomer(order) {
  const address = order.address;

  if (typeof address === "string") return address;
  if (address && typeof address === "object") {
    return [
      address.name,
      address.fullName,
      address.email,
      address.phone,
      address.mobile,
    ].filter(Boolean).join(" · ") || "Address available";
  }

  return order.user?.name || order.customerName || "Customer";
}

function getOrderId(order) {
  return String(order._id || order.id || "");
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);

      // Requires a backend GET /orders endpoint.
      const response = await api.get("/orders");
      const data = response.data;
      const list = Array.isArray(data) ? data : data.orders;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected orders API response");
      }

      setOrders(list);
    } catch (error) {
      setLoadError(true);
      toast.error(
        error.response?.data?.message ||
        "Orders could not be loaded. Check your backend orders API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const id = getOrderId(order).toLowerCase();
      const customer = getCustomer(order).toLowerCase();
      const matchesSearch = !query || id.includes(query) || customer.includes(query);
      const matchesStatus =
        statusFilter === "All statuses" ||
        (order.status || "Pending").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) =>
      ["pending", "processing"].includes((o.status || "pending").toLowerCase())
    ).length;

    const delivered = orders.filter(
      (o) => (o.status || "").toLowerCase() === "delivered"
    ).length;

    const revenue = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return { total: orders.length, pending, delivered, revenue };
  }, [orders]);

  async function updateStatus(order, nextStatus) {
    const id = getOrderId(order);
    if (!id || nextStatus === (order.status || "Pending")) return;

    try {
      setUpdatingId(id);

      // Requires backend PATCH /orders/:id/status.
      await api.patch(`/orders/${id}/status`, { status: nextStatus });

      setOrders((prev) =>
        prev.map((item) =>
          getOrderId(item) === id ? { ...item, status: nextStatus } : item
        )
      );

      toast.success("Order status updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Status update failed. Check the backend status-update endpoint."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="orders-page">
      <style>{styles}</style>

      <div className="orders-heading">
        <div>
          <div className="orders-eyebrow">SALES & FULFILMENT</div>
          <h2>Order management</h2>
          <p>Track customer orders, review payments and manage fulfilment.</p>
        </div>
        <button className="orders-refresh" onClick={loadOrders} disabled={loading}>
          <span>↻</span> Refresh
        </button>
      </div>

      <div className="orders-stats">
        <Stat icon="▤" color="purple" label="Total orders" value={stats.total} note="All recorded orders" />
        <Stat icon="◷" color="orange" label="Needs attention" value={stats.pending} note="Pending or processing" />
        <Stat icon="✓" color="green" label="Delivered" value={stats.delivered} note="Successfully completed" />
        <Stat icon="₹" color="blue" label="Order value" value={money(stats.revenue)} note="Excludes cancelled orders" />
      </div>

      <section className="orders-panel">
        <div className="orders-panel-header">
          <div>
            <h3>All orders</h3>
            <p>
              {loading
                ? "Fetching order information..."
                : `${filteredOrders.length} order${filteredOrders.length === 1 ? "" : "s"} shown`}
            </p>
          </div>
          <span className="orders-live-label"><i /> Order overview</span>
        </div>

        <div className="orders-filters">
          <div className="orders-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or customer..."
              aria-label="Search orders"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">×</button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter orders by status"
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="orders-state">
            <div className="orders-spinner" />
            <h3>Loading orders</h3>
            <p>Getting the latest order information.</p>
          </div>
        ) : loadError ? (
          <div className="orders-state">
            <div className="orders-state-icon error-icon">!</div>
            <h3>Couldn't load orders</h3>
            <p>Your backend needs a GET <code>/orders</code> endpoint before this page can display real orders.</p>
            <button className="orders-primary-btn" onClick={loadOrders}>Try again</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-state">
            <div className="orders-state-icon">▤</div>
            <h3>{orders.length ? "No matching orders" : "No orders yet"}</h3>
            <p>
              {orders.length
                ? "Try another search term or choose a different status."
                : "When customers place orders, they will appear here."}
            </p>
            {(search || statusFilter !== "All statuses") && (
              <button
                className="orders-secondary-btn"
                onClick={() => { setSearch(""); setStatusFilter("All statuses"); }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER / ADDRESS</th>
                  <th>DATE</th>
                  <th>PAYMENT</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const id = getOrderId(order);
                  const status = order.status || "Pending";
                  const itemCount = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
                    : 0;

                  return (
                    <tr key={id}>
                      <td>
                        <strong className="order-number">
                          #{id.slice(-8).toUpperCase() || "UNKNOWN"}
                        </strong>
                        <small>{itemCount} item{itemCount === 1 ? "" : "s"}</small>
                      </td>
                      <td>
                        <strong className="customer-name">{getCustomer(order)}</strong>
                        {order.user?.email && <small>{order.user.email}</small>}
                      </td>
                      <td>
                        <span className="order-date">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="payment-method">
                          {order.paymentMethod || "Not specified"}
                        </span>
                      </td>
                      <td><strong className="order-total">{money(order.totalAmount)}</strong></td>
                      <td>
                        <div className="status-cell">
                          <span className={`order-status status-${getStatus(status)}`}>
                            <i /> {status}
                          </span>
                          <select
                            className="status-select"
                            value={status}
                            disabled={updatingId === id}
                            onChange={(e) => updateStatus(order, e.target.value)}
                            aria-label={`Update status for order ${id}`}
                          >
                            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="orders-mobile-list">
              {filteredOrders.map((order) => {
                const id = getOrderId(order);
                const status = order.status || "Pending";
                const itemCount = Array.isArray(order.items)
                  ? order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
                  : 0;

                return (
                  <article className="order-mobile-card" key={id}>
                    <div className="order-mobile-top">
                      <div>
                        <span className="mobile-muted">ORDER ID</span>
                        <strong>#{id.slice(-8).toUpperCase() || "UNKNOWN"}</strong>
                      </div>
                      <span className={`order-status status-${getStatus(status)}`}><i />{status}</span>
                    </div>

                    <div className="order-mobile-customer">
                      <div className="customer-avatar">{getCustomer(order).charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{getCustomer(order)}</strong>
                        <small>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "Date unavailable"}
                        </small>
                      </div>
                    </div>

                    <div className="order-mobile-details">
                      <div><span>Items</span><strong>{itemCount}</strong></div>
                      <div><span>Payment</span><strong>{order.paymentMethod || "—"}</strong></div>
                      <div><span>Total</span><strong>{money(order.totalAmount)}</strong></div>
                    </div>

                    <label className="mobile-status-label">
                      Update order status
                      <select
                        value={status}
                        disabled={updatingId === id}
                        onChange={(e) => updateStatus(order, e.target.value)}
                      >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, color, label, value, note }) {
  return (
    <div className="orders-stat-card">
      <div className={`orders-stat-icon ${color}`}>{icon}</div>
      <div className="orders-stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

const styles = `
.orders-page{color:#1b2435}
.orders-page *{box-sizing:border-box}
.orders-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:25px}
.orders-eyebrow{font-size:10px;letter-spacing:1.6px;font-weight:850;color:#6558df;margin-bottom:8px}
.orders-heading h2{font-size:clamp(24px,3vw,31px);letter-spacing:-.8px;font-weight:850;margin:0}
.orders-heading p{font-size:13px;color:#818b9d;margin:8px 0 0;line-height:1.6}
.orders-refresh,.orders-primary-btn,.orders-secondary-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 14px;border-radius:10px;font-size:12px;font-weight:750;cursor:pointer;transition:background .2s;border:1px solid #e1e5ee;background:#fff;color:#424d62;white-space:nowrap}
.orders-refresh:hover,.orders-secondary-btn:hover{background:#f3f2ff}
.orders-refresh:disabled{opacity:.6;cursor:wait}
.orders-refresh span{font-size:19px}
.orders-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:25px}
.orders-stat-card{display:flex;align-items:center;gap:13px;min-width:0;padding:19px 16px;background:#fff;border:1px solid #e9ecf3;border-radius:15px;box-shadow:0 4px 18px #1f293706}
.orders-stat-icon{display:grid;place-items:center;flex-shrink:0;width:43px;height:43px;border-radius:12px;font-size:20px;font-weight:800}
.orders-stat-icon.purple{background:#efedff;color:#6254d9}
.orders-stat-icon.orange{background:#fff2dd;color:#c88116}
.orders-stat-icon.green{background:#e5f8ee;color:#218555}
.orders-stat-icon.blue{background:#e7f2ff;color:#2876cc}
.orders-stat-content{min-width:0}
.orders-stat-content span,.orders-stat-content small{display:block;font-size:11px;color:#7f899b}
.orders-stat-content strong{display:block;font-size:clamp(17px,2vw,23px);letter-spacing:-.4px;margin:5px 0;color:#202a3b;overflow-wrap:anywhere}
.orders-stat-content small{font-size:10px;line-height:1.5}
.orders-panel{background:#fff;border:1px solid #e8ebf2;border-radius:17px;overflow:hidden;box-shadow:0 5px 25px #1f293706}
.orders-panel-header{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:22px 23px;border-bottom:1px solid #edf0f5}
.orders-panel-header h3{font-size:17px;font-weight:800;margin:0}
.orders-panel-header p{font-size:11px;color:#8992a2;margin:6px 0 0}
.orders-live-label{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:8px;background:#f0fbf5;color:#30875d;font-size:10px;font-weight:750;white-space:nowrap}
.orders-live-label i{width:6px;height:6px;background:#2cb67d;border-radius:50%}
.orders-filters{display:flex;align-items:center;gap:12px;padding:17px 23px;border-bottom:1px solid #edf0f5}
.orders-search{display:flex;align-items:center;gap:10px;flex:1;min-width:0;height:43px;padding:0 12px;border:1px solid #e0e4ed;border-radius:10px}
.orders-search:focus-within{border-color:#7a6ee8;box-shadow:0 0 0 3px #7668e81a}
.orders-search>span{font-size:22px;color:#8992a2}
.orders-search input{flex:1;min-width:0;border:0;outline:none;background:transparent;font:inherit;font-size:12px;color:#293348}
.orders-search input::placeholder{color:#a0a7b5}
.orders-search button{border:0;background:transparent;color:#6b7486;font-size:20px;cursor:pointer}
.orders-filters select,.status-select,.mobile-status-label select{height:43px;max-width:200px;border:1px solid #e0e4ed;border-radius:9px;padding:0 11px;background:white;color:#465167;font:inherit;font-size:12px;outline:none}
.orders-table-wrap{width:100%;overflow-x:auto}
.orders-table{width:100%;border-collapse:collapse;text-align:left}
.orders-table th{padding:14px 16px;background:#fafbfe;color:#8791a2;font-size:9px;letter-spacing:.8px;font-weight:850;white-space:nowrap;border-bottom:1px solid #edf0f5}
.orders-table th:first-child,.orders-table td:first-child{padding-left:23px}
.orders-table td{padding:17px 16px;border-bottom:1px solid #f0f2f6;font-size:12px;color:#4e596d;vertical-align:middle}
.orders-table tbody tr:last-child td{border-bottom:0}
.orders-table tbody tr:hover{background:#fcfcff}
.orders-table td strong,.orders-table td small{display:block}
.order-number{color:#5144c8;font-size:12px;letter-spacing:.2px}
.orders-table td small{margin-top:5px;font-size:10px;color:#929aab;max-width:180px;overflow-wrap:anywhere}
.customer-name{max-width:200px;overflow-wrap:anywhere;color:#273145;font-size:12px}
.order-date{white-space:nowrap;font-size:11px}
.payment-method{font-size:11px;text-transform:capitalize}
.order-total{white-space:nowrap;color:#202a3b;font-size:12px}
.status-cell{display:flex;flex-direction:column;align-items:flex-start;gap:7px}
.order-status{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;width:max-content;max-width:100%;padding:6px 8px;border-radius:7px;font-size:10px;font-weight:800;text-transform:capitalize}
.order-status i{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
.status-pending{background:#fff4df;color:#b87916}
.status-processing{background:#eaf1ff;color:#456fca}
.status-shipped{background:#f0eaff;color:#7554c8}
.status-delivered{background:#e4f8ed;color:#238354}
.status-cancelled{background:#ffebec;color:#c04d57}
.status-select{height:31px;max-width:145px;padding:0 7px;font-size:10px}
.status-select:disabled{opacity:.55}
.orders-mobile-list{display:none}
.orders-state{min-height:300px;padding:45px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.orders-state-icon{display:grid;place-items:center;width:58px;height:58px;border-radius:17px;background:#efedff;color:#6254d9;font-size:26px;margin-bottom:16px}
.orders-state-icon.error-icon{background:#fff0f0;color:#c44c58}
.orders-state h3{font-size:17px;color:#273145;margin:0}
.orders-state p{max-width:410px;font-size:12px;line-height:1.7;color:#8992a2;margin:9px 0 18px}
.orders-state code{font-size:11px;color:#6254d9;background:#f1efff;padding:2px 4px;border-radius:4px}
.orders-primary-btn{background:#6254d9;color:#fff;border-color:#6254d9}
.orders-primary-btn:hover{background:#5143c4}
.orders-secondary-btn{margin-top:0}
.orders-spinner{width:32px;height:32px;border:3px solid #e5e2ff;border-top-color:#6254d9;border-radius:50%;animation:orders-spin .8s linear infinite;margin-bottom:17px}
@keyframes orders-spin{to{transform:rotate(360deg)}}
@media(max-width:1200px){.orders-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.orders-table th,.orders-table td{padding-left:12px;padding-right:12px}.orders-table th:first-child,.orders-table td:first-child{padding-left:16px}}
@media(max-width:760px){.orders-heading{align-items:flex-start}.orders-heading p{max-width:400px}.orders-stats{gap:10px}.orders-stat-card{padding:14px 12px;gap:10px}.orders-stat-icon{width:36px;height:36px;font-size:17px}.orders-stat-content span{font-size:10px}.orders-stat-content small{font-size:9px}.orders-panel-header{padding:18px 15px}.orders-filters{padding:14px 15px;flex-direction:column;align-items:stretch}.orders-filters select{max-width:none;width:100%}.orders-table{display:none}.orders-mobile-list{display:grid;gap:12px;padding:13px}.order-mobile-card{padding:15px;border:1px solid #e8ebf2;border-radius:13px;background:white;min-width:0}.order-mobile-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding-bottom:13px;border-bottom:1px solid #edf0f5}.order-mobile-top>div{display:grid;gap:5px;min-width:0}.mobile-muted{font-size:9px;letter-spacing:.8px;color:#8b95a7;font-weight:800}.order-mobile-top>div strong{font-size:12px;color:#5144c8;overflow-wrap:anywhere}.order-mobile-customer{display:flex;align-items:center;gap:10px;padding:14px 0}.customer-avatar{width:36px;height:36px;border-radius:11px;background:#efedff;color:#6254d9;display:grid;place-items:center;font-weight:800;flex-shrink:0}.order-mobile-customer>div:last-child{min-width:0}.order-mobile-customer strong{display:block;font-size:12px;color:#273145;overflow-wrap:anywhere}.order-mobile-customer small{display:block;margin-top:5px;font-size:10px;color:#8992a2}.order-mobile-details{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:13px 0;border-top:1px solid #edf0f5;border-bottom:1px solid #edf0f5}.order-mobile-details>div{min-width:0}.order-mobile-details span{display:block;color:#8992a2;font-size:10px;margin-bottom:6px}.order-mobile-details strong{display:block;color:#273145;font-size:11px;overflow-wrap:anywhere}.mobile-status-label{display:flex;flex-direction:column;gap:8px;margin-top:13px;font-size:11px;font-weight:750;color:#5e687b}.mobile-status-label select{width:100%;max-width:none}.orders-state{min-height:260px;padding:35px 18px}}
@media(max-width:420px){.orders-heading{gap:8px}.orders-heading h2{font-size:23px}.orders-refresh{padding:0 10px;min-height:38px}.orders-stats{grid-template-columns:1fr 1fr}.orders-stat-card{align-items:flex-start;flex-direction:column}.orders-stat-content strong{font-size:20px}.orders-live-label{font-size:9px;padding:6px}.orders-panel-header h3{font-size:15px}}
`;
