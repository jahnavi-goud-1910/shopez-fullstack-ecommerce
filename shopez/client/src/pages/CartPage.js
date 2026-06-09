import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, increaseQty, decreaseQty } from '../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);

  const subtotal  = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping  = subtotal > 999 ? 0 : 99;
  const total     = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div style={S.empty}>
      <p style={{ fontSize:'4rem' }}>🛒</p>
      <h2>Your cart is empty</h2>
      <button onClick={() => navigate('/')} style={S.shopBtn}>Continue Shopping</button>
    </div>
  );

  return (
    <div style={S.container}>
      <h1 style={S.title}>Shopping Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</h1>
      <div style={S.layout}>
        {/* Cart Items */}
        <div style={S.items}>
          {cartItems.map(item => (
            <div key={item._id} style={S.card}>
              <img src={item.image} alt={item.name} style={S.image} />
              <div style={S.info}>
                <p style={S.itemName}>{item.name}</p>
                <p style={S.itemCat}>{item.category}</p>
                <p style={S.itemPrice}>₹{item.price.toLocaleString()}</p>
              </div>
              <div style={S.qtyBox}>
                <button onClick={() => dispatch(decreaseQty(item._id))} style={S.qBtn}>−</button>
                <span style={S.qty}>{item.qty}</span>
                <button onClick={() => dispatch(increaseQty(item._id))} style={S.qBtn}>+</button>
              </div>
              <p style={S.lineTotal}>₹{(item.price * item.qty).toLocaleString()}</p>
              <button onClick={() => dispatch(removeFromCart(item._id))} style={S.removeBtn}>🗑</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={S.summary}>
          <h2 style={S.sumTitle}>Order Summary</h2>
          <div style={S.sumRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div style={S.sumRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          {shipping > 0 && <p style={S.freeMsg}>Add ₹{(999 - subtotal + 1).toLocaleString()} more for free shipping!</p>}
          <div style={S.divider} />
          <div style={{ ...S.sumRow, fontWeight:'bold', fontSize:'1.1rem' }}>
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} style={S.checkoutBtn}>Proceed to Checkout</button>
          <button onClick={() => navigate('/')} style={S.continueBtn}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

const S = {
  container:   { maxWidth:'1100px', margin:'0 auto', padding:'2rem' },
  title:       { color:'#1a1a2e', marginBottom:'1.5rem' },
  layout:      { display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' },
  items:       { display:'flex', flexDirection:'column', gap:'1rem' },
  card:        { display:'flex', alignItems:'center', gap:'1rem', backgroundColor:'white', padding:'1rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  image:       { width:'80px', height:'80px', objectFit:'cover', borderRadius:'8px', flexShrink:0 },
  info:        { flex:1 },
  itemName:    { fontWeight:'600', margin:'0 0 0.2rem', color:'#1a1a2e' },
  itemCat:     { color:'#888', fontSize:'0.8rem', margin:'0 0 0.2rem' },
  itemPrice:   { color:'#e94560', fontWeight:'bold', margin:0 },
  qtyBox:      { display:'flex', alignItems:'center', gap:'0.5rem', backgroundColor:'#f0f0f0', borderRadius:'6px', padding:'0.25rem 0.5rem' },
  qBtn:        { background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', padding:'0 0.25rem', color:'#1a1a2e', fontWeight:'bold' },
  qty:         { fontWeight:'bold', minWidth:'20px', textAlign:'center' },
  lineTotal:   { fontWeight:'bold', minWidth:'80px', textAlign:'right', color:'#1a1a2e' },
  removeBtn:   { background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#e94560' },
  summary:     { backgroundColor:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', position:'sticky', top:'1rem' },
  sumTitle:    { margin:'0 0 1rem', color:'#1a1a2e' },
  sumRow:      { display:'flex', justifyContent:'space-between', marginBottom:'0.75rem', color:'#555' },
  freeMsg:     { fontSize:'0.8rem', color:'#e94560', margin:'-0.5rem 0 0.75rem', textAlign:'center' },
  divider:     { borderTop:'1px solid #eee', margin:'0.75rem 0' },
  checkoutBtn: { width:'100%', padding:'0.875rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer', fontWeight:'600', marginBottom:'0.75rem' },
  continueBtn: { width:'100%', padding:'0.75rem', backgroundColor:'white', color:'#1a1a2e', border:'1px solid #ddd', borderRadius:'8px', fontSize:'0.9rem', cursor:'pointer' },
  empty:       { textAlign:'center', padding:'5rem 2rem' },
  shopBtn:     { padding:'0.875rem 2rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer', marginTop:'1rem' },
};
export default CartPage;
