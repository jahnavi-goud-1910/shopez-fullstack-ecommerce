import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchMyOrders } from '../redux/slices/orderSlice';

const STATUS_COLORS = {
  Pending:    { bg: '#fff3cd', color: '#856404' },
  Processing: { bg: '#cce5ff', color: '#004085' },
  Shipped:    { bg: '#d4edda', color: '#155724' },
  Delivered:  { bg: '#d1ecf1', color: '#0c5460' },
  Cancelled:  { bg: '#f8d7da', color: '#721c24' },
};

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { orders, loading } = useSelector(s => s.orders);

  const [name,    setName]    = useState(user?.name || '');
  const [email,   setEmail]   = useState(user?.email || '');
  const [msg,     setMsg]     = useState('');
  const [err,     setErr]     = useState('');
  const [activeTab, setTab]   = useState('profile');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchMyOrders());
  }, [user]);

  const handleUpdate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/auth/profile', { name, email }, config);
      setMsg('Profile updated successfully!');
      setErr('');
    } catch (e) { setErr(e.response?.data?.message || 'Update failed'); }
  };

  const totalSpent = orders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);

  return (
    <div style={S.container}>
      {/* Profile Header */}
      <div style={S.profileHeader}>
        <div style={S.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <div>
          <h1 style={S.profileName}>{user?.name}</h1>
          <p style={S.profileEmail}>{user?.email}</p>
          {user?.isAdmin && <span style={S.adminBadge}>⚙️ Admin</span>}
        </div>
        <div style={S.profileStats}>
          <div style={S.pStat}><strong>{orders.length}</strong><span>Orders</span></div>
          <div style={S.pStatDiv}/>
          <div style={S.pStat}><strong>₹{totalSpent.toLocaleString()}</strong><span>Total Spent</span></div>
          <div style={S.pStatDiv}/>
          <div style={S.pStat}><strong>{orders.filter(o => o.status === 'Delivered').length}</strong><span>Delivered</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {[['profile', '👤 Profile Details'], ['orders', '📦 My Orders']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ ...S.tabBtn, borderBottom: activeTab === key ? '2px solid #e94560' : '2px solid transparent', color: activeTab === key ? '#e94560' : '#666' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={S.card}>
          <h2 style={S.cardTitle}>Edit Profile</h2>
          {msg && <p style={S.success}>{msg}</p>}
          {err && <p style={S.errMsg}>{err}</p>}
          <div style={S.field}>
            <label style={S.label}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={S.input} type="email" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Account Type</label>
            <input value={user?.isAdmin ? 'Administrator' : 'Customer'} style={{ ...S.input, backgroundColor: '#f8f9fa', color: '#888' }} disabled />
          </div>
          <button onClick={handleUpdate} style={S.saveBtn}>Save Changes</button>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={S.card}>
          <h2 style={S.cardTitle}>My Orders ({orders.length})</h2>
          {loading && <p style={{ color: '#888' }}>Loading orders...</p>}
          {orders.length === 0 && !loading && (
            <div style={S.empty}>
              <p style={{ fontSize: '2.5rem' }}>📭</p>
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/products')} style={S.shopBtn}>Start Shopping</button>
            </div>
          )}
          {orders.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
            return (
              <div key={order._id} style={S.orderCard}>
                <div style={S.orderTop}>
                  <div>
                    <span style={S.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={S.orderDate}> · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span style={{ ...S.badge, backgroundColor: sc.bg, color: sc.color }}>{order.status}</span>
                </div>
                <div style={S.orderItems}>
                  {order.orderItems.map((item, i) => (
                    <div key={i} style={S.orderItem}>
                      <img src={item.image} alt={item.name} style={S.orderImg} />
                      <span style={S.orderItemName}>{item.name} × {item.qty}</span>
                      <span style={S.orderItemPrice}>₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={S.orderFooter}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>📍 {order.shippingAddress?.city}</span>
                  <span style={S.orderTotal}>Total: <strong>₹{order.totalPrice.toLocaleString()}</strong>
                    <span style={{ color: order.isPaid ? 'green' : '#e94560', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                      {order.isPaid ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </span>
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
  container:    { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  profileHeader:{ backgroundColor: '#1a1a2e', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  avatar:       { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '700', color: 'white', flexShrink: 0 },
  profileName:  { color: 'white', margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: '700' },
  profileEmail: { color: '#a8dadc', margin: '0 0 0.4rem', fontSize: '0.9rem' },
  adminBadge:   { backgroundColor: 'rgba(233,69,96,0.2)', color: '#e94560', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  profileStats: { marginLeft: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'center' },
  pStat:        { display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', fontSize: '0.8rem', gap: '0.1rem' },
  pStatDiv:     { width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)' },
  tabs:         { display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem' },
  tabBtn:       { padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' },
  card:         { backgroundColor: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  cardTitle:    { margin: '0 0 1.25rem', color: '#1a1a2e', fontSize: '1.1rem', fontWeight: '700' },
  field:        { marginBottom: '1rem' },
  label:        { display: 'block', marginBottom: '0.35rem', fontWeight: '500', color: '#555', fontSize: '0.875rem' },
  input:        { width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  saveBtn:      { padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  success:      { color: 'green', backgroundColor: '#e8f5e9', padding: '0.6rem 0.875rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' },
  errMsg:       { color: 'red', backgroundColor: '#ffe0e0', padding: '0.6rem 0.875rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' },
  empty:        { textAlign: 'center', padding: '2rem', color: '#888' },
  shopBtn:      { padding: '0.7rem 1.5rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '0.75rem' },
  orderCard:    { border: '1px solid #eee', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' },
  orderTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  orderId:      { fontFamily: 'monospace', fontWeight: '700', color: '#1a1a2e', fontSize: '0.9rem' },
  orderDate:    { color: '#888', fontSize: '0.8rem' },
  badge:        { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  orderItems:   { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' },
  orderItem:    { display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8f9fa', padding: '0.4rem 0.6rem', borderRadius: '6px' },
  orderImg:     { width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' },
  orderItemName:{ flex: 1, fontSize: '0.8rem', color: '#333' },
  orderItemPrice:{ fontWeight: '600', fontSize: '0.8rem' },
  orderFooter:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#555' },
  orderTotal:   { fontWeight: '500' },
};

export default UserProfilePage;
