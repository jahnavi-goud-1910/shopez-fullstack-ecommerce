import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div style={S.card}>
      <img src={product.image} alt={product.name} style={S.image} onClick={() => navigate(`/product/${product._id}`)} />
      <div style={S.body}>
        <p style={S.cat}>{product.category}</p>
        <h3 style={S.name} onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
        {product.rating > 0 && <p style={S.rating}>{'⭐'.repeat(Math.round(product.rating))} ({product.numReviews})</p>}
        <div style={S.footer}>
          <span style={S.price}>₹{product.price.toLocaleString()}</span>
          <span style={S.stock}>{product.countInStock > 0 ? `${product.countInStock} left` : '❌ Out'}</span>
        </div>
        <button
          onClick={() => dispatch(addToCart(product))}
          disabled={product.countInStock === 0}
          style={{ ...S.btn, opacity: product.countInStock === 0 ? 0.5 : 1 }}
        >
          {product.countInStock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

const S = {
  card:   { border:'1px solid #eee', borderRadius:'10px', overflow:'hidden', backgroundColor:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column' },
  image:  { width:'100%', height:'190px', objectFit:'cover', cursor:'pointer' },
  body:   { padding:'0.875rem', display:'flex', flexDirection:'column', gap:'0.3rem', flex:1 },
  cat:    { fontSize:'0.75rem', color:'#e94560', fontWeight:'600', textTransform:'uppercase', margin:0 },
  name:   { margin:0, fontSize:'0.95rem', fontWeight:'600', cursor:'pointer', color:'#1a1a2e' },
  rating: { margin:0, fontSize:'0.8rem', color:'#f4a261' },
  footer: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' },
  price:  { fontWeight:'bold', color:'#1a1a2e', fontSize:'1.05rem' },
  stock:  { fontSize:'0.75rem', color:'#888' },
  btn:    { marginTop:'0.6rem', padding:'0.55rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'6px', fontSize:'0.875rem', fontWeight:'500', cursor:'pointer', width:'100%' },
};
export default ProductCard;
