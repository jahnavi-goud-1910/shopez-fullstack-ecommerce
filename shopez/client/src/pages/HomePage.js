import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All','Electronics','Sports','Clothing','Kitchen','Books','Toys'];

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((s) => s.products);
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const filtered = category === 'All' ? products : products.filter(p => p.category === category);
  const searched = search.trim() === '' ? filtered : filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Welcome to ShopEZ 🛍️</h1>
        <p style={S.heroSub}>Find everything you need — electronics, clothing, sports & more</p>
        <div style={S.searchRow}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={S.input} />
        </div>
      </div>

      <div style={S.container}>
        {/* Category Pills */}
        <div style={S.catRow}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ ...S.catBtn, backgroundColor: category === cat ? '#e94560' : '#f0f0f0', color: category === cat ? 'white' : '#333' }}>
              {cat}
            </button>
          ))}
        </div>

        <p style={S.count}>{searched.length} product{searched.length !== 1 ? 's' : ''}{category !== 'All' ? ` in ${category}` : ''}</p>

        {loading && <p style={S.info}>Loading products...</p>}
        {error   && <p style={S.err}>{error}</p>}
        {!loading && searched.length === 0 && <p style={S.info}>No products found.</p>}

        <div style={S.grid}>
          {searched.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

const S = {
  page:      { backgroundColor:'#f8f9fa', minHeight:'100vh' },
  hero:      { backgroundColor:'#1a1a2e', padding:'3rem 2rem', textAlign:'center' },
  heroTitle: { color:'white', fontSize:'2rem', margin:'0 0 0.5rem' },
  heroSub:   { color:'#a8dadc', margin:'0 0 1.5rem' },
  searchRow: { display:'flex', justifyContent:'center' },
  input:     { padding:'0.75rem 1.25rem', fontSize:'1rem', borderRadius:'30px', border:'none', width:'400px', maxWidth:'90vw', outline:'none' },
  container: { maxWidth:'1200px', margin:'0 auto', padding:'2rem' },
  catRow:    { display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.25rem' },
  catBtn:    { padding:'0.4rem 1.1rem', borderRadius:'20px', border:'none', cursor:'pointer', fontSize:'0.875rem', fontWeight:'500', transition:'all 0.2s' },
  count:     { color:'#888', fontSize:'0.875rem', marginBottom:'1rem' },
  grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'1.5rem' },
  info:      { textAlign:'center', color:'#666', padding:'3rem' },
  err:       { textAlign:'center', color:'red' },
};
export default HomePage;
