import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchProducts } from '../redux/slices/productSlice';

const AdminAllProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { products, loading } = useSelector(s => s.products);

  const [search, setSearch]   = useState('');
  const [catFilter, setCat]   = useState('All');
  const [msg, setMsg]         = useState('');

  const CATEGORIES = ['All', 'Electronics', 'Sports', 'Clothing', 'Kitchen', 'Books', 'Toys'];

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return; }
    dispatch(fetchProducts());
  }, [user]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      dispatch(fetchProducts());
      setMsg(`"${name}" deleted.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  let filtered = catFilter === 'All' ? products : products.filter(p => p.category === catFilter);
  if (search.trim()) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={S.container}>
      <div style={S.topBar}>
        <div>
          <h1 style={S.title}>All Products</h1>
          <p style={S.sub}>{filtered.length} of {products.length} products</p>
        </div>
        <button onClick={() => navigate('/admin/new-product')} style={S.addBtn}>+ Add New Product</button>
      </div>

      {msg && <div style={S.toast}>{msg}</div>}

      {/* Filters */}
      <div style={S.filterBar}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={S.searchInput} />
        <div style={S.catPills}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ ...S.pill, backgroundColor: catFilter === c ? '#1a1a2e' : '#f0f0f0', color: catFilter === c ? 'white' : '#555' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>Loading...</p>}

      {/* Grid */}
      <div style={S.grid}>
        {filtered.map(p => (
          <div key={p._id} style={S.card}>
            <img src={p.image} alt={p.name} style={S.image} />
            <div style={S.cardBody}>
              <span style={S.catChip}>{p.category}</span>
              <h3 style={S.name}>{p.name}</h3>
              <p style={S.price}>₹{p.price.toLocaleString()}</p>
              <div style={S.meta}>
                <span style={{ color: p.countInStock === 0 ? '#e94560' : 'green', fontSize: '0.8rem' }}>
                  {p.countInStock === 0 ? '❌ Out of stock' : `✅ ${p.countInStock} in stock`}
                </span>
                {p.rating > 0 && <span style={{ fontSize: '0.8rem', color: '#f4a261' }}>⭐ {p.rating.toFixed(1)}</span>}
              </div>
              <div style={S.actions}>
                <button onClick={() => navigate(`/admin/edit-product/${p._id}`)} style={S.editBtn}>✏️ Edit</button>
                <button onClick={() => handleDelete(p._id, p.name)} style={S.deleteBtn}>🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ fontSize: '2.5rem' }}>📦</p>
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

const S = {
  container:   { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  topBar:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title:       { color: '#1a1a2e', margin: '0 0 0.2rem', fontSize: '1.75rem', fontWeight: '700' },
  sub:         { color: '#888', margin: 0, fontSize: '0.875rem' },
  addBtn:      { padding: '0.7rem 1.5rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
  toast:       { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' },
  filterBar:   { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', minWidth: '220px' },
  catPills:    { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  pill:        { padding: '0.3rem 0.875rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  card:        { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' },
  image:       { width: '100%', height: '170px', objectFit: 'cover' },
  cardBody:    { padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  catChip:     { display: 'inline-block', backgroundColor: '#f0f0f0', padding: '0.15rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', color: '#555' },
  name:        { margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', lineHeight: 1.3 },
  price:       { margin: 0, fontWeight: '700', color: '#e94560', fontSize: '1rem' },
  meta:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  actions:     { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  editBtn:     { flex: 1, padding: '0.45rem', backgroundColor: '#f0f4ff', color: '#3b5bdb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  deleteBtn:   { flex: 1, padding: '0.45rem', backgroundColor: '#fff0f0', color: '#e94560', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
};

export default AdminAllProductsPage;
