import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders } from '../redux/slices/orderSlice';

const STATUS_COLORS = {
  Pending:    { bg:'#fff3cd', color:'#856404' },
  Processing: { bg:'#cce5ff', color:'#004085' },
  Shipped:    { bg:'#d4edda', color:'#155724' },
  Delivered:  { bg:'#d1ecf1', color:'#0c5460' },
  Cancelled:  { bg:'#f8d7da', color:'#721c24' },
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { orders, loading } = useSelector(s => s.orders);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchMyOrders());
  }, [user]);

  if (loading) return <p style={S.center}>Loading orders...</p>;

  return (
    <div style={S.container}>
      <h1 style={S.title}>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div style={S.empty}>
          <p style={{ fontSize:'3rem' }}>📭</p>
          <h3>No orders yet</h3>
          <button onClick={() => navigate('/')} style={S.shopBtn}>Start Shopping</button>
        </div>
      ) : (
        <div style={S.list}>
          {orders.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
            return (
              <div key={order._id} style={S.card}>
                <div style={S.cardHeader}>
                  <div>
                    <p style={S.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={S.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                  <span style={{ ...S.badge, backgroundColor:sc.bg, color:sc.color }}>{order.status}</span>
                </div>

                <div style={S.itemsList}>
                  {order.orderItems.map((item, i) => (
                    <div key={i} style={S.item}>
                      <img src={item.image} alt={item.name} style={S.itemImg} />
                      <span style={S.itemName}>{item.name} × {item.qty}</span>
                      <span style={S.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={S.cardFooter}>
                  <div style={S.addr}>
                    📍 {order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.pincode}
                  </div>
                  <div style={S.total}>
                    Total: <strong>₹{order.totalPrice.toLocaleString()}</strong>
                    <span style={{ ...S.paid, color: order.isPaid ? 'green' : '#e94560' }}>
                      {order.isPaid ? ' ✅ Paid' : ' ⏳ Pending Payment'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const S = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'2rem' },
  title:     { color:'#1a1a2e', marginBottom:'1.5rem' },
  list:      { display:'flex', flexDirection:'column', gap:'1.25rem' },
  card:      { backgroundColor:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  cardHeader:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' },
  orderId:   { fontWeight:'bold', color:'#1a1a2e', margin:0, fontFamily:'monospace' },
  date:      { color:'#888', fontSize:'0.85rem', margin:'0.2rem 0 0' },
  badge:     { padding:'0.3rem 0.875rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'600' },
  itemsList: { display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' },
  item:      { display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem', backgroundColor:'#f8f9fa', borderRadius:'6px' },
  itemImg:   { width:'45px', height:'45px', objectFit:'cover', borderRadius:'6px' },
  itemName:  { flex:1, fontSize:'0.875rem', color:'#333' },
  itemPrice: { fontWeight:'600', color:'#1a1a2e', fontSize:'0.875rem' },
  cardFooter:{ borderTop:'1px solid #eee', paddingTop:'0.875rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' },
  addr:      { fontSize:'0.8rem', color:'#888' },
  total:     { fontSize:'0.9rem', color:'#555' },
  paid:      { fontSize:'0.85rem', marginLeft:'0.5rem' },
  center:    { textAlign:'center', marginTop:'3rem' },
  empty:     { textAlign:'center', padding:'4rem 2rem' },
  shopBtn:   { padding:'0.875rem 2rem', backgroundColor:'#e94560', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', marginTop:'1rem' },
};
export default OrdersPage;
