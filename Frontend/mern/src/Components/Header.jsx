import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";

export default function Navbar() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(() =>
    localStorage.getItem("userId")
  );
  const [userName, setUserName] = useState(() =>
    localStorage.getItem("name") ||
    localStorage.getItem("userName") ||
    ""
  );
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getUserName = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user?.name) return user.name;
      } catch {
        // Fall back to individual localStorage fields
      }
    }

    return (
      localStorage.getItem("name") ||
      localStorage.getItem("userName") ||
      ""
    );
  };

  const syncUser = useCallback(() => {
    setUserId(localStorage.getItem("userId"));
    setUserName(getUserName());
  }, []);

  const loadCart = useCallback(async () => {
    const currentUserId = localStorage.getItem("userId");

    if (!currentUserId) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get(`/cart/${currentUserId}`);
      const items = res.data.items || [];

      setCartCount(
        items.reduce(
          (sum, item) => sum + (Number(item.quantity) || 0),
          0
        )
      );
    } catch (error) {
      console.error("Failed to load cart count:", error);
    }
  }, []);

  useEffect(() => {
    syncUser();
    loadCart();

    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser, loadCart]);

  const closeMenu = () => setIsMenuOpen(false);

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setUserName("");
    setCartCount(0);
    setIsMenuOpen(false);

    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  return (
    <>
      <header className="apna-header">
        <nav className="apna-header-inner">
          {/* Logo Brand */}
          <Link
            to="/"
            className="apna-brand"
            onClick={closeMenu}
          >
            <span className="apna-brand-icon">🛍️</span>
            <span className="apna-brand-name">
              Apna<span className="apna-brand-highlight">Store</span>
            </span>
          </Link>

          {/* Mobile Top Actions */}
          <div className="apna-mobile-top-actions">
            <Link
              to="/user/cart"
              className="apna-header-cart apna-cart-mobile"
              onClick={closeMenu}
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <span className="apna-cart-icon" aria-hidden="true">
                🛒
              </span>
              {cartCount > 0 && (
                <span className="apna-cart-badge">{cartCount}</span>
              )}
            </Link>

            <button
              type="button"
              className="apna-hamburger"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span
                className={`apna-burger-bar ${isMenuOpen ? "open" : ""}`}
              ></span>
              <span
                className={`apna-burger-bar ${isMenuOpen ? "open" : ""}`}
              ></span>
              <span
                className={`apna-burger-bar ${isMenuOpen ? "open" : ""}`}
              ></span>
            </button>
          </div>

          {/* Navigation Actions Menu */}
          <div
            className={`apna-header-actions ${
              isMenuOpen ? "is-open" : ""
            }`}
          >
            {userId && userName && (
              <div className="apna-welcome">
                <span className="apna-avatar">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="apna-welcome-text">
                  Hello, <strong>{userName}</strong>
                </span>
              </div>
            )}

            {/* My Orders - visible only when logged in */}
            {userId && (
              <Link
                to="/my-orders"
                className="apna-my-orders-link"
                onClick={closeMenu}
              >
                <span className="apna-orders-icon" aria-hidden="true">
                  📦
                </span>
                <span>My Orders</span>
              </Link>
            )}

            {/* Desktop Cart */}
            <Link
              to="/user/cart"
              className="apna-header-cart apna-cart-desktop"
              onClick={closeMenu}
            >
              <span className="apna-cart-icon" aria-hidden="true">
                🛒
              </span>
              <span>Cart</span>
              <span className="apna-cart-badge">{cartCount}</span>
            </Link>

            {!userId ? (
              <div className="apna-auth-group">
                <Link
                  to="/login"
                  className="apna-login-link"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="apna-signup-link"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                type="button"
                className="apna-logout-button"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .apna-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(4, 120, 87, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px -2px rgba(4, 120, 87, 0.25);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .apna-header-inner {
          width: 100%;
          max-width: 1240px;
          min-height: 68px;
          margin: 0 auto;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .apna-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          transition: transform 0.2s ease;
        }

        .apna-brand:hover {
          transform: translateY(-1px);
        }

        .apna-brand-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 20px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .apna-brand-highlight {
          color: #a7f3d0;
        }

        .apna-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .apna-welcome {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          padding: 6px 14px 6px 8px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ecfdf5;
          font-size: 13.5px;
        }

        .apna-avatar {
          display: grid;
          place-items: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ecfdf5;
          color: #047857;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .apna-welcome-text strong {
          color: #ffffff;
          font-weight: 700;
        }

        .apna-auth-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .apna-header-cart,
        .apna-my-orders-link,
        .apna-login-link,
        .apna-signup-link,
        .apna-logout-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }

        .apna-header-cart {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .apna-header-cart:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        /* My Orders Link */
        .apna-my-orders-link {
          background: #ffffff;
          color: #047857;
          border: 1px solid rgba(255, 255, 255, 0.65);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .apna-my-orders-link:hover {
          background: #d1fae5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .apna-orders-icon {
          font-size: 16px;
        }

        .apna-cart-badge {
          display: inline-grid;
          place-items: center;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 20px;
          background: #f59e0b;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
        }

        .apna-login-link {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .apna-login-link:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.7);
        }

        .apna-signup-link {
          background: #ffffff;
          color: #047857;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .apna-signup-link:hover {
          background: #ecfdf5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .apna-logout-button {
          background: rgba(239, 68, 68, 0.2);
          color: #fecdd3;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .apna-logout-button:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }

        .apna-mobile-top-actions {
          display: none;
          align-items: center;
          gap: 12px;
        }

        .apna-cart-mobile {
          position: relative;
          padding: 0 10px;
          min-height: 38px;
        }

        .apna-cart-mobile .apna-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
        }

        .apna-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 38px;
          height: 38px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9px;
          cursor: pointer;
        }

        .apna-burger-bar {
          display: block;
          width: 100%;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.25s ease-in-out;
        }

        .apna-burger-bar.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .apna-burger-bar.open:nth-child(2) {
          opacity: 0;
        }

        .apna-burger-bar.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .apna-mobile-top-actions {
            display: flex;
          }

          .apna-cart-desktop {
            display: none;
          }

          .apna-header-inner {
            padding: 12px 16px;
            min-height: 60px;
          }

          .apna-header-actions {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 18px 20px;
            background: linear-gradient(180deg, #047857 0%, #065f46 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: none;
          }

          .apna-header-actions.is-open {
            display: flex;
            animation: fadeInDown 0.22s ease-out forwards;
          }

          .apna-header-cart,
          .apna-my-orders-link {
            width: 100%;
            min-height: 44px;
            font-size: 15px;
          }

          .apna-auth-group {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }

          .apna-login-link,
          .apna-signup-link,
          .apna-logout-button {
            width: 100%;
            min-height: 44px;
            font-size: 15px;
          }

          .apna-welcome {
            justify-content: center;
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
