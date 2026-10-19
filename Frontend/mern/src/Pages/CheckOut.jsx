
import React, { useEffect, useState } from 'react'
import api from '../axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CheckOut = () => {
  const navigate = useNavigate()

  const [userId] = useState(() => localStorage.getItem('userId'))
  const [address, setaddress] = useState([])
  const [cart, setcart] = useState(null)
  const [selectAddress, setselectAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [pageError, setPageError] = useState(false)

  useEffect(() => {
    if (!userId) {
      toast.info('Please log in to continue checkout')
      navigate('/login', { replace: true })
      return
    }

    let active = true

    async function loadCheckout() {
      try {
        setLoading(true)
        setPageError(false)

        const [cartResponse, addressResponse] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/address/${userId}`),
        ])

        if (!active) return

        setcart(cartResponse.data)

        const savedAddresses = Array.isArray(addressResponse.data)
          ? addressResponse.data
          : []

        setaddress(savedAddresses)
        setselectAddress(savedAddresses[0] || null)
      } catch (error) {
        if (!active) return

        setPageError(true)
        toast.error(
          error.response?.data?.message ||
            'Unable to load checkout details'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCheckout()

    return () => {
      active = false
    }
  }, [userId, navigate])

  const cartItems = cart?.items || []

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.productId?.prices) || 0
    const quantity = Number(item.quantity) || 0

    return sum + quantity * price
  }, 0)

  const placeOrder = async () => {
    if (!userId) {
      toast.info('Please log in to continue')
      navigate('/login')
      return
    }

    if (!cartItems.length) {
      toast.error('Your cart is empty')
      return
    }

    if (!selectAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (placingOrder) return

    try {
      setPlacingOrder(true)

      const response = await api.post('/order/order-placed', {
        userId,
        address: selectAddress,
      })

      localStorage.setItem('cartCount', '0')
      window.dispatchEvent(new Event('cartUpdated'))

      navigate(`/order-success/${response.data.orderId}`)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to place your order. Please try again.'
      )
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <style>{`
          .checkout-page {
            min-height: 100vh;
            padding: 50px 20px;
            background: #f7f8fa;
            color: #171717;
            font-family: inherit;
          }
          .checkout-state {
            max-width: 520px;
            margin: 50px auto;
            padding: 44px 20px;
            border: 1px solid #eee;
            border-radius: 18px;
            background: #fff;
            text-align: center;
          }
          .checkout-spinner {
            width: 36px;
            height: 36px;
            margin: 0 auto 18px;
            border: 3px solid #e5e5e5;
            border-top-color: #8a6a3f;
            border-radius: 50%;
            animation: checkout-spin .8s linear infinite;
          }
          @keyframes checkout-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div className="checkout-state">
          <div className="checkout-spinner" />
          <h2>Preparing your checkout</h2>
          <p>Loading your cart and delivery addresses...</p>
        </div>
      </div>
    )
  }

  if (pageError || !cart) {
    return (
      <div className="checkout-page">
        <style>{`
          .checkout-page {
            min-height: 100vh;
            padding: 50px 20px;
            background: #f7f8fa;
            color: #171717;
            font-family: inherit;
          }
          .checkout-state {
            max-width: 520px;
            margin: 50px auto;
            padding: 44px 20px;
            border: 1px solid #eee;
            border-radius: 18px;
            background: #fff;
            text-align: center;
          }
          .checkout-link {
            display: inline-block;
            margin-top: 15px;
            padding: 12px 18px;
            border-radius: 10px;
            background: #1d1d1d;
            color: #fff;
            text-decoration: none;
          }
        `}</style>

        <div className="checkout-state">
          <div style={{ fontSize: '38px', marginBottom: '12px' }}>⚠️</div>
          <h2>Checkout unavailable</h2>
          <p>We couldn't load your checkout details.</p>
          <Link to="/cart" className="checkout-link">
            Return to Cart
          </Link>
        </div>
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <div className="checkout-page">
        <style>{`
          .checkout-page {
            min-height: 100vh;
            padding: 50px 20px;
            background: #f7f8fa;
            color: #171717;
            font-family: inherit;
          }
          .checkout-state {
            max-width: 520px;
            margin: 50px auto;
            padding: 44px 20px;
            border: 1px solid #eee;
            border-radius: 18px;
            background: #fff;
            text-align: center;
          }
          .checkout-link {
            display: inline-block;
            margin-top: 15px;
            padding: 12px 18px;
            border-radius: 10px;
            background: #1d1d1d;
            color: #fff;
            text-decoration: none;
          }
        `}</style>

        <div className="checkout-state">
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/" className="checkout-link">
            Explore Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .checkout-page {
          min-height: 100vh;
          padding: 28px 0 60px;
          background: #f7f8fa;
          color: #171717;
          font-family: inherit;
        }

        .checkout-container {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
        }

        .checkout-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          color: #737373;
          font-size: 13px;
        }

        .checkout-breadcrumb a {
          color: #737373;
          text-decoration: none;
        }

        .checkout-breadcrumb a:hover {
          color: #8a6a3f;
        }

        .checkout-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          padding: 30px 34px;
          border-radius: 20px;
          background:
            radial-gradient(ellipse at 90% 15%, rgba(180,143,89,.28), transparent 35%),
            linear-gradient(110deg, #171717, #35302a);
          color: #fff;
        }

        .checkout-kicker {
          display: block;
          margin-bottom: 9px;
          color: #e6c99d;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .checkout-hero h1 {
          margin: 0 0 8px;
          font-size: clamp(27px, 4vw, 35px);
          letter-spacing: -.9px;
        }

        .checkout-hero p {
          margin: 0;
          color: #d4d4d4;
          font-size: 14px;
          line-height: 1.6;
        }

        .checkout-hero-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 64px;
          height: 64px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 18px;
          background: rgba(255,255,255,.07);
          font-size: 29px;
        }

        .checkout-steps {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 25px;
        }

        .checkout-step {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 14px;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          background: #fff;
        }

        .checkout-step-number {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: #1d1d1d;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }

        .checkout-step span:last-child {
          font-size: 12px;
          font-weight: 650;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(300px, .85fr);
          align-items: start;
          gap: 24px;
        }

        .checkout-main {
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0;
        }

        .checkout-panel {
          min-width: 0;
          padding: 25px;
          border: 1px solid #ededed;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 5px 22px rgba(0,0,0,.025);
        }

        .checkout-panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 21px;
        }

        .checkout-panel-heading h2 {
          margin: 0 0 7px;
          font-size: 20px;
          letter-spacing: -.4px;
        }

        .checkout-panel-heading p {
          margin: 0;
          color: #737373;
          font-size: 13px;
          line-height: 1.6;
        }

        .checkout-count {
          flex-shrink: 0;
          padding: 6px 10px;
          border-radius: 20px;
          background: #f4f4f4;
          color: #555;
          font-size: 11px;
          font-weight: 700;
        }

        .checkout-address-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkout-address {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 17px;
          border: 1px solid #e5e5e5;
          border-radius: 13px;
          background: #fff;
          cursor: pointer;
          transition: border-color .2s ease, background .2s ease;
        }

        .checkout-address:hover {
          border-color: #b9a180;
        }

        .checkout-address.selected {
          border: 1.5px solid #8a6a3f;
          background: #fcf8f2;
        }

        .checkout-radio {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
          margin-top: 3px;
          accent-color: #8a6a3f;
          cursor: pointer;
        }

        .checkout-address-content {
          flex: 1;
          min-width: 0;
        }

        .checkout-address-top {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }

        .checkout-address-name {
          color: #222;
          font-size: 14px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .checkout-selected-tag {
          padding: 4px 7px;
          border-radius: 5px;
          background: #efe4d4;
          color: #765a34;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .checkout-address-line {
          margin: 0 0 5px;
          color: #666;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .checkout-address-phone {
          margin: 8px 0 0;
          color: #333;
          font-size: 12px;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .checkout-empty-address {
          padding: 24px 16px;
          border: 1px dashed #d4d4d4;
          border-radius: 12px;
          background: #fcfcfc;
          text-align: center;
        }

        .checkout-empty-address p {
          margin: 0 0 12px;
          color: #737373;
          font-size: 13px;
          line-height: 1.6;
        }

        .checkout-address-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border: 1px solid #dedede;
          border-radius: 9px;
          color: #262626;
          background: #fff;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
        }

        .checkout-address-link:hover {
          background: #f7f7f7;
        }

        .checkout-summary {
          position: sticky;
          top: 20px;
        }

        .checkout-summary h2 {
          margin: 0 0 6px;
          font-size: 20px;
          letter-spacing: -.4px;
        }

        .checkout-summary-subtitle {
          margin: 0 0 22px;
          color: #737373;
          font-size: 13px;
        }

        .checkout-products {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 3px;
        }

        .checkout-product {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .checkout-product-image-wrap {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 62px;
          height: 62px;
          overflow: hidden;
          border: 1px solid #eee;
          border-radius: 10px;
          background: #f5f5f5;
        }

        .checkout-product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .checkout-product-info {
          flex: 1;
          min-width: 0;
        }

        .checkout-product-name {
          display: -webkit-box;
          overflow: hidden;
          margin: 0 0 6px;
          color: #292929;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.5;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow-wrap: anywhere;
        }

        .checkout-product-quantity {
          color: #737373;
          font-size: 11px;
        }

        .checkout-product-price {
          flex-shrink: 0;
          color: #222;
          font-size: 12px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .checkout-divider {
          height: 1px;
          margin: 21px 0;
          border: 0;
          background: #eee;
        }

        .checkout-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          color: #666;
          font-size: 13px;
        }

        .checkout-total-row span:last-child {
          color: #262626;
          font-weight: 600;
        }

        .checkout-grand-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 17px;
          padding-top: 18px;
          border-top: 1px solid #eee;
        }

        .checkout-grand-total span:first-child {
          font-size: 15px;
          font-weight: 750;
        }

        .checkout-grand-total span:last-child {
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.7px;
          overflow-wrap: anywhere;
        }

        .checkout-payment {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 20px;
          padding: 13px;
          border: 1px solid #eee4d5;
          border-radius: 11px;
          background: #fcf8f2;
        }

        .checkout-payment-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #efe4d4;
          font-size: 18px;
        }

        .checkout-payment strong {
          display: block;
          margin-bottom: 4px;
          color: #30291f;
          font-size: 12px;
        }

        .checkout-payment p {
          margin: 0;
          color: #786b59;
          font-size: 11px;
          line-height: 1.5;
        }

        .checkout-place-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 50px;
          margin-top: 18px;
          padding: 13px 16px;
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

        .checkout-place-button:hover:not(:disabled) {
          background: #8a6a3f;
        }

        .checkout-place-button:active:not(:disabled) {
          transform: scale(.99);
        }

        .checkout-place-button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }

        .checkout-back-link {
          display: block;
          margin-top: 16px;
          color: #737373;
          font-size: 12px;
          text-align: center;
          text-decoration: none;
        }

        .checkout-back-link:hover {
          color: #262626;
        }

        .checkout-secure-note {
          margin: 14px 0 0;
          color: #888;
          font-size: 11px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 850px) {
          .checkout-layout {
            grid-template-columns: minmax(0, 1fr) minmax(270px, .85fr);
            gap: 16px;
          }

          .checkout-panel {
            padding: 19px;
          }

          .checkout-steps {
            gap: 8px;
          }

          .checkout-step {
            padding: 11px 9px;
          }

          .checkout-step span:last-child {
            font-size: 11px;
          }
        }

        @media (max-width: 680px) {
          .checkout-page {
            padding-top: 18px;
          }

          .checkout-container {
            width: calc(100% - 28px);
          }

          .checkout-breadcrumb {
            margin-bottom: 16px;
            font-size: 12px;
          }

          .checkout-hero {
            margin-bottom: 18px;
            padding: 24px 20px;
            border-radius: 16px;
          }

          .checkout-hero h1 {
            font-size: 27px;
          }

          .checkout-hero p {
            font-size: 12px;
          }

          .checkout-hero-icon {
            width: 48px;
            height: 48px;
            border-radius: 13px;
            font-size: 22px;
          }

          .checkout-steps {
            gap: 7px;
            margin-bottom: 18px;
          }

          .checkout-step {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
            padding: 10px;
          }

          .checkout-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }

          .checkout-panel {
            padding: 18px;
            border-radius: 15px;
          }

          .checkout-panel-heading h2,
          .checkout-summary h2 {
            font-size: 19px;
          }

          .checkout-summary {
            position: static;
          }

          .checkout-products {
            max-height: none;
          }

          .checkout-grand-total span:last-child {
            font-size: 23px;
          }
        }

        @media (max-width: 360px) {
          .checkout-hero-icon {
            display: none;
          }

          .checkout-step {
            padding: 8px;
          }

          .checkout-step span:last-child {
            font-size: 10px;
          }

          .checkout-panel {
            padding: 14px;
          }

          .checkout-address {
            gap: 9px;
            padding: 13px;
          }

          .checkout-product-image-wrap {
            width: 52px;
            height: 52px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-address,
          .checkout-place-button {
            transition: none;
          }
        }
      `}</style>

      <div className="checkout-container">
        <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/cart">Cart</Link>
          <span>/</span>
          <span>Checkout</span>
        </nav>

        <section className="checkout-hero">
          <div>
            <span className="checkout-kicker">Almost there</span>
            <h1>Complete your order.</h1>
            <p>Confirm your delivery address and review your items.</p>
          </div>
          <div className="checkout-hero-icon" aria-hidden="true">
            🛍️
          </div>
        </section>

        <div className="checkout-steps">
          <div className="checkout-step">
            <span className="checkout-step-number">1</span>
            <span>Review Cart</span>
          </div>
          <div className="checkout-step">
            <span className="checkout-step-number">2</span>
            <span>Delivery Details</span>
          </div>
          <div className="checkout-step">
            <span className="checkout-step-number">3</span>
            <span>Place Order</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            <section className="checkout-panel">
              <div className="checkout-panel-heading">
                <div>
                  <h2>Delivery Address</h2>
                  <p>Choose where you'd like your order delivered.</p>
                </div>
                <span className="checkout-count">
                  {address.length} {address.length === 1 ? 'Address' : 'Addresses'}
                </span>
              </div>

              {address.length === 0 ? (
                <div className="checkout-empty-address">
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>
                    📍
                  </div>
                  <p>
                    You haven't saved a delivery address yet. Add an address
                    before placing your order.
                  </p>
                  <Link to="/checkout-address" className="checkout-address-link">
                    + Add Delivery Address
                  </Link>
                </div>
              ) : (
                <div className="checkout-address-list">
                  {address.map((item, index) => {
                    const isSelected =
                      selectAddress === item ||
                      (selectAddress &&
                        selectAddress._id &&
                        selectAddress._id === item._id)

                    return (
                      <label
                        key={item._id || index}
                        className={`checkout-address ${
                          isSelected ? 'selected' : ''
                        }`}
                      >
                        <input
                          className="checkout-radio"
                          type="radio"
                          name="deliveryAddress"
                          checked={Boolean(isSelected)}
                          onChange={() => setselectAddress(item)}
                        />

                        <div className="checkout-address-content">
                          <div className="checkout-address-top">
                            <span className="checkout-address-name">
                              {item.fullName}
                            </span>

                            {isSelected && (
                              <span className="checkout-selected-tag">
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="checkout-address-line">
                            {item.addressLine}
                          </p>

                          <p className="checkout-address-line">
                            {item.city}, {item.state} - {item.pincode}
                          </p>

                          <p className="checkout-address-phone">
                            Phone: {item.phone}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="checkout-panel">
              <div className="checkout-panel-heading">
                <div>
                  <h2>Payment Method</h2>
                  <p>Pay when your order is delivered.</p>
                </div>
              </div>

              <div className="checkout-payment">
                <div className="checkout-payment-icon">💵</div>
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay in cash when you receive your order.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="checkout-panel checkout-summary">
            <h2>Order Summary</h2>
            <p className="checkout-summary-subtitle">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your order
            </p>

            <div className="checkout-products">
              {cartItems.map((item, index) => {
                const product = item.productId
                const quantity = Number(item.quantity) || 0
                const price = Number(product?.prices) || 0

                return (
                  <div
                    className="checkout-product"
                    key={item._id || product?._id || index}
                  >
                    <div className="checkout-product-image-wrap">
                      {product?.image ? (
                        <img
                          className="checkout-product-image"
                          src={product.image}
                          alt={product.title || 'Product'}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className="checkout-product-info">
                      <p className="checkout-product-name">
                        {product?.title || 'Product unavailable'}
                      </p>
                      <span className="checkout-product-quantity">
                        Qty: {quantity} × ₹{price}
                      </span>
                    </div>

                    <span className="checkout-product-price">
                      ₹{(quantity * price).toLocaleString('en-IN')}
                    </span>
                  </div>
                )
              })}
            </div>

            <hr className="checkout-divider" />

            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="checkout-total-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="checkout-grand-total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="checkout-place-button"
              onClick={placeOrder}
              disabled={
                placingOrder ||
                !selectAddress ||
                cartItems.length === 0 ||
                address.length === 0
              }
            >
              {placingOrder ? 'Placing Your Order...' : 'Place Order · COD'}
              {!placingOrder && <span>→</span>}
            </button>

            <Link to="/cart" className="checkout-back-link">
              ← Return to Cart
            </Link>

            <p className="checkout-secure-note">
              🔒 Your order details are handled securely.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckOut
