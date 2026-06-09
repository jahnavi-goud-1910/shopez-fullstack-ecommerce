import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/orderSlice';

const TABS = ['📦 Products', '🛍️ Orders'];
const CATEGORIES = ['Electronics','Sports','Clothing','Kitchen','Books','Toys'];
const STATUS_OPTIONS = ['Pending','Processing','Shipped','Delivered','Cancelled'];

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { products } = useSelector(s => s.products);
  const { allOrders } = useSelector(s => s.orders);

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name:'', description:'', price:'', category:'Electronics', image:'', countInStock:'' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return; }
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [user]);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg(''); setErr('');
    if (!form.name || !form.price || !form.category) { setErr('Name, price and category are required'); return; }
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, form, config);
        setMsg('Product updated!');
      } else {
        await axios.post('http://localhost:5000/api/products', form, config);
        setMsg('Product added!');
      }
      setForm({ name:'', description:'', price:'', category:'Electronics', image:'', countInStock:'' });
      setEditId(null);
      dispatch(fetchProducts());
    } catch (e) { setErr(e.response?.data?.message || 'Error'); }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({ name:p.name, description:p.description, price:p.price, category:p.category, image:p.image, countInStock:p.countInStock });
    setMsg(''); setErr('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      dispatch(fetchProducts());
      setMsg('Product deleted!');
    } catch (e) { setErr(e.response?.data?.message || 'Error'); }
  };

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const totalRevenue = allOrders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);

  return (
    <div style={S.container}>
      <h1 style={S.title}>⚙️ Admin Dashboard</h1>

      {/* Stats */}
      <div style={S.stats}>
        {[
          { label:'Total Products', value: products.length, color:'#e94560' },
          { label:'Total Orders',   value: allOrders.length, color:'#378add' },
          { label:'Revenue',        value: `₹${totalRevenue.toLocaleString()}`, color:'#3cb371' },
          { label:'Pending Orders', value: allOrders.filter(o => o.status === 'Pending').length, color:'#f4a261' },
        ].map(s => (
          <div key={s.label} style={S.stat}>
            <p style={{ ...S.statVal, color:s.color }}>{s.value}</p>
            <p style={S.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{ ...S.tabBtn, borderBottom: tab === i ? '2px solid #e94560' : '2px solid transparent', color: tab === i ? '#e94560' : '#666' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 0 && (
        <div style={S.tabContent}>
          {/* Product Form */}
          <div style={S.formCard}>
            <h2 style={S.secTitle}>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
            {msg && <p style={S.success}>{msg}</p>}
            {err && <p style={S.errMsg}>{err}</p>}
            <div style={S.formGrid}>
              {[
                { name:'name',        label:'Product Name', ph:'e.g. Wireless Headphones' },
                { name:'price',       label:'Price (₹)',    ph:'e.g. 4999' },
                { name:'countInStock',label:'Stock',        ph:'e.g. 25' },
                { name:'image',       label:'Image URL',    ph:'https://...' },
              ].map(f => (
                <div key={f.name} style={S.field}>
                  <label style={S.label}>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} style={S.input} />
                </div>
              ))}
              <div style={S.field}>
                <label style={S.label}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={S.input}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ ...S.field, gridColumn:'1 / -1' }}>
                <label style={S.label}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  style={{ ...S.input, resize:'vertical' }} placeholder="Product description..." rows={2} />
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={handleSubmit} style={S.submitBtn}>{editId ? 'Update Product' : 'Add Product'}</button>
              {editId && <button onClick={() => { setEditId(null); setForm({ name:'', description:'', price:'', category:'Electronics', image:'', countInStock:'' }); }} style={S.cancelBtn}>Cancel</button>}
            </div>
          </div>

          {/* Products Table */}
          <div style={S.tableCard}>
            <h2 style={S.secTitle}>All Products ({products.length})</h2>
            <div style={{ overflowX:'auto' }}>
              <table style={S.table}>
                <thead><tr style={S.thead}>
                  <th style={S.th}>Image</th><th style={S.th}>Name</th>
                  <th style={S.th}>Category</th><th style={S.th}>Price</th>
                  <th style={S.th}>Stock</th><th style={S.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={S.tr}>
                      <td style={S.td}><img src={p.image} alt={p.name} style={S.thumb} /></td>
                      <td style={S.td}><span style={S.productName}>{p.name}</span></td>
                      <td style={S.td}><span style={S.catChip}>{p.category}</span></td>
                      <td style={S.td}>₹{p.price.toLocaleString()}</td>
                      <td style={{ ...S.td, color: p.countInStock === 0 ? 'red' : 'green' }}>{p.countInStock}</td>
                      <td style={S.td}>
                        <button onClick={() => handleEdit(p)} style={S.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(p._id)} style={S.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 1 && (
        <div style={S.tableCard}>
          <h2 style={S.secTitle}>All Orders ({allOrders.length})</h2>
          <div style={{ overflowX:'auto' }}>
            <table style={S.table}>
              <thead><tr style={S.thead}>
                <th style={S.th}>Order ID</th><th style={S.th}>Customer</th>
                <th style={S.th}>Total</th><th style={S.th}>Paid</th>
                <th style={S.th}>Date</th><th style={S.th}>Status</th>
              </tr></thead>
              <tbody>
                {allOrders.map(o => (
                  <tr key={o._id} style={S.tr}>
                    <td style={{ ...S.td, fontFamily:'monospace', fontSize:'0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td style={S.td}>{o.user?.name || 'N/A'}</td>
                    <td style={S.td}>₹{o.totalPrice.toLocaleString()}</td>
                    <td style={S.td}><span style={{ color: o.isPaid ? 'green' : '#e94560' }}>{o.isPaid ? '✅' : '⏳'}</span></td>
                    <td style={S.td}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={S.td}>
                      <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)} style={S.statusSelect}>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const S = {
  container:   { maxWidth:'1200px', margin:'0 auto', padding:'2rem' },
  title:       { color:'#1a1a2e', marginBottom:'1.5rem' },
  stats:       { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'2rem' },
  stat:        { backgroundColor:'white', borderRadius:'10px', padding:'1.25rem', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  statVal:     { fontSize:'1.75rem', fontWeight:'bold', margin:0 },
  statLabel:   { color:'#888', fontSize:'0.85rem', margin:'0.3rem 0 0' },
  tabs:        { display:'flex', gap:'0', borderBottom:'1px solid #eee', marginBottom:'1.5rem' },
  tabBtn:      { padding:'0.75rem 1.5rem', background:'none', border:'none', cursor:'pointer', fontSize:'0.95rem', fontWeight:'500' },
  tabContent:  { display:'flex', flexDirection:'column', gap:'1.5rem' },
  formCard:    { backgroundColor:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  tableCard:   { backgroundColor:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  secTitle:    { margin:'0 0 1rem', color:'#1a1a2e', fontSize:'1.1rem' },
  formGrid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'1rem' },
  field:       { display:'flex', flexDirection:'column' },
  label:       { fontSize:'0.85rem', fontWeight:'500', color:'#555', marginBottom:'0.3rem' },
  input:       { padding:'0.6rem', border:'1px solid #ddd', borderRadius:'6px', fontSize:'0.9rem', boxSizing:'border-box' },
  submitBtn:   { padding:'0.7rem 1.5rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'600' },
  cancelBtn:   { padding:'0.7rem 1.5rem', backgroundColor:'white', color:'#666', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer' },
  success:     { color:'green', backgroundColor:'#e8f5e9', padding:'0.5rem 0.75rem', borderRadius:'4px', fontSize:'0.875rem', marginBottom:'0.75rem' },
  errMsg:      { color:'red', backgroundColor:'#ffe0e0', padding:'0.5rem 0.75rem', borderRadius:'4px', fontSize:'0.875rem', marginBottom:'0.75rem' },
  table:       { width:'100%', borderCollapse:'collapse' },
  thead:       { backgroundColor:'#f8f9fa' },
  th:          { padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.85rem', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee' },
  tr:          { borderBottom:'1px solid #f0f0f0' },
  td:          { padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#333', verticalAlign:'middle' },
  thumb:       { width:'45px', height:'45px', objectFit:'cover', borderRadius:'6px' },
  productName: { fontWeight:'500', color:'#1a1a2e' },
  catChip:     { backgroundColor:'#f0f0f0', padding:'0.2rem 0.6rem', borderRadius:'10px', fontSize:'0.8rem' },
  editBtn:     { padding:'0.3rem 0.75rem', backgroundColor:'#378add', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', marginRight:'0.5rem', fontSize:'0.8rem' },
  deleteBtn:   { padding:'0.3rem 0.75rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem' },
  statusSelect:{ padding:'0.3rem 0.5rem', borderRadius:'4px', border:'1px solid #ddd', fontSize:'0.8rem', cursor:'pointer' },
};
export default AdminPage;
