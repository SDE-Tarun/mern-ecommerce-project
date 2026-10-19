
import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: "dashboard", end: true },
  { label: "All Products", path: "/admin/products", icon: "products" },
  { label: "Add Product", path: "/admin/products/add", icon: "add" },
  { label: "Orders", path: "/admin/orders", icon: "orders" },
];

function StoreLogo({ size = 44 }) {
  return (
    <div className="store-logo" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width="70%" height="70%" fill="none">
        <path d="M8 19.5 12 8h24l4 11.5" stroke="white" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M7 19.5h34v20H7z" fill="white" fillOpacity=".12" stroke="white" strokeWidth="2.5" />
        <path d="M18 39.5V27h12v12.5" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M5.5 19.5c0 4 6.5 4.5 8 0 1.5 4.5 8 4 9.5 0 1.5 4 8 4.5 9.5 0 1.5 4.5 8 4 10 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function MenuIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    products: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>,
    add: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
    orders: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const adminName = localStorage.getItem("name") || "Administrator";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const currentPage =
    menuItems.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    )?.label || "Admin Workspace";

  function logout() {
    ["token", "name", "user", "role", "userId", "adminId"].forEach(
      (key) => localStorage.removeItem(key)
    );
    navigate("/login", { replace: true });
  }

  return (
    <div className="as-shell">
      <style>{`
        .as-shell{--as-purple:#6558df;--as-purple-dark:#5144c8;--as-ink:#172033;--as-muted:#8b95a7;--as-border:#e9ecf3;display:flex;min-height:100vh;background:#f6f7fb;color:var(--as-ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .as-shell *{box-sizing:border-box}
        .as-sidebar{width:258px;flex:0 0 258px;min-height:100vh;height:100vh;position:sticky;top:0;display:flex;flex-direction:column;padding:25px 16px 18px;background:linear-gradient(180deg,#151b2c 0%,#101625 100%);color:#fff;z-index:100;overflow-y:auto}
        .as-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff;padding:3px 8px 29px}
        .store-logo{display:grid;place-items:center;flex-shrink:0;border-radius:14px;background:linear-gradient(135deg,#8175ff,#5747d9);box-shadow:0 7px 20px #5144c855}
        .as-brand-name{font-size:18px;font-weight:850;letter-spacing:-.45px;display:block}
        .as-brand-caption{display:block;margin-top:5px;color:#a5afc4;font-size:9px;font-weight:750;letter-spacing:1.9px}
        .as-menu-caption{padding:0 12px;margin:4px 0 12px;color:#78839a;font-size:10px;font-weight:800;letter-spacing:1.7px}
        .as-nav{display:grid;gap:6px}
        .as-nav-link{position:relative;display:flex;align-items:center;gap:13px;min-height:47px;padding:0 13px;border-radius:11px;text-decoration:none;color:#aeb8ca;font-size:13px;font-weight:600;transition:background .2s,color .2s}
        .as-nav-link:hover{background:#ffffff0c;color:#fff}
        .as-nav-link.active{background:linear-gradient(100deg,#5144c8,#6558df);color:white;box-shadow:0 6px 18px #5144c833}
        .as-nav-link.active:before{content:"";position:absolute;left:-16px;top:11px;bottom:11px;width:3px;border-radius:0 4px 4px 0;background:#a99fff}
        .as-nav-label{flex:1}
        .as-nav-pill{font-size:9px;letter-spacing:.2px;border-radius:5px;padding:4px 6px;background:#ffffff17;color:#dcd9ff}
        .as-sidebar-bottom{margin-top:auto;padding-top:25px}
        .as-sidebar-tip{padding:15px;margin-bottom:16px;border:1px solid #ffffff12;border-radius:13px;background:linear-gradient(135deg,#ffffff0c,#ffffff04)}
        .as-tip-icon{font-size:18px;margin-bottom:9px}
        .as-sidebar-tip strong{display:block;font-size:12px;color:#f4f5ff}
        .as-sidebar-tip p{font-size:11px;color:#98a4b9;line-height:1.6;margin:6px 0 0}
        .as-profile{display:flex;align-items:center;gap:10px;padding:16px 5px 13px;border-top:1px solid #ffffff18;min-width:0}
        .as-avatar{width:39px;height:39px;display:grid;place-items:center;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#8b80ff,#4e42c5);font-size:15px;font-weight:850;color:#fff}
        .as-profile-name{display:block;font-size:12px;font-weight:750;color:#f4f6fb;overflow-wrap:anywhere}
        .as-profile-role{display:block;margin-top:5px;font-size:10px;color:#97a2b6}
        .as-sidebar-action{display:flex;align-items:center;gap:10px;width:100%;padding:11px 10px;border:0;border-radius:9px;background:transparent;color:#aeb8ca;text-decoration:none;text-align:left;font-size:12px;font-weight:650;cursor:pointer}
        .as-sidebar-action:hover{background:#ffffff0c;color:white}
        .as-main{flex:1;min-width:0}
        .as-header{position:sticky;top:0;z-index:50;min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 32px;background:#ffffffed;backdrop-filter:blur(14px);border-bottom:1px solid var(--as-border)}
        .as-header-left{display:flex;align-items:center;gap:13px;min-width:0}
        .as-overline{font-size:9px;font-weight:850;letter-spacing:1.7px;color:var(--as-purple);margin-bottom:6px}
        .as-page-title{margin:0;font-size:21px;font-weight:800;letter-spacing:-.55px;color:#1a2234}
        .as-header-right{display:flex;align-items:center;gap:12px}
        .as-store-link{display:flex;align-items:center;gap:8px;text-decoration:none;border:1px solid #e3e6ef;border-radius:10px;padding:10px 13px;color:#394257;background:white;font-size:12px;font-weight:700;white-space:nowrap;transition:background .2s}
        .as-store-link:hover{background:#f1efff;border-color:#d8d3ff}
        .as-status-dot{width:7px;height:7px;border-radius:50%;background:#2cb67d;box-shadow:0 0 0 3px #2cb67d1c}
        .as-content{width:100%;max-width:1700px;margin:0 auto;padding:30px}
        .as-menu-toggle{display:none;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid #e2e5ee;border-radius:10px;background:white;color:#293349;font-size:20px;cursor:pointer}
        .as-overlay{display:none}
        @media(max-width:1000px){.as-sidebar{width:235px;flex-basis:235px}.as-header{padding:15px 22px}.as-content{padding:24px 20px}}
        @media(max-width:760px){.as-sidebar{position:fixed;inset:0 auto 0 0;width:275px;max-width:85vw;height:100dvh;min-height:100dvh;transform:translateX(-105%);transition:transform .25s ease;box-shadow:15px 0 45px #11182730}.as-sidebar.as-open{transform:translateX(0)}.as-overlay.as-overlay-open{display:block;position:fixed;inset:0;z-index:99;background:#0f172ab3;backdrop-filter:blur(2px)}.as-menu-toggle{display:flex}.as-header{min-height:73px;padding:12px 16px}.as-content{padding:20px 15px}.as-page-title{font-size:18px}.as-overline{font-size:8px}.as-store-link{padding:10px}.as-store-label{display:none}}
        @media(max-width:400px){.as-header{padding:11px 10px;gap:8px}.as-content{padding:16px 10px}.as-page-title{font-size:16px}.as-header-left{gap:8px}.as-menu-toggle{width:36px;height:36px}.as-store-link{padding:9px}}
        @media(prefers-reduced-motion:reduce){.as-shell *{transition:none!important}}
      `}</style>

      <div
        className={`as-overlay ${mobileMenuOpen ? "as-overlay-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={`as-sidebar ${mobileMenuOpen ? "as-open" : ""}`}>
        <Link to="/admin" className="as-brand">
          <StoreLogo />
          <span>
            <span className="as-brand-name">Apna Store</span>
            <span className="as-brand-caption">ADMIN WORKSPACE</span>
          </span>
        </Link>

        <p className="as-menu-caption">WORKSPACE</p>

        <nav className="as-nav" aria-label="Admin navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `as-nav-link ${isActive ? "active" : ""}`
              }
            >
              <MenuIcon name={item.icon} />
              <span className="as-nav-label">{item.label}</span>
              {item.label === "Orders" && (
                <span className="as-nav-pill">Manage</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="as-sidebar-bottom">
          <div className="as-sidebar-tip">
            <div className="as-tip-icon">✦</div>
            <strong>Your store, your control.</strong>
            <p>Manage products and keep your store organized from one place.</p>
          </div>

          <div className="as-profile">
            <div className="as-avatar">
              {adminName.trim().charAt(0).toUpperCase() || "A"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span className="as-profile-name">{adminName}</span>
              <span className="as-profile-role">Store Administrator</span>
            </div>
          </div>

          <button className="as-sidebar-action" onClick={logout}>
            <span>↪</span> Sign out
          </button>
          <Link to="/" className="as-sidebar-action">
            <span>↗</span> Back to store
          </Link>
        </div>
      </aside>

      <main className="as-main">
        <header className="as-header">
          <div className="as-header-left">
            <button
              className="as-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>
            <div>
              <div className="as-overline">APNA STORE / ADMIN</div>
              <h1 className="as-page-title">{currentPage}</h1>
            </div>
          </div>

          <div className="as-header-right">
            <span className="as-status-dot" />
            <Link to="/" className="as-store-link">
              <span className="as-store-label">Visit storefront</span>
              <span>↗</span>
            </Link>
          </div>
        </header>

        <div className="as-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
