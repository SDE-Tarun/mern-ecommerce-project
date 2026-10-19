
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";

const steps = ["Placed", "Processing", "Shipped", "Delivered"];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const styles = `
.orders-page {
  min-height: 100vh;
  padding: 36px 0 50px;
  background: #f5f7fb;
  color: #172033;
  font-family: inherit;
}
.orders-page * { box-sizing: border-box; }
.orders-container { width: min(1120px, calc(100% - 40px)); margin: 0 auto; }
.orders-heading { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; margin-bottom:30px; }
.orders-eyebrow { display:inline-block; margin-bottom:12px; padding:7px 12px; border-radius:30px; background:#eeecff; color:#5b4be0; font-size:11px; font-weight:800; letter-spacing:1.2px; }
.orders-heading h1 { margin:0; font-size:clamp(30px,4vw,42px); line-height:1.15; letter-spacing:-1.3px; font-weight:800; }
.orders-heading h1 span { color:#6556e8; }
.orders-heading p,.orders-list-heading p { margin:10px 0 0; color:#7b8497; font-size:14px; line-height:1.6; }
.orders-secondary-btn,.orders-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:44px; padding:0 18px; border-radius:11px; text-decoration:none; font-size:13px; font-weight:700; cursor:pointer; transition:background .2s ease,transform .2s ease; }
.orders-secondary-btn { border:1px solid #e0e4ed; background:#fff; color:#364057; }
.orders-secondary-btn:hover { border-color:#c8c1ff; color:#5545d6; }
.orders-primary-btn { margin-top:18px; border:0; background:#6254e8; color:#fff; }
.orders-primary-btn:hover { background:#4e40d0; transform:translateY(-1px); }
.orders-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-bottom:34px; }
.orders-stat-card { min-width:0; padding:22px; border:1px solid #e8ebf2; border-radius:18px; background:#fff; box-shadow:0 4px 18px #19234106; }
.orders-stat-top { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.orders-stat-card p { margin:0; color:#68738a; font-size:13px; font-weight:600; }
.orders-stat-card h2 { margin:13px 0 0; font-size:31px; line-height:1.2; letter-spacing:-.7px; }
.orders-stat-card small { display:block; margin-top:8px; color:#98a1b2; font-size:12px; line-height:1.5; }
.orders-stat-icon { display:flex; width:39px; height:39px; align-items:center; justify-content:center; border-radius:12px; font-size:19px; font-weight:700; }
.orders-stat-icon.purple { background:#f0edff; color:#6755df; }
.orders-stat-icon.orange { background:#fff2df; color:#dc8a21; }
.orders-stat-icon.green { background:#e7f8ef; color:#15965a; }
.orders-list-heading { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:17px; }
.orders-list-heading h2 { margin:0; font-size:22px; letter-spacing:-.4px; }
.orders-list-heading p { margin-top:5px; font-size:13px; }
.orders-live { display:inline-flex; align-items:center; gap:8px; color:#778197; font-size:12px; white-space:nowrap; }
.orders-live i { width:8px; height:8px; border-radius:50%; background:#1bb879; box-shadow:0 0 0 4px #e2f8ed; }
.orders-list { display:grid; gap:22px; }
.order-card { overflow:hidden; border:1px solid #e6eaf1; border-radius:19px; background:#fff; box-shadow:0 5px 22px #1b274908; transition:box-shadow .2s ease; }
.order-card:hover { box-shadow:0 9px 28px #1b274912; }
.order-card-header { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:21px 25px; border-bottom:1px solid #edf0f5; background:linear-gradient(110deg,#fff 20%,#fafaff 100%); }
.order-id-label { color:#8c95a7; font-size:10px; font-weight:800; letter-spacing:1.2px; }
.order-card-header h3 { display:inline-block; margin:6px 0 0; color:#202a40; font-size:15px; font-weight:800; letter-spacing:.3px; }
.order-card-header p { margin:7px 0 0; color:#858ea0; font-size:12px; }
.order-status { display:inline-flex; flex-shrink:0; align-items:center; gap:7px; padding:9px 12px; border:1px solid transparent; border-radius:30px; font-size:12px; font-weight:800; }
.order-status i { width:7px; height:7px; border-radius:50%; background:currentColor; }
.status-placed { border-color:#d9e6ff; background:#edf4ff; color:#3065c9; }
.status-processing { border-color:#f6e5b7; background:#fff8e5; color:#a66a08; }
.status-shipped { border-color:#e4d9ff; background:#f3edff; color:#7650c9; }
.status-delivered { border-color:#c9eedb; background:#eaf9f0; color:#14824b; }
.status-cancelled { border-color:#ffd8d8; background:#fff0f0; color:#c33d3d; }
.order-card-body { padding:24px 25px; }
.order-section-label { margin:0 0 18px; color:#929bad; font-size:10px; font-weight:800; letter-spacing:1.1px; text-transform:uppercase; }
.order-products { display:grid; gap:19px; }
.order-product { display:flex; align-items:center; gap:17px; min-width:0; }
.order-product-image { display:flex; width:84px; height:84px; flex-shrink:0; align-items:center; justify-content:center; overflow:hidden; border:1px solid #edf0f5; border-radius:13px; background:#f8f9fc; font-size:27px; }
.order-product-image img { width:100%; height:100%; padding:5px; object-fit:contain; }
.order-product-info { flex:1; min-width:0; }
.order-product-info h4 { margin:0; color:#273148; font-size:14px; font-weight:700; line-height:1.5; overflow-wrap:anywhere; }
.order-product-info p { margin:5px 0; color:#838da0; font-size:12px; }
.order-product-info strong,.order-product-subtotal strong { color:#252f44; font-size:13px; font-weight:800; }
.order-product-info strong small { color:#929bad; font-size:11px; font-weight:400; }
.order-product-subtotal { flex-shrink:0; text-align:right; }
.order-product-subtotal small,.order-total-row small { display:block; margin-bottom:6px; color:#8d96a7; font-size:11px; }
.order-total-row { display:flex; justify-content:space-between; align-items:center; gap:15px; margin-top:24px; padding:17px 19px; border:1px solid #edf0f6; border-radius:13px; background:#f8f9fc; }
.order-total-row>div:first-child strong { display:block; color:#354058; font-size:13px; }
.order-payment-note { display:block; margin-top:4px; color:#8d96a7; font-size:11px; }
.order-total { text-align:right; }
.order-total strong { color:#202940; font-size:23px; font-weight:800; letter-spacing:-.5px; }
.order-tracking { margin-top:28px; }
.order-tracking-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:23px; }
.order-tracking-heading h4,.order-address h4 { margin:0; color:#2b354a; font-size:14px; font-weight:800; }
.order-tracking-heading>span { color:#9099aa; font-size:11px; }
.order-steps { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); padding:0 4px; }
.order-step { display:flex; min-width:0; flex-direction:column; align-items:center; text-align:center; }
.order-step-track { display:flex; width:100%; align-items:center; }
.order-step-line { height:3px; flex:1; background:#e5e9f1; }
.order-step-line.completed { background:#1cac70; }
.order-step-dot { display:flex; width:26px; height:26px; flex-shrink:0; align-items:center; justify-content:center; border:2px solid #e1e6ef; border-radius:50%; background:#fff; color:#a1a9b8; font-size:10px; font-weight:800; }
.order-step-dot.completed { border-color:#1cac70; background:#1cac70; color:#fff; }
.order-step-dot.current { box-shadow:0 0 0 4px #dff7eb; }
.step-label { margin-top:11px; color:#a0a8b7; font-size:12px; font-weight:600; }
.step-label.active { color:#168450; font-weight:800; }
.order-step>small { margin-top:4px; color:#6556dc; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.5px; }
.order-cancelled-message { padding:15px; border:1px solid #ffdada; border-radius:12px; background:#fff3f3; color:#b83232; font-size:13px; }
.order-address { display:flex; align-items:flex-start; gap:13px; margin-top:28px; padding-top:21px; border-top:1px solid #edf0f5; }
.order-address-icon { display:flex; width:39px; height:39px; flex-shrink:0; align-items:center; justify-content:center; border-radius:11px; background:#efedff; color:#6656db; font-size:23px; }
.order-address strong { display:block; margin-top:8px; color:#465169; font-size:12px; }
.order-address p { margin:5px 0 0; color:#818b9e; font-size:12px; line-height:1.7; overflow-wrap:anywhere; }
.orders-empty { padding:55px 24px; border:1px dashed #dce1eb; border-radius:19px; background:#fff; text-align:center; }
.orders-empty-icon { display:flex; width:70px; height:70px; align-items:center; justify-content:center; margin:0 auto 18px; border-radius:20px; background:#efedff; font-size:30px; }
.orders-empty h2 { margin:0; color:#263148; font-size:21px; }
.orders-empty p { max-width:430px; margin:10px auto 0; color:#7c869a; font-size:13px; line-height:1.7; }
.orders-loading { padding:70px 15px; color:#707b90; text-align:center; font-size:14px; }
.orders-footer-note { margin:26px 0 0; color:#9aa2b1; text-align:center; font-size:11px; }
@media(max-width:700px) {
  .orders-page { padding:25px 0 35px; }
  .orders-container { width:calc(100% - 28px); }
  .orders-heading { align-items:flex-start; flex-direction:column; gap:17px; margin-bottom:23px; }
  .orders-heading p { font-size:13px; }
  .orders-stats { grid-template-columns:1fr; gap:11px; margin-bottom:28px; }
  .orders-stat-card { padding:16px 18px; }
  .orders-stat-card h2 { font-size:26px; }
  .orders-stat-card small { margin-top:5px; }
  .orders-list-heading h2 { font-size:19px; }
  .orders-live { font-size:10px; }
  .order-card { border-radius:15px; }
  .order-card-header { align-items:flex-start; padding:17px; }
  .order-status { padding:7px 9px; font-size:10px; }
  .order-card-body { padding:18px 16px; }
  .order-product { gap:11px; }
  .order-product-image { width:65px; height:65px; border-radius:10px; }
  .order-product-info h4 { font-size:12px; }
  .order-product-info p { font-size:11px; }
  .order-product-info strong,.order-product-subtotal strong { font-size:12px; }
  .order-product-subtotal small { font-size:10px; }
  .order-total-row { padding:14px; }
  .order-total strong { font-size:20px; }
  .order-tracking { margin-top:24px; }
  .order-steps { padding:0; }
  .order-step-dot { width:23px; height:23px; }
  .step-label { font-size:10px; }
  .order-address { margin-top:24px; }
}
@media(max-width:390px) {
  .orders-container { width:calc(100% - 22px); }
  .orders-list-heading { align-items:flex-start; }
  .orders-live { gap:5px; font-size:9px; }
  .order-card-header { gap:8px; padding:14px 12px; }
  .order-card-header h3 { font-size:13px; }
  .order-card-body { padding:15px 11px; }
  .order-product { gap:8px; }
  .order-product-image { width:55px; height:55px; }
  .order-product-subtotal small { font-size:9px; }
  .order-product-subtotal strong { font-size:11px; }
  .order-total-row { gap:8px; padding:12px 10px; }
  .order-total strong { font-size:18px; }
  .step-label { font-size:9px; }
}
`;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const response = await api.get("/order/my-orders");
      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Please log in to view your orders."
          : "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const activeCount = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.status)
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <>
      <style>{styles}</style>
      <main className="orders-page">
        <div className="orders-container">
          {loading ? (
            <div className="orders-loading">Loading your orders...</div>
          ) : error ? (
            <div className="orders-empty">
              <h2>We couldn't load your orders</h2>
              <p>{error}</p>
              <button
                className="orders-primary-btn"
                onClick={() => fetchOrders(true)}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <section className="orders-heading">
                <div>
                  <span className="orders-eyebrow">YOUR ACCOUNT</span>
                  <h1>My Orders<span>.</span></h1>
                  <p>Track your purchases and follow every delivery.</p>
                </div>
                <Link to="/" className="orders-secondary-btn">
                  ← Continue shopping
                </Link>
              </section>

              <section className="orders-stats">
                <div className="orders-stat-card">
                  <div className="orders-stat-top">
                    <p>Total orders</p>
                    <span className="orders-stat-icon purple">▣</span>
                  </div>
                  <h2>{orders.length}</h2>
                  <small>All your purchases</small>
                </div>
                <div className="orders-stat-card">
                  <div className="orders-stat-top">
                    <p>In progress</p>
                    <span className="orders-stat-icon orange">↗</span>
                  </div>
                  <h2>{activeCount}</h2>
                  <small>Orders on the way</small>
                </div>
                <div className="orders-stat-card">
                  <div className="orders-stat-top">
                    <p>Delivered</p>
                    <span className="orders-stat-icon green">✓</span>
                  </div>
                  <h2>{deliveredCount}</h2>
                  <small>Successfully delivered</small>
                </div>
              </section>

              <section className="orders-list-heading">
                <div>
                  <h2>Order history</h2>
                  <p>{orders.length} {orders.length === 1 ? "order" : "orders"} found</p>
                </div>
                <span className="orders-live"><i /> Live status updates</span>
              </section>

              {orders.length === 0 ? (
                <div className="orders-empty">
                  <div className="orders-empty-icon">🛍️</div>
                  <h2>Your shopping journey starts here</h2>
                  <p>You haven't placed any orders yet. Explore the store to find something you love.</p>
                  <Link to="/" className="orders-primary-btn">Explore store</Link>
                </div>
              ) : (
                <section className="orders-list">
                  {orders.map((order) => {
                    const status = order.status || "Placed";
                    const cancelled = status === "Cancelled";
                    const currentStep = steps.indexOf(status);

                    return (
                      <article className="order-card" key={order._id}>
                        <header className="order-card-header">
                          <div>
                            <span className="order-id-label">ORDER ID</span>
                            <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                            <p>Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`order-status status-${status.toLowerCase()}`}>
                            <i /> {status}
                          </span>
                        </header>

                        <div className="order-card-body">
                          <h4 className="order-section-label">Items in this order</h4>
                          <div className="order-products">
                            {(order.items || []).map((item, index) => {
                              const product = item.productId;
                              const image =
                                product?.image ||
                                product?.imageUrl ||
                                product?.images?.[0];

                              return (
                                <div className="order-product" key={`${order._id}-${index}`}>
                                  <div className="order-product-image">
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={product?.title || "Product"}
                                        onError={(event) => {
                                          event.currentTarget.style.visibility = "hidden";
                                        }}
                                      />
                                    ) : "🛍️"}
                                  </div>
                                  <div className="order-product-info">
                                    <h4>{product?.title || "Product"}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <strong>{money(item.price)} <small>/ item</small></strong>
                                  </div>
                                  <div className="order-product-subtotal">
                                    <small>Subtotal</small>
                                    <strong>{money(Number(item.price) * Number(item.quantity))}</strong>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="order-total-row">
                            <div>
                              <small>Payment method</small>
                              <strong>{order.paymentMethod || "COD"}</strong>
                              {order.paymentMethod === "COD" && (
                                <span className="order-payment-note">Pay on delivery</span>
                              )}
                            </div>
                            <div className="order-total">
                              <small>Order total</small>
                              <strong>{money(order.totalAmount)}</strong>
                            </div>
                          </div>

                          <section className="order-tracking">
                            <div className="order-tracking-heading">
                              <h4>Delivery progress</h4>
                              {!cancelled && (
                                <span>Step {Math.max(currentStep + 1, 1)} of {steps.length}</span>
                              )}
                            </div>

                            {cancelled ? (
                              <div className="order-cancelled-message">
                                This order has been cancelled.
                              </div>
                            ) : (
                              <div className="order-steps">
                                {steps.map((step, index) => {
                                  const complete = currentStep >= index;
                                  const current = currentStep === index;

                                  return (
                                    <div className="order-step" key={step}>
                                      <div className="order-step-track">
                                        {index > 0 && (
                                          <span className={`order-step-line ${currentStep >= index ? "completed" : ""}`} />
                                        )}
                                        <span className={`order-step-dot ${complete ? "completed" : ""} ${current ? "current" : ""}`}>
                                          {complete ? "✓" : index + 1}
                                        </span>
                                        {index < steps.length - 1 && (
                                          <span className={`order-step-line ${currentStep > index ? "completed" : ""}`} />
                                        )}
                                      </div>
                                      <span className={`step-label ${complete ? "active" : ""}`}>{step}</span>
                                      {current && <small>Current</small>}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </section>

                          <section className="order-address">
                            <div className="order-address-icon">⌖</div>
                            <div>
                              <h4>Delivery address</h4>
                              <strong>{order.address?.fullName}</strong>
                              <p>
                                {[
                                  order.address?.addressLine,
                                  order.address?.city,
                                  order.address?.state,
                                  order.address?.pincode,
                                ].filter(Boolean).join(", ")}
                              </p>
                              {order.address?.phone && <p>Phone: {order.address.phone}</p>}
                            </div>
                          </section>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}

              <p className="orders-footer-note">
                Order statuses refresh automatically while this page is open.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default MyOrders;
