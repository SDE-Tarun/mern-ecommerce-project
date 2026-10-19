import React, { useState, useEffect } from 'react'
import api from '../axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Home = () => {
  const [products, setproducts] = useState([])
  const [search, setsearch] = useState('')
  const [category, setcategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingProduct, setAddingProduct] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  async function loadProducts() {
    try {
      setLoading(true)

      const response = await api.get(
        `/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      )

      setproducts(Array.isArray(response.data) ? response.data : [])
      setCurrentPage(1) // Reset to page 1 on filter/search change
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to load products'
      )
      setproducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [search, category])

  // Pagination Calculations
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const addToCart = async (productId) => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      toast.info('Please log in to add items to your cart')
      return
    }

    if (addingProduct) return

    try {
      setAddingProduct(productId)

      await api.post('/cart/add', { userId, productId })

      const res1 = await api.get(`/cart/${userId}`)
      const total = res1.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      localStorage.setItem('cartCount', total)
      window.dispatchEvent(new Event('cartUpdated'))

      toast.success('Added to cart')
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not add product to cart'
      )
    } finally {
      setAddingProduct(null)
    }
  }

  return (
    <div className="shop-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .shop-page {
          min-height: 100vh;
          background: #f7f8fa;
          color: #171717;
          padding: 28px 0 60px;
          font-family: inherit;
        }

        .shop-container {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
        }

        .shop-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          min-height: 260px;
          padding: 44px 48px;
          margin-bottom: 32px;
          border-radius: 24px;
          color: #fff;
          background:
            radial-gradient(ellipse at 85% 20%, rgba(180, 143, 89, .30), transparent 38%),
            linear-gradient(115deg, #171717 0%, #292929 65%, #423629 100%);
        }

        .shop-hero-copy {
          position: relative;
          z-index: 1;
          max-width: 590px;
        }

        .shop-kicker {
          display: inline-block;
          margin-bottom: 14px;
          color: #e6c99d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .shop-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.12;
          letter-spacing: -1.5px;
          font-weight: 750;
        }

        .shop-hero p {
          max-width: 470px;
          margin: 0;
          color: #d4d4d4;
          font-size: 15px;
          line-height: 1.8;
        }

        .shop-hero-decoration {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: 150px;
          height: 150px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 50%;
          background: rgba(255,255,255,.06);
          font-size: 64px;
        }

        .shop-toolbar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 30px;
        }

        .shop-search-wrap {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .shop-search-icon {
          position: absolute;
          top: 50%;
          left: 17px;
          transform: translateY(-50%);
          color: #737373;
          font-size: 19px;
          pointer-events: none;
        }

        .shop-search,
        .shop-category {
          width: 100%;
          height: 50px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          outline: none;
          background: #fff;
          color: #171717;
          font: inherit;
          font-size: 14px;
          transition: border-color .2s, box-shadow .2s;
        }

        .shop-search {
          padding: 0 16px 0 46px;
        }

        .shop-category {
          width: 200px;
          padding: 0 14px;
          cursor: pointer;
        }

        .shop-search:focus,
        .shop-category:focus {
          border-color: #a8895d;
          box-shadow: 0 0 0 3px rgba(168,137,93,.12);
        }

        .shop-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .shop-section-heading h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -.6px;
        }

        .shop-result-count {
          color: #737373;
          font-size: 13px;
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .shop-product-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #eeeeee;
          border-radius: 17px;
          background: #fff;
          transition: transform .22s ease, box-shadow .22s ease;
        }

        .shop-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(0,0,0,.08);
        }

        .shop-image-wrap {
          display: block;
          position: relative;
          overflow: hidden;
          padding: 12px;
          background: #f2f2f2;
        }

        .shop-product-image {
          display: block;
          width: 100%;
          height: 220px;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform .3s ease;
        }

        .shop-product-card:hover .shop-product-image {
          transform: scale(1.04);
        }

        .shop-product-content {
          padding: 16px;
        }

        .shop-product-title {
          display: -webkit-box;
          min-height: 42px;
          overflow: hidden;
          margin: 0 0 10px;
          color: #262626;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.45;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow-wrap: anywhere;
        }

        .shop-product-title a {
          color: inherit;
          text-decoration: none;
        }

        .shop-product-title a:hover {
          color: #8a6a3f;
        }

        .shop-product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 16px;
        }

        .shop-price {
          color: #171717;
          font-size: 20px;
          font-weight: 750;
          letter-spacing: -.4px;
          overflow-wrap: anywhere;
        }

        .shop-price-label {
          display: block;
          margin-bottom: 3px;
          color: #737373;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .4px;
          text-transform: uppercase;
        }

        .shop-add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 44px;
          padding: 11px 12px;
          border: none;
          border-radius: 10px;
          background: #1d1d1d;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .shop-add-button:hover:not(:disabled) {
          background: #8a6a3f;
        }

        .shop-add-button:active:not(:disabled) {
          transform: scale(.98);
        }

        .shop-add-button:disabled {
          cursor: not-allowed;
          opacity: .65;
        }

        .shop-state {
          grid-column: 1 / -1;
          padding: 56px 20px;
          border: 1px dashed #d4d4d4;
          border-radius: 16px;
          background: #fff;
          text-align: center;
        }

        .shop-state-icon {
          margin-bottom: 12px;
          font-size: 36px;
        }

        .shop-state h3 {
          margin: 0 0 8px;
          font-size: 19px;
        }

        .shop-state p {
          margin: 0;
          color: #737373;
          font-size: 14px;
        }

        .shop-clear-button {
          margin-top: 18px;
          padding: 10px 16px;
          border: 1px solid #dedede;
          border-radius: 9px;
          background: white;
          color: #262626;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        /* Pagination Styles */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          min-width: 40px;
          height: 40px;
          padding: 0 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #a8895d;
          color: #a8895d;
        }

        .pagination-btn.active {
          background: #171717;
          border-color: #171717;
          color: #fff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1050px) {
          .shop-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .shop-product-image {
            height: 200px;
          }

          .shop-hero {
            padding: 36px;
          }
        }

        @media (max-width: 720px) {
          .shop-page {
            padding-top: 18px;
          }

          .shop-container {
            width: calc(100% - 28px);
          }

          .shop-hero {
            min-height: 220px;
            padding: 28px 24px;
            margin-bottom: 22px;
            border-radius: 18px;
          }

          .shop-hero h1 {
            font-size: 32px;
            letter-spacing: -.8px;
          }

          .shop-hero p {
            font-size: 13px;
          }

          .shop-hero-decoration {
            width: 85px;
            height: 85px;
            font-size: 38px;
          }

          .shop-toolbar {
            align-items: stretch;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 24px;
          }

          .shop-category {
            width: 100%;
          }

          .shop-section-heading h2 {
            font-size: 22px;
          }

          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .shop-image-wrap {
            padding: 8px;
          }

          .shop-product-image {
            height: 155px;
          }

          .shop-product-content {
            padding: 12px;
          }

          .shop-product-title {
            min-height: 40px;
            font-size: 13px;
          }

          .shop-price {
            font-size: 17px;
          }

          .shop-add-button {
            min-height: 42px;
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .shop-hero {
            padding: 24px 18px;
          }

          .shop-hero-decoration {
            display: none;
          }

          .shop-product-image {
            height: 130px;
          }

          .shop-product-content {
            padding: 10px;
          }

          .shop-price {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="shop-container">
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <span className="shop-kicker">Discover something new</span>
            <h1>Find your next favourite.</h1>
            <p>
              Explore our collection of everyday essentials and standout
              products, all in one place.
            </p>
          </div>

          <div className="shop-hero-decoration" aria-hidden="true">
            🛍️
          </div>
        </section>

        <div className="shop-toolbar">
          <div className="shop-search-wrap">
            <span className="shop-search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              className="shop-search"
              placeholder="Search products by name..."
              aria-label="Search products"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>

          <select
            className="shop-category"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="Footwear">Footwear</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Home">Home</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <div className="shop-section-heading">
          <h2>Explore Products</h2>
          {!loading && (
            <span className="shop-result-count">
              Showing {products.length > 0 ? indexOfFirstProduct + 1 : 0}-
              {Math.min(indexOfLastProduct, products.length)} of {products.length} products
            </span>
          )}
        </div>

        <div className="shop-grid">
          {loading ? (
            <div className="shop-state">
              <div className="shop-state-icon">⌛</div>
              <h3>Loading products...</h3>
              <p>Just a moment while we fetch the collection.</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="shop-state">
              <div className="shop-state-icon">🔎</div>
              <h3>No products found</h3>
              <p>Try another search term or choose a different category.</p>
              <button
                className="shop-clear-button"
                onClick={() => {
                  setsearch('')
                  setcategory('')
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            currentProducts.map((item) => (
              <article className="shop-product-card" key={item._id || item.id}>
                <Link
                  to={`/products/${item._id || item.id}`}
                  className="shop-image-wrap"
                  aria-label={`View ${item.title}`}
                >
                  <img
                    className="shop-product-image"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                </Link>

                <div className="shop-product-content">
                  <h3 className="shop-product-title">
                    <Link to={`/products/${item._id || item.id}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <div className="shop-product-bottom">
                    <div>
                      <span className="shop-price-label">Price</span>
                      <span className="shop-price">₹{item.prices}</span>
                    </div>
                  </div>

                  <button
                    className="shop-add-button"
                    onClick={() => addToCart(item._id || item.id)}
                    disabled={addingProduct !== null}
                  >
                    {addingProduct === (item._id || item.id)
                      ? 'Adding...'
                      : '＋ Add to Cart'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${
                    currentPage === pageNum ? 'active' : ''
                  }`}
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              className="pagination-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home