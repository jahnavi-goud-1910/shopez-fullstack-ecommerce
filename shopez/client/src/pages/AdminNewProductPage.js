import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Electronics', 'Sports', 'Clothing', 'Kitchen', 'Books', 'Toys'];

const AdminNewProductPage = () => {
  const navigate = useNavigate();
  const { id }   = useParams(); // if editing
  const { user } = useSelector(s => s.auth);
  const isEdit   = Boolean(id);

  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Electronics', image: '', countInStock: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState('');
  const [err, setErr]         = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return; }
    if (isEdit) {
      axios.get(`http://localhost:5000/api/products/${id}`)
        .then(r => {
          const p = r.data;
          setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, countInStock: p.countInStock });
        })
        .catch(() => setErr('Failed to load product'));
    }
  }, [user, id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim())  return 'Product name is required';
    if (!form.price)        return 'Price is required';
    if (!form.category)     return 'Category is required';
    if (Number(form.price) <= 0) return 'Price must be greater than 0';
    return null;
  };

  const handleSubmit = async () => {
    const validErr = validate();
    if (validErr) { setErr(validErr); return; }
    setLoading(true); setErr(''); setMsg('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/${id}`, form, config);
        setMsg('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', form, config);
        setMsg('Product added successfully!');
        setForm({ name: '', description: '', price: '', category: 'Electronics', image: '', countInStock: '' });
      }
    } catch (e) { setErr(e.response?.data?.message || 'Error saving product'); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.container}>
      <div style={S.topBar}>
        <div>
          <button onClick={() => navigate('/admin/products')} style={S.backBtn}>← Back to Products</button>
          <h1 style={S.title}>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h1>
        </div>
      </div>

      <div style={S.layout}>
        {/* Form */}
        <div style={S.formCard}>
          {msg && <div style={S.success}>{msg}</div>}
          {err && <div style={S.errMsg}>{err}</div>}

          <div style={S.grid}>
            <div style={S.field}>
              <label style={S.label}>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" style={S.input} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={S.input}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Price (₹) *</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 4999" type="number" style={S.input} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Stock Quantity</label>
              <input name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="e.g. 25" type="number" style={S.input} />
            </div>
            <div style={{ ...S.field, gridColumn: '1 / -1' }}>
              <label style={S.label}>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." style={S.input} />
            </div>
            <div style={{ ...S.field, gridColumn: '1 / -1' }}>
              <label style={S.label}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the product in detail..." style={{ ...S.input, resize: 'vertical', minHeight: '100px' }} rows={4} />
            </div>
          </div>

          <div style={S.btnRow}>
            <button onClick={handleSubmit} disabled={loading} style={S.submitBtn}>
              {loading ? 'Saving...' : (isEdit ? '✅ Update Product' : '➕ Add Product')}
            </button>
            <button onClick={() => navigate('/admin/products')} style={S.cancelBtn}>Cancel</button>
          </div>
        </div>

        {/* Preview */}
        <div style={S.preview}>
          <h3 style={S.previewTitle}>Preview</h3>
          <div style={S.previewCard}>
            {form.image
              ? <img src={form.image} alt="preview" style={S.previewImg} onError={e => { e.target.style.display = 'none'; }} />
              : <div style={S.previewPlaceholder}>🖼️ Image Preview</div>
            }
            <div style={{ padding: '0.875rem' }}>
              <span style={S.previewCat}>{form.category}</span>
              <p style={S.previewName}>{form.name || 'Product Name'}</p>
              <p style={S.previewPrice}>{form.price ? `₹${Number(form.price).toLocaleString()}` : '₹0'}</p>
              <p style={S.previewStock}>{form.countInStock ? `${form.countInStock} in stock` : 'Stock not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const S = {
  container:        { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  topBar:           { marginBottom: '1.5rem' },
  backBtn:          { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.875rem', padding: 0, marginBottom: '0.5rem', display: 'block' },
  title:            { color: '#1a1a2e', margin: 0, fontSize: '1.75rem', fontWeight: '700' },
  layout:           { display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' },
  formCard:         { backgroundColor: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  success:          { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' },
  errMsg:           { backgroundColor: '#ffe0e0', color: '#c62828', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' },
  grid:             { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' },
  field:            { display: 'flex', flexDirection: 'column' },
  label:            { fontSize: '0.875rem', fontWeight: '600', color: '#555', marginBottom: '0.35rem' },
  input:            { padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  btnRow:           { display: 'flex', gap: '0.75rem' },
  submitBtn:        { padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
  cancelBtn:        { padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  preview:          { backgroundColor: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  previewTitle:     { margin: '0 0 1rem', color: '#1a1a2e', fontSize: '0.95rem', fontWeight: '700' },
  previewCard:      { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' },
  previewImg:       { width: '100%', height: '160px', objectFit: 'cover' },
  previewPlaceholder:{ width: '100%', height: '160px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#ccc' },
  previewCat:       { display: 'inline-block', backgroundColor: '#f0f0f0', padding: '0.15rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', color: '#555', marginBottom: '0.3rem' },
  previewName:      { fontWeight: '600', margin: '0 0 0.3rem', fontSize: '0.9rem', color: '#1a1a2e' },
  previewPrice:     { fontWeight: '700', color: '#e94560', margin: '0 0 0.2rem', fontSize: '1rem' },
  previewStock:     { fontSize: '0.75rem', color: '#888', margin: 0 },
};

export default AdminNewProductPage;
