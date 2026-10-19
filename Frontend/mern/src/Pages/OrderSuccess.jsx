
import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const OrderSuccess = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(id || '')
      toast.success('Order ID copied successfully')
    } catch (error) {
      toast.info(`Your Order ID is: ${id}`)
    }
  }

  return (
    <div className="success-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .success-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 35px 20px;
          background: #f7f8fa;
          color: #171717;
          font-family: inherit;
        }

        .success-container {
          width: 100%;
          max-width: 650px;
          overflow: hidden;
          border: 1px solid #ededed;
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 12px 40px rgba(0,0,0,.05);
        }

        .success-banner {
          position: relative;
          overflow: hidden;
          padding: 38px 28px 35px;
          background:
            radial-gradient(ellipse at 85% 15%, rgba(180,143,89,.26), transparent 38%),
            linear-gradient(120deg, #171717, #35302a);
          color: #fff;
          text-align: center;
        }

        .success-brand {
          position: absolute;
          top: 20px;
          left: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f5f5f5;
          font-size: 13px;
          font-weight: 750;
          letter-spacing: .2px;
        }

        .success-brand-icon {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 9px;
          background: rgba(255,255,255,.08);
          font-size: 16px;
        }

        .success-check {
          display: grid;
          place-items: center;
          width: 84px;
          height: 84px;
          margin: 28px auto 20px;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 50%;
          background: rgba(255,255,255,.09);
          color: #bce8c7;
          font-size: 43px;
          animation: success-pop .5s ease-out both;
        }

        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(.7);
          }
          75% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }

        .success-kicker {
          display: block;
          margin-bottom: 10px;
          color: #e6c99d;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .success-banner h1 {
          margin: 0 0 12px;
          font-size: clamp(27px, 5vw, 36px);
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .success-banner p {
          max-width: 410px;
          margin: 0 auto;
          color: #d4d4d4;
          font-size: 14px;
          line-height: 1.8;
        }

        .success-content {
          padding: 30px;
        }

        .success-order-label {
          margin: 0 0 12px;
          color: #737373;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .7px;
          text-align: center;
          text-transform: uppercase;
        }

        .success-order-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px;
          border: 1px solid #e8e8e8;
          border-radius: 13px;
          background: #fafafa;
        }

        .success-order-id {
          min-width: 0;
          color: #262626;
          font-size: 14px;
          font-weight: 750;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .success-copy-button {
          flex-shrink: 0;
          padding: 9px 12px;
          border: 1px solid #dedede;
          border-radius: 8px;
          background: #fff;
          color: #333;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }

        .success-copy-button:hover {
          border-color: #b9a180;
          background: #fcf8f2;
        }

        .success-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid #eee4d5;
          border-radius: 12px;
          background: #fcf8f2;
        }

        .success-note-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #efe4d4;
          font-size: 18px;
        }

        .success-note strong {
          display: block;
          margin-bottom: 5px;
          color: #30291f;
          font-size: 13px;
        }

        .success-note p {
          margin: 0;
          color: #786b59;
          font-size: 12px;
          line-height: 1.7;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 25px;
        }

        .success-home-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 50px;
          padding: 13px 18px;
          border: none;
          border-radius: 11px;
          background: #1d1d1d;
          color: #fff;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .success-home-button:hover {
          background: #8a6a3f;
        }

        .success-home-button:active {
          transform: scale(.99);
        }

        .success-continue-link {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 45px;
          padding: 12px 18px;
          border: 1px solid #e3e3e3;
          border-radius: 11px;
          background: #fff;
          color: #333;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
          transition: background .2s ease;
        }

        .success-continue-link:hover {
          background: #f7f7f7;
        }

        .success-footer {
          margin: 22px 0 0;
          color: #888;
          font-size: 11px;
          line-height: 1.7;
          text-align: center;
        }

        @media (max-width: 520px) {
          .success-page {
            align-items: flex-start;
            padding: 18px 14px;
          }

          .success-container {
            border-radius: 18px;
          }

          .success-banner {
            padding: 35px 20px 27px;
          }

          .success-brand {
            top: 15px;
            left: 16px;
          }

          .success-check {
            width: 72px;
            height: 72px;
            margin: 30px auto 17px;
            font-size: 36px;
          }

          .success-banner h1 {
            font-size: 28px;
          }

          .success-banner p {
            font-size: 13px;
          }

          .success-content {
            padding: 22px 17px;
          }

          .success-order-card {
            align-items: flex-start;
            padding: 13px;
          }

          .success-order-id {
            font-size: 12px;
          }

          .success-copy-button {
            padding: 8px 9px;
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .success-check {
            animation: none;
          }

          .success-copy-button,
          .success-home-button,
          .success-continue-link {
            transition: none;
          }
        }
      `}</style>

      <main className="success-container">
        <section className="success-banner">
          <div className="success-brand">
            <span className="success-brand-icon">🛍️</span>
            <span>Apna Store</span>
          </div>

          <div className="success-check" aria-label="Success">
            ✓
          </div>

          <span className="success-kicker">Order confirmed</span>

          <h1>Thank you for your order!</h1>

          <p>
            Your order has been placed successfully. Thank you for
            shopping with us — we appreciate your trust.
          </p>
        </section>

        <section className="success-content">
          <p className="success-order-label">Your Order ID</p>

          <div className="success-order-card">
            <span className="success-order-id">
              {id || 'Order ID unavailable'}
            </span>

            {id && (
              <button
                className="success-copy-button"
                onClick={copyOrderId}
                type="button"
              >
                Copy ID
              </button>
            )}
          </div>

          <div className="success-note">
            <div className="success-note-icon">💵</div>
            <div>
              <strong>Payment: Cash on Delivery</strong>
              <p>
                Keep your order ID handy. Pay for your order when it
                arrives at your delivery address.
              </p>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="success-home-button"
              onClick={goHome}
              type="button"
            >
              Continue Shopping <span>→</span>
            </button>

            <Link to="/cart" className="success-continue-link">
              View Shopping Cart
            </Link>
          </div>

          <p className="success-footer">
            Thank you for choosing Apna Store. We hope to see you again!
          </p>
        </section>
      </main>
    </div>
  )
}

export default OrderSuccess
