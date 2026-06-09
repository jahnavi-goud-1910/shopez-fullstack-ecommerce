import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Sports', 'Clothing', 'Kitchen', 'Books', 'Toys'];
const SORT_OPTIONS = [
  { value: 'default',   label: 'Default' },
  { value: 'low-high',  label: 'Price: Low to High' },
  { value: 'high-low',  label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'newest',    label: 'Newest First' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useSelector(s => s.products);

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort,     setSort]     = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock,  setInStock]  = useState(false);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategory = (cat) => {
    setCategory(cat);
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  let filtered = [...products];
  if (category !== 'All')       filtered = filtered.filter(p => p.category === category);
  if (search.trim())             filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (minPrice)                  filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice)                  filtered = filtered.filter(p => p.price <= Number(maxPrice));
  if (inStock)                   filtered = filtered.filter(p => p.countInStock > 0);

  if (sort === 'low-high')  filtered.sort((a, b) => a.price - b.price);
  if (sort === 'high-low')  filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating')    filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'newest')    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const clearFilters = () => { setSearch(''); setCategory('All'); setSort('default'); setMinPrice(''); setMaxPrice(''); setInStock(false); setSearchParams({}); };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>All Products</h1>
        <div style={S.searchBar}>
          <span style={S.searchIcon}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={S.searchInput} />
        </div>
      </div>

      <div style={S.layout}>
        {/* Sidebar Filters */}
        <aside style={S.sidebar}>
          <div style={S.filterHeader}>
            <h3 style={S.filterTitle}>Filters</h3>
            <button onClick={clearFilters} style={S.clearBtn}>Clear All</button>
          </div>

          {/* Category */}
          <div style={S.filterSection}>
            <h4 style={S.filterLabel}>Category</h4>
            {CATEGORIES.map(cat => (
              <label key={cat} style={S.checkRow}>
                <input type="radio" name="category" checked={category === cat}
                  onChange={() => handleCategory(cat)} style={{ marginRight: '0.5rem' }} />
                <span style={{ color: category === cat ? '#e94560' : '#333', fontWeight: category === cat ? '600' : '400' }}>{cat}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div style={S.filterSection}>
            <h4 style={S.filterLabel}>Price Range (₹)</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" style={S.priceInput} type="number" />
              <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" style={S.priceInput} type="number" />
            </div>
          </div>

          {/* In Stock */}
          <div style={S.filterSection}>
            <label style={{ ...S.checkRow, cursor: 'pointer' }}>
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} style={{ marginRight: '0.5rem' }} />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <main style={S.main}>
          {/* Sort + Count bar */}
          <div style={S.toolbar}>
            <span style={S.resultCount}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
            <div style={S.sortRow}>
              <span style={{ color: '#888', fontSize: '0.875rem' }}>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={S.sortSelect}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div style={S.pills}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategory(cat)}
                style={{ ...S.pill, backgroundColor: category === cat ? '#e94560' : '#f0f0f0', color: category === cat ? 'white' : '#555' }}>
                {cat}
              </button>
            ))}
          </div>

          {loading && <p style={S.info}>Loading products...</p>}
          {error   && <p style={S.err}>{error}</p>}
          {!loading && filtered.length === 0 && (
            <div style={S.empty}>
              <p style={{ fontSize: '3rem' }}>😕</p>
              <p>No products match your filters.</p>
              <button onClick={clearFilters} style={S.clearBtn2}>Clear Filters</button>
            </div>
          )}

          <div style={S.grid}>
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </main>
      </div>
    </div>
  );
};

const S = {
  page:         { backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header:       { backgroundColor: '#1a1a2e', padding: '2rem 2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' },
  title:        { color: 'white', fontSize: '1.75rem', margin: 0, fontWeight: '700' },
  searchBar:    { display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '30px', padding: '0.5rem 1.25rem', gap: '0.5rem', flex: 1, maxWidth: '400px' },
  searchIcon:   { fontSize: '1rem' },
  searchInput:  { border: 'none', outline: 'none', fontSize: '0.95rem', flex: 1 },
  layout:       { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', padding: '1.5rem 2rem', maxWidth: '1300px', margin: '0 auto' },
  sidebar:      { backgroundColor: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignSelf: 'start', position: 'sticky', top: '1rem' },
  filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  filterTitle:  { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1a1a2e' },
  clearBtn:     { background: 'none', border: 'none', color: '#e94560', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' },
  filterSection:{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f0f0f0' },
  filterLabel:  { margin: '0 0 0.6rem', fontSize: '0.85rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' },
  checkRow:     { display: 'flex', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.875rem' },
  priceInput:   { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.875rem' },
  main:         { minWidth: 0 },
  toolbar:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  resultCount:  { color: '#888', fontSize: '0.875rem' },
  sortRow:      { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  sortSelect:   { padding: '0.4rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' },
  pills:        { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
  pill:         { padding: '0.3rem 0.875rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  info:         { textAlign: 'center', color: '#666', padding: '3rem' },
  err:          { textAlign: 'center', color: 'red' },
  empty:        { textAlign: 'center', padding: '3rem', color: '#888' },
  clearBtn2:    { marginTop: '0.75rem', padding: '0.5rem 1.25rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ProductsPage;
