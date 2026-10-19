import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import api from "../axios";
import { toast } from "react-toastify";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => ["All categories", ...new Set(
      products.map((p) => p.category).filter(Boolean)
    )],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        (product.title || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query);

      const matchesCategory =
        category === "All categories" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // Reset to page 1 whenever search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // Pagination Calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      await api.delete(`/products/delete/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success("Product deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  const lowStockCount = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 5
  ).length;

  const outOfStockCount = products.filter(
    (p) => Number(p.stock) <= 0
  ).length;

  return (
    <div className="inventory-page">
      <style>{styles}</style>

      <div className="inventory-inner">
        <header className="inventory-header">
          <div>
            <div className="inventory-eyebrow">STORE MANAGEMENT</div>
            <h1>All products</h1>
            <p>Manage your catalog, pricing and inventory in one place.</p>
          </div>
          <Link to="/admin/products/add" className="add-product-btn">
            <span>＋</span> Add product
          </Link>
        </header>

        <div className="inventory-stats">
          <div className="inventory-stat">
            <div className="stat-icon purple">▦</div>
            <div>
              <span>Total products</span>
              <strong>{products.length}</strong>
              <small>Products in catalog</small>
            </div>
          </div>
          <div className="inventory-stat">
            <div className="stat-icon orange">!</div>
            <div>
              <span>Low stock</span>
              <strong>{lowStockCount}</strong>
              <small>1–5 units remaining</small>
            </div>
          </div>
          <div className="inventory-stat">
            <div className="stat-icon red">↘</div>
            <div>
              <span>Out of stock</span>
              <strong>{outOfStockCount}</strong>
              <small>Needs replenishment</small>
            </div>
          </div>
        </div>

        <section className="catalog-card">
          <div className="catalog-heading">
            <div>
              <h2>Product catalog</h2>
              <p>
                {loading
                  ? "Loading your inventory..."
                  : filteredProducts.length > 0
                  ? `Showing ${indexOfFirstProduct + 1}-${Math.min(
                      indexOfLastProduct,
                      filteredProducts.length
                    )} of ${filteredProducts.length} products`
                  : "0 products found"}
              </p>
            </div>
            <button
              className="refresh-btn"
              onClick={loadProducts}
              disabled={loading}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="catalog-filters">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, descriptions..."
                aria-label="Search products"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  aria-label="Clear search">×</button>
              )}
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="inventory-empty">
              <div className="inventory-spinner" />
              <p>Loading products...</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="inventory-empty">
              <div className="empty-icon">▦</div>
              <h3>{products.length ? "No matching products" : "No products yet"}</h3>
              <p>
                {products.length
                  ? "Try changing your search or category filter."
                  : "Add your first product to start building your catalog."}
              </p>
              {products.length === 0 && (
                <Link to="/admin/products/add" className="add-product-btn">
                  ＋ Add your first product
                </Link>
              )}
              {(search || category !== "All categories") && (
                <button className="reset-filter-btn" type="button"
                  onClick={() => { setSearch(""); setCategory("All categories"); }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => {
                  const stock = Number(product.stock) || 0;
                  const isOut = stock <= 0;
                  const isLow = stock > 0 && stock <= 5;

                  return (
                    <article className="inventory-product" key={product._id}>
                      <div className="product-image-wrap">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title || "Product"}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling.style.display = "grid";
                            }}
                          />
                        ) : null}
                        <div
                          className="product-image-fallback"
                          style={{ display: product.image ? "none" : "grid" }}
                        >
                          ▦
                        </div>

                        <span className={`stock-badge ${isOut ? "out" : isLow ? "low" : "available"}`}>
                          {isOut ? "Out of stock" : isLow ? "Low stock" : "In stock"}
                        </span>
                      </div>

                      <div className="inventory-product-body">
                        <div className="product-category">
                          {product.category || "Uncategorized"}
                        </div>
                        <h3 title={product.title}>{product.title || "Untitled product"}</h3>
                        <p className="product-description">
                          {product.description || "No description available."}
                        </p>

                        <div className="product-meta">
                          <div>
                            <span>Price</span>
                            <strong>
                              {Number(product.prices || 0).toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </div>
                          <div className="stock-number">
                            <span>Stock</span>
                            <strong className={isOut ? "stock-red" : isLow ? "stock-orange" : ""}>
                              {stock} units
                            </strong>
                          </div>
                        </div>

                        <div className="product-actions">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="edit-product-btn"
                          >
                            ✎ Edit
                          </Link>
                          <button
                            type="button"
                            className="delete-product-btn"
                            onClick={() => deleteProduct(product)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id ? "Deleting..." : "⌫ Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    type="button"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => paginate(pageNum)}
                        type="button"
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="pagination-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = `
.inventory-page{min-height:100vh;background:#f6f7fb;padding:30px;color:#182230;box-sizing:border-box}
.inventory-page *{box-sizing:border-box}
.inventory-inner{max-width:1400px;margin:0 auto}
.inventory-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:27px}
.inventory-eyebrow{font-size:11px;letter-spacing:1.5px;font-weight:800;color:#6658d9;margin-bottom:9px}
.inventory-header h1{font-size:clamp(26px,3vw,35px);font-weight:800;letter-spacing:-1px;margin:0}
.inventory-header p{font-size:14px;color:#7b8496;margin:8px 0 0}
.add-product-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#6254d9;color:#fff;text-decoration:none;border:0;border-radius:11px;padding:13px 18px;min-height:45px;font-size:13px;font-weight:750;white-space:nowrap;box-shadow:0 5px 14px #6254d926;transition:background .2s,transform .2s}
.add-product-btn:hover{background:#5143c4;transform:translateY(-1px)}
.add-product-btn span{font-size:19px;line-height:1}
.inventory-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px;margin-bottom:25px}
.inventory-stat{display:flex;align-items:center;gap:15px;padding:22px;background:#fff;border:1px solid #e9ebf2;border-radius:16px;box-shadow:0 5px 20px #1f293708;min-width:0}
.stat-icon{display:grid;place-items:center;flex-shrink:0;width:46px;height:46px;border-radius:13px;font-size:23px;font-weight:800}
.stat-icon.purple{background:#eeecff;color:#6254d9}
.stat-icon.orange{background:#fff3df;color:#d88a1b}
.stat-icon.red{background:#ffeded;color:#dc535d}
.inventory-stat span,.inventory-stat small{display:block;color:#7b8496;font-size:12px}
.inventory-stat strong{display:block;font-size:26px;line-height:1.35;letter-spacing:-.5px;margin:2px 0}
.inventory-stat small{font-size:11px}
.catalog-card{background:#fff;border:1px solid #e9ebf2;border-radius:18px;overflow:hidden;box-shadow:0 5px 25px #1f293708;padding-bottom:30px}
.catalog-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:24px 25px;border-bottom:1px solid #edf0f5}
.catalog-heading h2{font-size:18px;margin:0;font-weight:800}
.catalog-heading p{font-size:12px;color:#8790a0;margin:6px 0 0}
.refresh-btn{border:1px solid #e0e4ed;background:#fff;border-radius:9px;padding:10px 13px;color:#455064;font-size:12px;font-weight:700;cursor:pointer}
.refresh-btn:hover{background:#f6f7fb}
.refresh-btn:disabled{opacity:.5;cursor:wait}
.catalog-filters{display:flex;align-items:center;gap:12px;padding:19px 25px;border-bottom:1px solid #edf0f5}
.search-box{display:flex;align-items:center;gap:10px;flex:1;min-width:0;border:1px solid #dfe3eb;border-radius:10px;padding:0 12px;height:44px}
.search-box:focus-within{border-color:#7668e8;box-shadow:0 0 0 3px #7668e81a}
.search-box>span{font-size:22px;color:#8992a3}
.search-box input{width:100%;min-width:0;border:0;outline:none;font:inherit;font-size:13px;color:#202939;background:transparent}
.search-box input::placeholder{color:#a0a7b5}
.search-box button{border:0;background:transparent;color:#737c8d;font-size:20px;cursor:pointer}
.catalog-filters select{height:44px;max-width:220px;min-width:160px;border:1px solid #dfe3eb;border-radius:10px;padding:0 12px;background:#fff;color:#455064;font:inherit;font-size:13px;outline:none}
.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:19px;padding:24px}
.inventory-product{min-width:0;border:1px solid #e8eaf1;border-radius:15px;overflow:hidden;background:#fff;transition:box-shadow .2s,transform .2s}
.inventory-product:hover{box-shadow:0 10px 25px #242b3d12;transform:translateY(-2px)}
.product-image-wrap{height:190px;position:relative;background:#f5f6fa;overflow:hidden}
.product-image-wrap>img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
.inventory-product:hover .product-image-wrap>img{transform:scale(1.035)}
.product-image-fallback{width:100%;height:100%;place-items:center;font-size:35px;color:#b2b8c8;background:linear-gradient(135deg,#f6f6fc,#edeefa)}
.stock-badge{position:absolute;left:12px;top:12px;border-radius:7px;padding:6px 9px;font-size:10px;font-weight:800;letter-spacing:.1px}
.stock-badge.available{background:#e3f7eb;color:#258451}
.stock-badge.low{background:#fff0d8;color:#a56812}
.stock-badge.out{background:#ffe7e8;color:#bd3844}
.inventory-product-body{padding:17px}
.product-category{font-size:10px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;color:#7769dd;margin-bottom:8px}
.inventory-product-body h3{font-size:16px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;color:#222b3a}
.product-description{font-size:12px;color:#828b9b;line-height:1.6;height:38px;overflow:hidden;margin:8px 0 15px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.product-meta{display:flex;justify-content:space-between;gap:12px;padding:13px 0;border-top:1px solid #eff1f5;border-bottom:1px solid #eff1f5}
.product-meta span{display:block;font-size:10px;color:#8a92a2;margin-bottom:5px}
.product-meta strong{display:block;font-size:14px;color:#293345}
.product-meta .stock-number{text-align:right}
.product-meta strong.stock-red{color:#d64d58}
.product-meta strong.stock-orange{color:#c17b18}
.product-actions{display:flex;gap:9px;margin-top:15px}
.edit-product-btn,.delete-product-btn{display:flex;align-items:center;justify-content:center;gap:5px;flex:1;min-width:0;height:38px;border-radius:9px;font-size:12px;font-weight:750;text-decoration:none;cursor:pointer;transition:background .2s;border:1px solid transparent}
.edit-product-btn{color:#5c4fd1;background:#efedff;border-color:#e7e4ff}
.edit-product-btn:hover{background:#e3e0ff}
.delete-product-btn{color:#c64a55;background:#fff;border-color:#f0dadd}
.delete-product-btn:hover{background:#fff0f1}
.delete-product-btn:disabled{opacity:.55;cursor:wait}
.inventory-empty{padding:65px 20px;text-align:center;color:#818a9a}
.inventory-empty .empty-icon{display:grid;place-items:center;margin:0 auto 15px;width:60px;height:60px;border-radius:18px;background:#efedff;color:#6254d9;font-size:30px}
.inventory-empty h3{font-size:18px;color:#283244;margin:0}
.inventory-empty p{font-size:13px;line-height:1.6;margin:9px 0 20px}
.inventory-empty .add-product-btn{margin:0 auto}
.reset-filter-btn{display:block;margin:12px auto 0;background:transparent;border:0;color:#6254d9;font-weight:750;cursor:pointer}
.inventory-spinner{width:32px;height:32px;border:3px solid #e4e1ff;border-top-color:#6254d9;border-radius:50%;margin:0 auto 15px;animation:inventory-spin .8s linear infinite}
@keyframes inventory-spin{to{transform:rotate(360deg)}}

/* Pagination Container & Buttons */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  padding: 0 24px;
  flex-wrap: wrap;
}
.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e0e4ed;
  border-radius: 10px;
  background: #fff;
  color: #455064;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pagination-btn:hover:not(:disabled) {
  border-color: #6254d9;
  color: #6254d9;
}
.pagination-btn.active {
  background: #6254d9;
  border-color: #6254d9;
  color: #fff;
}
.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media(min-width:1500px){.product-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:1100px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.product-image-wrap{height:200px}}
@media(max-width:700px){.inventory-page{padding:22px 14px}.inventory-header{align-items:flex-start;flex-direction:column}.inventory-header .add-product-btn{width:100%}.inventory-stats{grid-template-columns:1fr;gap:11px}.inventory-stat{padding:15px 17px}.stat-icon{width:42px;height:42px}.inventory-stat strong{font-size:23px}.catalog-heading{padding:19px 16px}.catalog-filters{padding:15px 16px;flex-direction:column;align-items:stretch}.search-box{flex:none;width:100%}.catalog-filters select{max-width:none;width:100%}.product-grid{grid-template-columns:1fr;padding:15px;gap:14px}.product-image-wrap{height:220px}}
@media(min-width:480px) and (max-width:700px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.product-image-wrap{height:160px}.inventory-product-body{padding:13px}.product-actions{gap:6px}.edit-product-btn,.delete-product-btn{font-size:11px}}
@media(max-width:360px){.inventory-page{padding:18px 10px}.catalog-heading{padding:16px 12px}.catalog-filters{padding:13px 12px}.product-grid{padding:12px}.product-image-wrap{height:180px}}
`;