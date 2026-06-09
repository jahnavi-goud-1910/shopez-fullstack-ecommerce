import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/orderSlice';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS  = {
  Pending:    { bg: '#fff3cd', color: '#856404' },
  Processing: { bg: '#cce5ff', color: '#004085' },
  Shipped:    { bg: '#d4edda', color: '#155724' },
  Delivered:  { bg: '#d1ecf1', color: '#0c5460' },
  Cancelled:  { bg: '#f8d7da', color: '#721c24' },
};

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user }      = useSelector(s => s.auth);
  const { products }  = useSelector(s => s.products);
  const { allOrders } = useSelector(s => s.orders);

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return; }
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [user]);

  const totalRevenue   = allOrders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);
  const pendingOrders  = allOrders.filter(o => o.status === 'Pending').length;
  const outOfStock     = products.filter(p => p.countInStock === 0).length;

  const stats = [
    { label: 'Total Products',  value: products.length,           icon: '📦', color: '#3b5bdb', bg: '#eef2ff' },
    { label: 'Total Orders',    value: allOrders.length,          icon: '🛍️',  color: '#0ca678', bg: '#e6fcf5' },
    { label: 'Revenue',         value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#e67700', bg: '#fff9db' },
    { label: 'Pending Orders',  value: pendingOrders,             icon: '⏳', color: '#e64980', bg: '#fff0f6' },
    { label: 'Out of Stock',    value: outOfStock,                icon: '⚠️', color: '#c92a2a', bg: '#fff5f5' },
  ];

  return (
    <div style={S.container}>
      <div style={S.topBar}>
        <div>
          <h1 style={S.title}>⚙️ Admin Dashboard</h1>
          <p style={S.sub}>Welcome back, {user?.name}</p>
        </div>
        <div style={S.quickActions}>
          <button onClick={() => navigate('/admin/products')} style={S.qaBtn}>📦 All Products</button>
          <button onClick={() => navigate('/admin/new-product')} style={S.qaBtnPrimary}>+ Add Product</button>
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {stats.map(s => (
          <div key={s.label} style={{ ...S.statCard, backgroundColor: s.bg }}>
            <div style={S.statIcon}>{s.icon}</div>
            <div>
              <p style={{ ...S.statVal, color: s.color }}>{s.value}</p>
              <p style={S.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <h2 style={S.sectionTitle}>🛍️ All Orders ({allOrders.length})</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                <th style={S.th}>Order ID</th>
                <th style={S.th}>Customer</th>
                <th style={S.th}>Items</th>
                <th style={S.th}>Total</th>
                <th style={S.th}>Paid</th>
                <th style={S.th}>Date</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map(order => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                return (
                  <tr key={order._id} style={S.tr}>
                    <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '600' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={S.td}>
                      <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{order.user?.name || 'N/A'}</div>
                      <div style={{ color: '#888', fontSize: '0.75rem' }}>{order.user?.email || ''}</div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        {order.orderItems.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} style={S.itemThumb} />
                        ))}
                        {order.orderItems.length > 3 && <span style={S.moreItems}>+{order.orderItems.length - 3}</span>}
                      </div>
                    </td>
                    <td style={{ ...S.td, fontWeight: '600' }}>₹{order.totalPrice.toLocaleString()}</td>
                    <td style={S.td}>
                      <span style={{ color: order.isPaid ? '#0ca678' : '#e64980', fontSize: '1rem' }}>
                        {order.isPaid ? '✅' : '⏳'}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: '#888', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={S.td}>
                      <select value={order.status}
                        onChange={e => dispatch(updateOrderStatus({ id: order._id, status: e.target.value }))}
                        style={{ ...S.statusSelect, backgroundColor: sc.bg, color: sc.color, borderColor: sc.bg }}>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {allOrders.length === 0 && <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No orders yet.</p>}
      </div>
    </div>
  );
};

const S = {
  container:     { maxWidth: '1300px', margin: '0 auto', padding: '2rem' },
  topBar:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' },
  title:         { color: '#1a1a2e', margin: '0 0 0.2rem', fontSize: '1.75rem', fontWeight: '700' },
  sub:           { color: '#888', margin: 0, fontSize: '0.9rem' },
  quickActions:  { display: 'flex', gap: '0.75rem' },
  qaBtn:         { padding: '0.65rem 1.25rem', backgroundColor: 'white', color: '#1a1a2e', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' },
  qaBtnPrimary:  { padding: '0.65rem 1.25rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  statsGrid:     { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard:      { borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  statIcon:      { fontSize: '1.75rem' },
  statVal:       { fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.1rem' },
  statLabel:     { color: '#666', fontSize: '0.8rem', margin: 0 },
  section:       { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  sectionTitle:  { margin: 0, color: '#1a1a2e', fontSize: '1.05rem', fontWeight: '700' },
  table:         { width: '100%', borderCollapse: 'collapse' },
  thead:         { backgroundColor: '#f8f9fa' },
  th:            { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#888', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' },
  tr:            { borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' },
  td:            { padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#333', verticalAlign: 'middle' },
  itemThumb:     { width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' },
  moreItems:     { width: '32px', height: '32px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666' },
  statusSelect:  { padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' },
};

export default AdminDashboardPage;
