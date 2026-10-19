
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../axios'

const ProductDetails = () => {
  const { id } = useParams()

  const [products, setproducts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState(false)

  async function loadProducts() {
    try {
      setLoading(true)
      setError(false)

      // Fetch the products using the existing API
      const response = await api.get('/products')
      const product = response.data.find((item) => item._id === id)

      if (!product) {
        setproducts(null)
        setError(true)
        return
      }

      setproducts(product)
    } catch (err) {
      setError(true)
      toast.error(
        err.response?.data?.message || 'Unable to load product details'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [id])

  const addToCart = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      toast.info('Please log in to add items to your cart')
      return
    }

    if (addingToCart) return

    if (Number(products.stock) <= 0) {
      toast.info('This product is currently out of stock')
      return
    }

    try {
      setAddingToCart(true)

      await api.post('/cart/add', {
        userId,
        productId: products._id,
      })

      const cartResponse = await api.get(`/cart/${userId}`)
      const total = cartResponse.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      localStorage.setItem('cartCount', total)
      window.dispatchEvent(new Event('cartUpdated'))

      toast.success('Added to cart')
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Could not add product to cart'
      )
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="pd-page">
        <style>{`
          .pd-page {
            min-height: 100vh;
            padding: 60px 20px;
            background: #f7f8fa;
            color: #171717;
            font-family: inherit;
          }
          .pd-state {
            max-width: 600px;
            margin: 60px auto;
            padding: 50px 20px;
            border: 1px solid #eee;
            border-radius: 18px;
            background: #fff;
            text-align: center;
          }
          .pd-spinner {
            width: 36px;
            height: 36px;
            margin: 0 auto 18px;
            border: 3px solid #e5e5e5;
            border-top-color: #8a6a3f;
            border-radius: 50%;
            animation: pd-spin .8s linear infinite;
          }
          @keyframes pd-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div className="pd-state">
          <div className="pd-spinner" />
          <h3>Loading product details...</h3>
          <p>Please wait while we fetch the product.</p>
        </div>
      </div>
    )
  }

  if (error || !products) {
    return (
      <div className="pd-page">
        <style>{`
          .pd-page {
            min-height: 100vh;
            padding: 60px 20px;
            background: #f7f8fa;
            color: #171717;
            font-family: inherit;
          }
          .pd-state {
            max-width: 600px;
            margin: 40px auto;
            padding: 50px 20px;
            border: 1px solid #eee;
            border-radius: 18px;
            background: #fff;
            text-align: center;
          }
          .pd-back {
            display: inline-block;
            margin-top: 16px;
            padding: 11px 18px;
            border-radius: 10px;
            background: #1d1d1d;
            color: #fff;
            text-decoration: none;
          }
        `}</style>

        <div className="pd-state">
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔎</div>
          <h2>Product not found</h2>
          <p>We couldn't find this product. It may have been removed.</p>
          <Link to="/" className="pd-back">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    )
  }

  const inStock = Number(products.stock) > 0

  return (
    <div className="pd-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .pd-page {
          min-height: 100vh;
          padding: 28px 0 60px;
          background: #f7f8fa;
          color: #171717;
          font-family: inherit;
        }

        .pd-container {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
        }

        .pd-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          color: #737373;
          font-size: 13px;
        }

        .pd-breadcrumb a {
          color: #737373;
          text-decoration: none;
        }

        .pd-breadcrumb a:hover {
          color: #8a6a3f;
        }

        .pd-breadcrumb-current {
          overflow-wrap: anywhere;
          color: #262626;
          font-weight: 600;
        }

        .pd-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 42px;
          align-items: stretch;
          padding: 30px;
          border: 1px solid #ededed;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(0,0,0,.035);
        }

        .pd-image-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 420px;
          overflow: hidden;
          padding: 28px;
          border-radius: 17px;
          background: #f4f4f4;
        }

        .pd-image {
          display: block;
          width: 100%;
          max-height: 460px;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform .3s ease;
        }

        .pd-image-panel:hover .pd-image {
          transform: scale(1.035);
        }

        .pd-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          padding: 8px 0;
        }

        .pd-category {
          display: inline-flex;
          align-items: center;
          max-width: 100%;
          margin-bottom: 18px;
          padding: 7px 12px;
          border: 1px solid #eee3d4;
          border-radius: 100px;
          background: #faf5ed;
          color: #80623c;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .5px;
          overflow-wrap: anywhere;
        }

        .pd-title {
          margin: 0 0 16px;
          color: #171717;
          font-size: clamp(26px, 3vw, 36px);
          line-height: 1.2;
          letter-spacing: -1px;
          overflow-wrap: anywhere;
        }

        .pd-description {
          margin: 0 0 24px;
          color: #666;
          font-size: 15px;
          line-height: 1.85;
          overflow-wrap: anywhere;
          white-space: pre-line;
        }

        .pd-price-box {
          width: 100%;
          margin-bottom: 24px;
          padding: 18px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .pd-price-label {
          display: block;
          margin-bottom: 6px;
          color: #737373;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .pd-price {
          color: #171717;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -1px;
          overflow-wrap: anywhere;
        }

        .pd-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
          margin-bottom: 26px;
        }

        .pd-meta-item {
          min-width: 0;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 12px;
          background: #fcfcfc;
        }

        .pd-meta-label {
          display: block;
          margin-bottom: 7px;
          color: #737373;
          font-size: 12px;
        }

        .pd-meta-value {
          display: block;
          color: #262626;
          font-size: 14px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .pd-stock {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .pd-stock-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #16a34a;
        }

        .pd-stock-out {
          color: #dc2626;
        }

        .pd-stock-out .pd-stock-dot {
          background: #dc2626;
        }

        .pd-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin-top: auto;
        }

        .pd-add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 52px;
          padding: 14px 18px;
          border: none;
          border-radius: 12px;
          background: #1d1d1d;
          color: #fff;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .pd-add-button:hover:not(:disabled) {
          background: #8a6a3f;
        }

        .pd-add-button:active:not(:disabled) {
          transform: scale(.99);
        }

        .pd-add-button:disabled {
          cursor: not-allowed;
          opacity: .6;
        }

        .pd-continue {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 12px 18px;
          border: 1px solid #dedede;
          border-radius: 12px;
          background: #fff;
          color: #262626;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color .2s ease, background .2s ease;
        }

        .pd-continue:hover {
          border-color: #aaa;
          background: #fafafa;
        }

        .pd-benefits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
        }

        .pd-benefit {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px;
          border: 1px solid #ededed;
          border-radius: 14px;
          background: #fff;
        }

        .pd-benefit-icon {
          flex-shrink: 0;
          font-size: 22px;
        }

        .pd-benefit strong {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .pd-benefit span {
          display: block;
          color: #737373;
          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 850px) {
          .pd-card {
            gap: 26px;
            padding: 22px;
          }

          .pd-image-panel {
            min-height: 340px;
            padding: 20px;
          }

          .pd-benefit {
            padding: 14px 10px;
          }
        }

        @media (max-width: 650px) {
          .pd-page {
            padding-top: 18px;
          }

          .pd-container {
            width: calc(100% - 28px);
          }

          .pd-breadcrumb {
            margin-bottom: 16px;
            font-size: 12px;
          }

          .pd-card {
            grid-template-columns: minmax(0, 1fr);
            gap: 22px;
            padding: 14px;
            border-radius: 17px;
          }

          .pd-image-panel {
            min-height: 260px;
            max-height: 360px;
            padding: 20px;
            border-radius: 12px;
          }

          .pd-image {
            max-height: 310px;
          }

          .pd-info {
            padding: 2px 4px 6px;
          }

          .pd-category {
            margin-bottom: 12px;
          }

          .pd-title {
            margin-bottom: 12px;
            font-size: 27px;
          }

          .pd-description {
            margin-bottom: 18px;
            font-size: 14px;
          }

          .pd-price-box {
            margin-bottom: 18px;
            padding: 15px 0;
          }

          .pd-price {
            font-size: 30px;
          }

          .pd-meta {
            margin-bottom: 20px;
          }

          .pd-benefits {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 16px;
          }

          .pd-benefit {
            padding: 14px;
          }
        }

        @media (max-width: 360px) {
          .pd-meta {
            grid-template-columns: 1fr;
          }

          .pd-image-panel {
            min-height: 220px;
          }

          .pd-title {
            font-size: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pd-image,
          .pd-add-button,
          .pd-continue {
            transition: none;
          }
        }
      `}</style>

      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="pd-breadcrumb-current">
            {products.title}
          </span>
        </nav>

        <main className="pd-card">
          <div className="pd-image-panel">
            <img
              className="pd-image"
              src={products.image}
              alt={products.title}
            />
          </div>

          <section className="pd-info">
            <span className="pd-category">
              {products.category || 'General'}
            </span>

            <h1 className="pd-title">{products.title}</h1>

            <p className="pd-description">
              {products.description || 'Explore this product and add it to your collection.'}
            </p>

            <div className="pd-price-box">
              <span className="pd-price-label">Our Price</span>
              <span className="pd-price">₹{products.prices}</span>
            </div>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Availability</span>
                <span
                  className={`pd-meta-value pd-stock ${
                    !inStock ? 'pd-stock-out' : ''
                  }`}
                >
                  <span className="pd-stock-dot" />
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="pd-meta-item">
                <span className="pd-meta-label">Stock Quantity</span>
                <span className="pd-meta-value">
                  {products.stock ?? 'Not specified'}
                </span>
              </div>
            </div>

            <div className="pd-actions">
              <button
                className="pd-add-button"
                onClick={addToCart}
                disabled={addingToCart || !inStock}
              >
                {addingToCart
                  ? 'Adding to Cart...'
                  : !inStock
                    ? 'Currently Out of Stock'
                    : '＋ Add to Cart'}
              </button>

              <Link to="/" className="pd-continue">
                ← Continue Shopping
              </Link>
            </div>
          </section>
        </main>

        <section className="pd-benefits" aria-label="Shopping highlights">
          <div className="pd-benefit">
            <span className="pd-benefit-icon">🛍️</span>
            <div>
              <strong>Easy Shopping</strong>
              <span>Browse your favourite products</span>
            </div>
          </div>

          <div className="pd-benefit">
            <span className="pd-benefit-icon">🔒</span>
            <div>
              <strong>Secure Account</strong>
              <span>Sign in to manage your cart</span>
            </div>
          </div>

          <div className="pd-benefit">
            <span className="pd-benefit-icon">✨</span>
            <div>
              <strong>Made for You</strong>
              <span>Discover products you love</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductDetails
