import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch products and orders concurrently
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders").catch(() => ({ data: [] })) // Fallback agar orders endpoint mein kuch error ho
        ]);

        if (mounted) {
          setProducts(
            Array.isArray(productsRes.data) ? productsRes.data : []
          );
          setOrders(
            Array.isArray(ordersRes.data) ? ordersRes.data : []
          );
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError(
            "Unable to load dashboard data. Please check your backend connection."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const lowStockCount = products.filter(
    (product) => Number(product.stock) <= 5
  ).length;

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.prices || 0) * Number(product.stock || 0),
    0
  );

  const totalOrdersCount = orders.length;

  const statCards = [
    {
      label: "Total Products",
      value: loading ? "..." : products.length,
      note: "Products in catalogue",
      icon: "▣",
      color: "#6366f1",
      background: "#eef2ff",
    },
    {
      label: "Low Stock",
      value: loading ? "..." : lowStockCount,
      note: "Products with stock ≤ 5",
      icon: "!",
      color: "#ea580c",
      background: "#fff7ed",
    },
    {
      label: "Inventory Value",
      value: loading
        ? "..."
        : `₹${inventoryValue.toLocaleString("en-IN")}`,
      note: "Price × available stock",
      icon: "₹",
      color: "#059669",
      background: "#ecfdf5",
    },
    {
      label: "Total Orders",
      value: loading ? "..." : totalOrdersCount,
      note: "Live orders placed by customers",
      icon: "▤",
      color: "#2563eb",
      background: "#eff6ff",
    },
  ];

  const styles = {
    page: {
      width: "100%",
      minWidth: 0,
      color: "#111827",
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    welcome: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "18px",
      marginBottom: "28px",
    },
    eyebrow: {
      color: "#6366f1",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.6px",
    },
    heading: {
      margin: "9px 0 8px",
      fontSize: "clamp(23px, 3vw, 30px)",
      letterSpacing: "-0.8px",
      lineHeight: 1.25,
    },
    description: {
      margin: 0,
      color: "#6b7280",
      fontSize: "13px",
      lineHeight: 1.7,
    },
    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 17px",
      borderRadius: "10px",
      background: "#4f46e5",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "13px",
      boxShadow: "0 5px 14px #4f46e52b",
      whiteSpace: "nowrap",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "16px",
      marginBottom: "32px",
    },
    statCard: {
      padding: "20px",
      borderRadius: "14px",
      border: "1px solid #e9edf4",
      background: "#fff",
      minWidth: 0,
      boxShadow: "0 2px 8px #11182704",
    },
    statIcon: {
      width: "43px",
      height: "43px",
      borderRadius: "12px",
      display: "grid",
      placeItems: "center",
      fontSize: "21px",
      fontWeight: 800,
      marginBottom: "19px",
    },
    statLabel: {
      margin: "0 0 9px",
      color: "#6b7280",
      fontSize: "12px",
      fontWeight: 600,
    },
    statValue: {
      margin: 0,
      fontSize: "clamp(22px, 2.4vw, 29px)",
      fontWeight: 800,
      letterSpacing: "-0.7px",
      overflowWrap: "anywhere",
    },
    statNote: {
      margin: "9px 0 0",
      color: "#9ca3af",
      fontSize: "11px",
      lineHeight: 1.5,
    },
    section: {
      marginTop: "30px",
    },
    sectionTitle: {
      margin: "0 0 6px",
      fontSize: "19px",
      fontWeight: 750,
      letterSpacing: "-0.3px",
    },
    sectionSubtitle: {
      margin: 0,
      color: "#6b7280",
      fontSize: "12px",
      lineHeight: 1.6,
    },
    actionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "16px",
      marginTop: "17px",
    },
    actionCard: {
      display: "block",
      minWidth: 0,
      padding: "21px",
      background: "#fff",
      border: "1px solid #e9edf4",
      borderRadius: "14px",
      textDecoration: "none",
      color: "#111827",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
    },
    actionIcon: {
      width: "43px",
      height: "43px",
      display: "grid",
      placeItems: "center",
      borderRadius: "12px",
      fontSize: "21px",
      fontWeight: 800,
      marginBottom: "17px",
    },
    actionTitle: {
      margin: "0 0 9px",
      fontSize: "15px",
      fontWeight: 750,
    },
    actionDescription: {
      minHeight: "40px",
      margin: "0 0 17px",
      color: "#6b7280",
      fontSize: "12px",
      lineHeight: 1.7,
    },
    actionLink: {
      color: "#4f46e5",
      fontSize: "12px",
      fontWeight: 750,
    },
    recentContainer: {
      marginTop: "17px",
      background: "#fff",
      border: "1px solid #e9edf4",
      borderRadius: "14px",
      overflow: "hidden",
    },
    productRow: {
      display: "flex",
      alignItems: "center",
      gap: "13px",
      padding: "14px 18px",
      borderBottom: "1px solid #f0f2f6",
      minWidth: 0,
    },
    productImage: {
      width: "49px",
      height: "49px",
      borderRadius: "10px",
      objectFit: "cover",
      background: "#f3f4f6",
      flexShrink: 0,
    },
    productDetails: {
      flex: 1,
      minWidth: 0,
    },
    productTitle: {
      margin: "0 0 5px",
      fontSize: "13px",
      fontWeight: 700,
      overflowWrap: "anywhere",
    },
    productCategory: {
      margin: 0,
      fontSize: "11px",
      color: "#9ca3af",
    },
    productPrice: {
      fontSize: "13px",
      fontWeight: 750,
      whiteSpace: "nowrap",
    },
    editLink: {
      color: "#4f46e5",
      background: "#eef2ff",
      textDecoration: "none",
      borderRadius: "7px",
      padding: "8px 11px",
      fontSize: "11px",
      fontWeight: 750,
      flexShrink: 0,
    },
    empty: {
      padding: "30px 18px",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "13px",
    },
  };

  const actions = [
    {
      title: "Manage Products",
      description: "View your catalogue, update product details or remove products.",
      link: "/admin/products",
      linkText: "View all products",
      icon: "▣",
      color: "#6366f1",
      background: "#eef2ff",
    },
    {
      title: "Add New Product",
      description: "Create a product with its price, category, image and stock.",
      link: "/admin/products/add",
      linkText: "Create a product",
      icon: "＋",
      color: "#059669",
      background: "#ecfdf5",
    },
    {
      title: "Order Management",
      description: "View customer orders, fulfillment status and details.",
      link: "/admin/orders",
      linkText: "View all orders",
      icon: "▤",
      color: "#2563eb",
      background: "#eff6ff",
    },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        .dashboard-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(15,23,42,0.07);
        }

        .dashboard-primary-button:hover {
          background: #4338ca !important;
        }

        .dashboard-edit-button:hover {
          background: #e0e7ff !important;
        }

        @media (max-width: 1100px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .dashboard-action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          .dashboard-stats-grid {
            gap: 10px !important;
          }

          .dashboard-stat-card {
            padding: 14px !important;
          }

          .dashboard-action-grid {
            grid-template-columns: 1fr !important;
          }

          .dashboard-product-row {
            padding: 12px !important;
            gap: 9px !important;
          }

          .dashboard-product-image {
            width: 40px !important;
            height: 40px !important;
          }

          .dashboard-product-price {
            font-size: 11px !important;
          }

          .dashboard-edit-button {
            padding: 7px !important;
          }
        }
      `}</style>

      <section style={styles.welcome}>
        <div>
          <span style={styles.eyebrow}>STORE OVERVIEW</span>
          <h1 style={styles.heading}>Welcome back, Admin 👋</h1>
          <p style={styles.description}>
            Here's what's happening with your store today.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="dashboard-primary-button"
          style={styles.primaryButton}
        >
          <span style={{ fontSize: "18px" }}>＋</span>
          Add Product
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          style={{
            padding: "14px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      <section
        className="dashboard-stats-grid"
        style={styles.statsGrid}
      >
        {statCards.map((stat) => (
          <article
            key={stat.label}
            className="dashboard-stat-card"
            style={styles.statCard}
          >
            <div
              style={{
                ...styles.statIcon,
                color: stat.color,
                background: stat.background,
              }}
            >
              {stat.icon}
            </div>

            <p style={styles.statLabel}>{stat.label}</p>
            <h2 style={styles.statValue}>{stat.value}</h2>
            <p style={styles.statNote}>{stat.note}</p>
          </article>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <p style={styles.sectionSubtitle}>
          Shortcuts to your most-used store operations.
        </p>

        <div
          className="dashboard-action-grid"
          style={styles.actionGrid}
        >
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="dashboard-action-card"
              style={styles.actionCard}
            >
              <div
                style={{
                  ...styles.actionIcon,
                  color: action.color,
                  background: action.background,
                }}
              >
                {action.icon}
              </div>

              <h3 style={styles.actionTitle}>{action.title}</h3>
              <p style={styles.actionDescription}>
                {action.description}
              </p>
              <span style={styles.actionLink}>
                {action.linkText} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2 style={styles.sectionTitle}>Recent Products</h2>
            <p style={styles.sectionSubtitle}>
              Latest products in your catalogue.
            </p>
          </div>

          <Link
            to="/admin/products"
            style={{
              color: "#4f46e5",
              fontSize: "12px",
              fontWeight: 750,
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>

        <div style={styles.recentContainer}>
          {loading ? (
            <div style={styles.empty}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                ▣
              </div>
              <strong style={{ display: "block", color: "#374151" }}>
                No products found
              </strong>
              <p>Add your first product to get started.</p>
              <Link to="/admin/products/add" style={styles.actionLink}>
                + Add your first product
              </Link>
            </div>
          ) : (
            products.slice(0, 5).map((product, index, visibleProducts) => (
              <div
                key={product._id}
                className="dashboard-product-row"
                style={{
                  ...styles.productRow,
                  borderBottom:
                    index === visibleProducts.length - 1
                      ? "none"
                      : styles.productRow.borderBottom,
                }}
              >
                <img
                  className="dashboard-product-image"
                  src={product.image}
                  alt={product.title || "Product"}
                  style={styles.productImage}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://placehold.co/100x100?text=Product";
                  }}
                />

                <div style={styles.productDetails}>
                  <h3 style={styles.productTitle}>
                    {product.title || "Untitled Product"}
                  </h3>
                  <p style={styles.productCategory}>
                    {product.category || "Uncategorised"} · Stock:{" "}
                    {Number(product.stock || 0)}
                  </p>
                </div>

                <span
                  className="dashboard-product-price"
                  style={styles.productPrice}
                >
                  ₹{Number(product.prices || 0).toLocaleString("en-IN")}
                </span>

                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="dashboard-edit-button"
                  style={styles.editLink}
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}