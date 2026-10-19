import { useCallback, useEffect, useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";

function EmptyCart() {
  return (
    <section className="apna-empty-card">
      <svg
        className="apna-empty-illustration"
        viewBox="0 0 190 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustration of an empty shopping cart"
      >
        <circle cx="95" cy="70" r="62" fill="#ecfdf5" />
        <path
          d="M36 32H49L62 91C63 97 68 101 74 101H132"
          stroke="#059669"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57 49H151L137 83H65"
          fill="#d1fae5"
          stroke="#059669"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="77" cy="115" r="7" fill="#059669" />
        <circle cx="127" cy="115" r="7" fill="#059669" />
        <path
          d="M83 65L96 76L119 56"
          stroke="#059669"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M144 23V34M138.5 28.5H149.5"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="42" cy="87" r="4" fill="#6ee7b7" />
      </svg>

      <h2>Your cart is empty</h2>
      <p>
        Looks like you haven't added anything to your cart yet.
        Explore our collection and find something you love.
      </p>

      <Link to="/" className="apna-primary-button apna-continue-button">
        ← Continue Shopping
      </Link>
    </section>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!userId) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    try {
      setError("");
      const res = await api.get(`/cart/${userId}`);
      setCart({
        ...res.data,
        items: res.data.items || [],
      });
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError("We couldn't load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const notifyCartUpdated = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (productId) => {
    if (!userId || updatingId) return;

    setUpdatingId(productId);

    try {
      await api.delete("/cart/remove", {
        data: { userId, productId },
      });

      await loadCart();
      notifyCartUpdated();
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Couldn't remove this item. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateItem = async (productId, quantity) => {
    if (!userId || updatingId) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    setUpdatingId(productId);

    try {
      await api.put("/cart/update", {
        userId,
        productId,
        quantity,
      });

      await loadCart();
      notifyCartUpdated();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Couldn't update quantity. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    if (!item.productId) return sum;

    return (
      sum +
      (Number(item.productId.prices) || 0) *
        (Number(item.quantity) || 0)
    );
  }, 0);

  const checkout = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    navigate("/checkout-address");
  };

  if (loading) {
    return (
      <main className="apna-cart-page apna-cart-loading">
        <div className="apna-spinner" />
        <p>Loading your cart...</p>

        <style>{cartStyles}</style>
      </main>
    );
  }

  return (
    <main className="apna-cart-page">
      <div className="apna-cart-container">
        <div className="apna-cart-heading">
          <p className="apna-eyebrow">YOUR SHOPPING BAG</p>
          <h1>Shopping Cart</h1>
          <p className="apna-cart-subtitle">
            {items.length} {items.length === 1 ? "product" : "products"} in
            your cart
          </p>
        </div>

        {error && (
          <div className="apna-cart-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={loadCart}>
              Retry
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="apna-cart-layout">
            <section className="apna-cart-card">
              <div className="apna-section-heading">
                <h2>Cart Items</h2>
                <span>{items.length} items</span>
              </div>

              <p className="apna-section-description">
                Review your items before checkout.
              </p>

              <div className="apna-product-list">
                {items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;

                  const productId = product._id;
                  const busy = Boolean(updatingId);
                  const isUpdating = updatingId === productId;
                  const price = Number(product.prices) || 0;

                  return (
                    <article
                      key={productId}
                      className={`apna-product-row ${
                        isUpdating ? "apna-product-updating" : ""
                      }`}
                    >
                      <img
                        className="apna-product-image"
                        src={
                          product.image ||
                          "https://placehold.co/160x160/f1f5f9/64748b?text=Product"
                        }
                        alt={product.title || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/160x160/f1f5f9/64748b?text=Product";
                        }}
                      />

                      <div className="apna-product-info">
                        <h3>{product.title}</h3>

                        {product.category && (
                          <p className="apna-product-category">
                            {product.category}
                          </p>
                        )}

                        <p className="apna-product-price">
                          {formatPrice(price)}
                        </p>

                        <button
                          type="button"
                          className="apna-remove-mobile"
                          disabled={busy}
                          onClick={() => removeItem(productId)}
                        >
                          Remove item
                        </button>
                      </div>

                      <div className="apna-product-controls">
                        <div className="apna-quantity-control">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.title}`}
                            disabled={busy}
                            onClick={() =>
                              updateItem(productId, item.quantity - 1)
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.title}`}
                            disabled={busy}
                            onClick={() =>
                              updateItem(productId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <p className="apna-line-total">
                          {formatPrice(price * item.quantity)}
                        </p>

                        <button
                          type="button"
                          className="apna-remove-desktop"
                          disabled={busy}
                          onClick={() => removeItem(productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Link to="/" className="apna-back-link">
                ← Continue Shopping
              </Link>
            </section>

            <aside className="apna-order-card">
              <h2>Order Summary</h2>

              <div className="apna-summary-row">
                <span>Products</span>
                <span>{items.length}</span>
              </div>

              <div className="apna-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="apna-summary-row apna-shipping-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="apna-summary-total">
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <button
                type="button"
                className="apna-primary-button apna-checkout-button"
                disabled={Boolean(updatingId)}
                onClick={checkout}
              >
                Proceed to Checkout <span aria-hidden="true">→</span>
              </button>

              <p className="apna-secure-note">
                <span aria-hidden="true">🔒</span> Secure checkout
              </p>
            </aside>
          </div>
        )}
      </div>

      <style>{cartStyles}</style>
    </main>
  );
}

const cartStyles = `
  .apna-cart-page {
    min-height: 65vh;
    background: #f8fafc;
    padding: 36px 24px 64px;
    color: #0f172a;
    font-family: Inter, Arial, sans-serif;
    box-sizing: border-box;
  }

  .apna-cart-page *,
  .apna-cart-page *::before,
  .apna-cart-page *::after {
    box-sizing: border-box;
  }

  .apna-cart-container {
    width: 100%;
    max-width: 1160px;
    margin: 0 auto;
  }

  .apna-cart-heading {
    margin-bottom: 28px;
  }

  .apna-eyebrow {
    color: #059669;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.6px;
    margin: 0 0 10px;
  }

  .apna-cart-heading h1 {
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -1.1px;
    margin: 0 0 9px;
  }

  .apna-cart-subtitle {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }

  .apna-cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(270px, 340px);
    gap: 24px;
    align-items: start;
  }

  .apna-cart-card,
  .apna-order-card,
  .apna-empty-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.035);
  }

  .apna-cart-card {
    padding: 24px;
    min-width: 0;
  }

  .apna-section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .apna-section-heading h2,
  .apna-order-card h2 {
    font-size: 19px;
    font-weight: 800;
    margin: 0;
  }

  .apna-section-heading > span {
    font-size: 12px;
    font-weight: 700;
    color: #047857;
    background: #ecfdf5;
    padding: 6px 10px;
    border-radius: 20px;
  }

  .apna-section-description {
    color: #64748b;
    font-size: 13px;
    margin: 9px 0 20px;
  }

  .apna-product-row {
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr) auto;
    align-items: center;
    gap: 17px;
    padding: 20px 0;
    border-top: 1px solid #f1f5f9;
    min-width: 0;
  }

  .apna-product-updating {
    opacity: 0.6;
    pointer-events: none;
  }

  .apna-product-image {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    object-fit: cover;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
  }

  .apna-product-info {
    min-width: 0;
  }

  .apna-product-info h3 {
    font-size: 15px;
    font-weight: 750;
    line-height: 1.5;
    overflow-wrap: anywhere;
    margin: 0 0 5px;
  }

  .apna-product-category {
    color: #64748b;
    font-size: 12px;
    margin: 0 0 8px;
  }

  .apna-product-price {
    color: #059669;
    font-size: 15px;
    font-weight: 800;
    margin: 0;
  }

  .apna-product-controls {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 10px;
  }

  .apna-quantity-control {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 5px 7px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 10px;
  }

  .apna-quantity-control button {
    width: 29px;
    height: 29px;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 7px;
    background: #fff;
    color: #0f172a;
    font-size: 19px;
    cursor: pointer;
    touch-action: manipulation;
  }

  .apna-quantity-control button:hover:not(:disabled) {
    background: #d1fae5;
    color: #047857;
  }

  .apna-quantity-control button:disabled,
  .apna-remove-mobile:disabled,
  .apna-remove-desktop:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .apna-quantity-control span {
    min-width: 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 800;
  }

  .apna-line-total {
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    margin: 0;
  }

  .apna-remove-desktop,
  .apna-remove-mobile {
    border: none;
    background: transparent;
    color: #dc2626;
    padding: 4px 0;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .apna-remove-mobile {
    display: none;
  }

  .apna-back-link {
    display: inline-block;
    margin-top: 15px;
    color: #047857;
    font-size: 13px;
    font-weight: 750;
    text-decoration: none;
  }

  .apna-back-link:hover {
    text-decoration: underline;
  }

  .apna-order-card {
    padding: 24px;
    position: sticky;
    top: 95px;
  }

  .apna-order-card h2 {
    margin-bottom: 24px;
  }

  .apna-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 18px;
    color: #64748b;
    font-size: 13px;
  }

  .apna-summary-row > span:last-child {
    text-align: right;
    color: #334155;
    font-weight: 650;
  }

  .apna-shipping-row > span:last-child {
    max-width: 145px;
    color: #047857;
    font-size: 12px;
  }

  .apna-summary-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    margin-top: 22px;
    margin-bottom: 22px;
  }

  .apna-summary-total > span {
    font-size: 14px;
    font-weight: 750;
  }

  .apna-summary-total strong {
    font-size: 21px;
    font-weight: 850;
    overflow-wrap: anywhere;
    text-align: right;
  }

  .apna-primary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px 18px;
    border: none;
    border-radius: 10px;
    background: #059669;
    color: #fff;
    text-decoration: none;
    text-align: center;
    font-size: 14px;
    font-weight: 750;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .apna-primary-button:hover {
    background: #047857;
  }

  .apna-primary-button:active {
    transform: scale(0.99);
  }

  .apna-primary-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .apna-checkout-button {
    width: 100%;
    min-height: 48px;
  }

  .apna-secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: #64748b;
    font-size: 12px;
    margin: 18px 0 0;
  }

  .apna-empty-card {
    padding: 42px 24px;
    text-align: center;
  }

  .apna-empty-illustration {
    display: block;
    width: 190px;
    max-width: 100%;
    height: auto;
    margin: 0 auto 18px;
  }

  .apna-empty-card h2 {
    font-size: clamp(22px, 3vw, 26px);
    margin: 0 0 10px;
    font-weight: 800;
  }

  .apna-empty-card p {
    max-width: 390px;
    margin: 0 auto 24px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.8;
  }

  .apna-continue-button {
    min-height: 44px;
  }

  .apna-cart-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 16px;
    margin-bottom: 20px;
    border: 1px solid #fecaca;
    border-radius: 10px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 13px;
  }

  .apna-cart-error button {
    border: none;
    background: transparent;
    color: #b91c1c;
    font-weight: 800;
    cursor: pointer;
  }

  .apna-cart-loading {
    display: flex;
    min-height: 55vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;
    color: #64748b;
    font-size: 14px;
  }

  .apna-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #d1fae5;
    border-top-color: #059669;
    border-radius: 50%;
    animation: apna-spin 0.8s linear infinite;
  }

  @keyframes apna-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 960px) {
    .apna-cart-page {
      padding: 30px 20px 48px;
    }

    .apna-cart-layout {
      grid-template-columns: minmax(0, 1fr) 285px;
      gap: 16px;
    }

    .apna-cart-card,
    .apna-order-card {
      padding: 20px;
    }

    .apna-product-row {
      grid-template-columns: 80px minmax(0, 1fr);
      gap: 14px;
    }

    .apna-product-image {
      width: 80px;
      height: 80px;
    }

    .apna-product-controls {
      grid-column: 2;
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
    }

    .apna-remove-desktop {
      display: none;
    }

    .apna-remove-mobile {
      display: inline-block;
      margin-top: 8px;
    }

    .apna-product-info {
      align-self: center;
    }
  }

  @media (max-width: 700px) {
    .apna-cart-page {
      padding: 26px 15px 40px;
    }

    .apna-cart-heading {
      margin-bottom: 22px;
    }

    .apna-cart-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    .apna-cart-card {
      padding: 17px;
    }

    .apna-order-card {
      position: static;
      padding: 20px;
    }

    .apna-product-row {
      grid-template-columns: 78px minmax(0, 1fr);
      gap: 12px;
      padding: 17px 0;
    }

    .apna-product-image {
      width: 78px;
      height: 78px;
    }

    .apna-product-info h3 {
      font-size: 14px;
    }

    .apna-product-controls {
      grid-column: 1 / -1;
      padding-left: 0;
      align-items: center;
      flex-direction: row;
    }

    .apna-quantity-control {
      gap: 11px;
    }

    .apna-line-total {
      margin-left: auto;
      font-size: 13px;
    }

    .apna-empty-card {
      padding: 32px 18px;
    }

    .apna-empty-illustration {
      width: 155px;
    }

    .apna-empty-card p {
      font-size: 13px;
    }
  }

  @media (max-width: 380px) {
    .apna-cart-page {
      padding: 22px 11px 32px;
    }

    .apna-cart-card,
    .apna-order-card {
      padding: 15px;
      border-radius: 14px;
    }

    .apna-product-row {
      grid-template-columns: 65px minmax(0, 1fr);
      gap: 10px;
    }

    .apna-product-image {
      width: 65px;
      height: 65px;
      border-radius: 9px;
    }

    .apna-quantity-control {
      gap: 7px;
      padding: 4px;
    }

    .apna-quantity-control button {
      width: 27px;
      height: 29px;
    }

    .apna-summary-total strong {
      font-size: 18px;
    }

    .apna-checkout-button {
      padding: 12px 10px;
      font-size: 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .apna-spinner {
      animation: none;
    }

    .apna-primary-button {
      transition: none;
    }
  }
`;