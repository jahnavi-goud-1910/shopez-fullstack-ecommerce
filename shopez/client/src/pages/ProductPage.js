import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchProductById, clearSelectedProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: p, loading, error } = useSelector(s => s.products);
  const { user } = useSelector(s => s.auth);
  const cartItems = useSelector(s => s.cart.cartItems);
  const inCart = cartItems.find(x => x._id === id);

  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [revMsg, setRevMsg]   = useState('');
  const [revErr, setRevErr]   = useState('');

  useEffect(() => { dispatch(fetchProductById(id)); return () => dispatch(clearSelectedProduct()); }, [dispatch, id]);

  const handleAddToCart = () => { dispatch(addToCart(p)); navigate('/cart'); };

  const handleReview = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment }, config);
      setRevMsg('Review submitted!'); setComment(''); setRevErr('');
      dispatch(fetchProductById(id));
    } catch (e) { setRevErr(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <p style={S.center}>Loading...</p>;
  if (error)   return <p style={{ ...S.center, color:'red' }}>{error}</p>;
  if (!p)      return null;

  return (
    <div style={S.container}>
      <button onClick={() => navigate(-1)} style={S.back}>← Back</button>
      <div style={S.card}>
        <img src={p.image} alt={p.name} style={S.image} />
        <div style={S.details}>
          <p style={S.cat}>{p.category}</p>
          <h1 style={S.name}>{p.name}</h1>
          <p style={S.price}>₹{p.price.toLocaleString()}</p>
          <p style={S.desc}>{p.description}</p>
          <div style={S.meta}>
            <span>Stock: <strong>{p.countInStock > 0 ? p.countInStock : 'Out of Stock'}</strong></span>
            {p.rating > 0 && <span>⭐ {p.rating.toFixed(1)} ({p.numReviews} reviews)</span>}
          </div>
          {inCart && <p style={S.inCart}>✅ {inCart.qty} already in cart</p>}
          <button onClick={handleAddToCart} disabled={p.countInStock === 0}
            style={{ ...S.addBtn, opacity: p.countInStock === 0 ? 0.5 : 1 }}>
            {p.countInStock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={S.reviewSection}>
        <h2 style={S.reviewTitle}>Customer Reviews</h2>

        {p.reviews.length === 0 && <p style={{ color:'#888' }}>No reviews yet. Be the first!</p>}
        {p.reviews.map((r, i) => (
          <div key={i} style={S.reviewCard}>
            <div style={S.reviewHeader}>
              <strong>{r.name}</strong>
              <span style={S.stars}>{'⭐'.repeat(r.rating)}</span>
            </div>
            <p style={S.reviewComment}>{r.comment}</p>
          </div>
        ))}

        {user ? (
          <div style={S.reviewForm}>
            <h3 style={{ margin:'0 0 1rem' }}>Write a Review</h3>
            {revMsg && <p style={S.success}>{revMsg}</p>}
            {revErr && <p style={S.errMsg}>{revErr}</p>}
            <label style={S.label}>Rating</label>
            <select value={rating} onChange={e => setRating(e.target.value)} style={S.select}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
            </select>
            <label style={S.label}>Comment</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              style={S.textarea} placeholder="Share your experience..." rows={3} />
            <button onClick={handleReview} style={S.reviewBtn}>Submit Review</button>
          </div>
        ) : (
          <p style={{ color:'#888' }}>Please <span style={S.loginLink} onClick={() => navigate('/login')}>login</span> to write a review.</p>
        )}
      </div>
    </div>
  );
};

const S = {
  container:     { maxWidth:'900px', margin:'0 auto', padding:'2rem' },
  back:          { background:'none', border:'1px solid #ccc', padding:'0.5rem 1rem', borderRadius:'4px', cursor:'pointer', marginBottom:'1.5rem' },
  card:          { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', backgroundColor:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', marginBottom:'2rem' },
  image:         { width:'100%', height:'380px', objectFit:'cover' },
  details:       { padding:'2rem', display:'flex', flexDirection:'column', gap:'0.75rem' },
  cat:           { color:'#e94560', fontSize:'0.85rem', fontWeight:'600', textTransform:'uppercase', margin:0 },
  name:          { fontSize:'1.7rem', color:'#1a1a2e', margin:0 },
  price:         { fontSize:'1.5rem', fontWeight:'bold', color:'#1a1a2e', margin:0 },
  desc:          { color:'#555', lineHeight:'1.6', margin:0 },
  meta:          { display:'flex', gap:'1.5rem', color:'#555', fontSize:'0.9rem', flexWrap:'wrap' },
  inCart:        { color:'green', fontSize:'0.9rem', margin:0 },
  addBtn:        { padding:'0.875rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  center:        { textAlign:'center', marginTop:'3rem', fontSize:'1.2rem' },
  reviewSection: { backgroundColor:'white', borderRadius:'12px', padding:'2rem', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  reviewTitle:   { margin:'0 0 1.25rem', color:'#1a1a2e' },
  reviewCard:    { borderBottom:'1px solid #eee', paddingBottom:'0.75rem', marginBottom:'0.75rem' },
  reviewHeader:  { display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' },
  stars:         { fontSize:'0.85rem' },
  reviewComment: { color:'#555', margin:0, fontSize:'0.9rem' },
  reviewForm:    { marginTop:'1.5rem', padding:'1.25rem', backgroundColor:'#f8f9fa', borderRadius:'8px' },
  label:         { display:'block', marginBottom:'0.3rem', fontWeight:'500', color:'#555', fontSize:'0.9rem' },
  select:        { width:'100%', padding:'0.6rem', marginBottom:'0.75rem', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.9rem' },
  textarea:      { width:'100%', padding:'0.6rem', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.9rem', boxSizing:'border-box', resize:'vertical' },
  reviewBtn:     { marginTop:'0.75rem', padding:'0.65rem 1.5rem', backgroundColor:'#1a1a2e', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'0.9rem' },
  success:       { color:'green', backgroundColor:'#e8f5e9', padding:'0.5rem 0.75rem', borderRadius:'4px', fontSize:'0.9rem' },
  errMsg:        { color:'red', backgroundColor:'#ffe0e0', padding:'0.5rem 0.75rem', borderRadius:'4px', fontSize:'0.9rem' },
  loginLink:     { color:'#e94560', cursor:'pointer', textDecoration:'underline' },
};
export default ProductPage;
