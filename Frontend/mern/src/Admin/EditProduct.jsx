
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../axios";
import { toast } from "react-toastify";

const emptyForm = {
  title: "",
  description: "",
  prices: "",
  category: "",
  stock: "",
  image: "",
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const response = await api.get("/products");
        const product = response.data.find((item) => item._id === id);

        if (!product) {
          toast.error("Product not found.");
          navigate("/admin/products");
          return;
        }

        if (active) {
          setForm({
            title: product.title ?? "",
            description: product.description ?? "",
            prices: String(product.prices ?? ""),
            category: product.category ?? "",
            stock: String(product.stock ?? ""),
            image: product.image ?? "",
          });
        }
      } catch (error) {
        toast.error("Unable to load product.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => { active = false; };
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function updateProduct(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() ||
        !form.category.trim() || !form.image.trim() ||
        form.prices === "" || form.stock === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Number(form.prices) < 0 || Number(form.stock) < 0) {
      toast.error("Price and stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/products/update/${id}`, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        prices: Number(form.prices),
        stock: Number(form.stock),
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-loading">
        <style>{styles}</style>
        <div className="loading-spinner" />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <style>{styles}</style>
      <div className="product-page-inner">
        <div className="page-heading">
          <div>
            <div className="eyebrow">INVENTORY MANAGEMENT</div>
            <h1>Edit product</h1>
            <p>Update product details and inventory information.</p>
          </div>
          <Link to="/admin/products" className="secondary-btn">← All products</Link>
        </div>

        <form className="product-form-card" onSubmit={updateProduct}>
          <div className="form-section-title">
            <div className="section-icon">✎</div>
            <div>
              <h2>Product information</h2>
              <p>Make changes to your product listing.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field label="Product title">
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Product title" required maxLength={120} />
            </Field>
            <Field label="Category">
              <input name="category" value={form.category} onChange={handleChange}
                placeholder="Product category" required />
            </Field>
            <Field label="Price (₹)">
              <input name="prices" type="number" min="0" step="0.01"
                value={form.prices} onChange={handleChange} required />
            </Field>
            <Field label="Available stock">
              <input name="stock" type="number" min="0" step="1"
                value={form.stock} onChange={handleChange} required />
            </Field>
            <div className="field full-width">
              <label>Product description <span>*</span></label>
              <textarea name="description" value={form.description}
                onChange={handleChange} rows="5" required maxLength={2000} />
            </div>
            <div className="field full-width">
              <label>Product image URL <span>*</span></label>
              <input name="image" type="url" value={form.image}
                onChange={handleChange} placeholder="https://example.com/image.jpg" required />
            </div>
          </div>

          {form.image.trim() && (
            <div className="image-preview">
              <div>
                <strong>Image preview</strong>
                <p>Updated product image</p>
              </div>
              <img src={form.image} alt="Product preview"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                onLoad={(e) => { e.currentTarget.style.display = "block"; }} />
            </div>
          )}

          <div className="form-footer">
            <span className="required-note">Review changes before saving.</span>
            <div className="form-actions">
              <Link to="/admin/products" className="secondary-btn">Cancel</Link>
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? "Saving changes..." : "✓ Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

const styles = `
.product-page{min-height:100vh;background:#f6f7fb;padding:32px;color:#182230;box-sizing:border-box}
.product-page *{box-sizing:border-box}
.product-page-inner{max-width:1000px;margin:0 auto}
.page-heading{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:26px}
.eyebrow{font-size:11px;font-weight:800;letter-spacing:1.5px;color:#6658d9;margin-bottom:9px}
.page-heading h1{font-size:clamp(25px,3vw,34px);letter-spacing:-1px;margin:0;font-weight:800}
.page-heading p,.form-section-title p,.image-preview p{margin:7px 0 0;color:#7b8496;font-size:14px}
.product-form-card{background:#fff;border:1px solid #e9ebf2;border-radius:20px;padding:clamp(20px,4vw,36px);box-shadow:0 8px 30px rgba(31,41,55,.04)}
.form-section-title{display:flex;gap:14px;align-items:center;padding-bottom:25px;border-bottom:1px solid #eef0f5;margin-bottom:27px}
.section-icon{width:45px;height:45px;display:grid;place-items:center;background:#eeecff;color:#6355d9;border-radius:13px;font-size:22px;flex-shrink:0}
.form-section-title h2{font-size:18px;margin:0;font-weight:750}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:23px 22px}
.field{display:flex;flex-direction:column;gap:9px;min-width:0}
.field label{font-size:13px;font-weight:700;color:#364152}
.field label span{color:#e05260}
.field input,.field textarea{width:100%;min-width:0;border:1px solid #dfe3eb;background:#fff;border-radius:10px;padding:13px 14px;font:inherit;font-size:14px;color:#202939;outline:none;transition:border .2s,box-shadow .2s}
.field input:focus,.field textarea:focus{border-color:#7668e8;box-shadow:0 0 0 3px rgba(118,104,232,.12)}
.field textarea{resize:vertical;min-height:120px;line-height:1.6}
.full-width{grid-column:1/-1}
.image-preview{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:17px;margin-top:25px;border:1px solid #e8eaf2;background:#fafaff;border-radius:13px}
.image-preview strong{font-size:13px}
.image-preview img{width:100px;height:85px;object-fit:cover;border-radius:10px;border:1px solid #e7e8ef}
.form-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;border-top:1px solid #eef0f5;margin-top:30px;padding-top:24px}
.required-note{font-size:12px;color:#8991a0}
.form-actions{display:flex;align-items:center;gap:10px}
.primary-btn,.secondary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:10px;font-size:13px;font-weight:750;text-decoration:none;cursor:pointer;transition:transform .2s,background .2s;border:1px solid transparent}
.primary-btn{background:#6254d9;color:white;box-shadow:0 5px 12px #6254d926}
.primary-btn:hover{background:#5143c4;transform:translateY(-1px)}
.primary-btn:disabled{opacity:.65;cursor:not-allowed;transform:none}
.secondary-btn{background:#fff;border-color:#e0e4ed;color:#455064}
.secondary-btn:hover{background:#f5f6fb}
.edit-loading{min-height:55vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f6f7fb;color:#737c8e}
.loading-spinner{width:35px;height:35px;border:3px solid #e0defa;border-top-color:#6254d9;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:640px){.product-page{padding:20px 14px}.page-heading{align-items:flex-start;flex-direction:column}.form-grid{grid-template-columns:1fr;gap:19px}.full-width{grid-column:auto}.form-footer{align-items:stretch;flex-direction:column}.form-actions{width:100%}.form-actions>*{flex:1}.image-preview{align-items:flex-start}.image-preview img{width:85px;height:80px}}
@media(max-width:380px){.product-form-card{padding:18px 14px}.form-actions{flex-direction:column}.form-actions>*{width:100%}}
`;
