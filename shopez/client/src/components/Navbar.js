import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useSelector(s => s.auth);
  const { cartItems } = useSelector(s => s.cart);
  const totalQty   = cartItems.reduce((a, i) => a + i.qty, 0);
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.brand}>🛒 ShopEZ</Link>

      <div style={S.links}>
        <Link to="/products" style={{ ...S.link, ...(isActive('/products') ? S.activeLink : {}) }}>Products</Link>
        {user && <Link to="/profile"  style={{ ...S.link, ...(isActive('/profile')  ? S.activeLink : {}) }}>Profile</Link>}
        {user && <Link to="/orders"   style={{ ...S.link, ...(isActive('/orders')   ? S.activeLink : {}) }}>Orders</Link>}
        {user?.isAdmin && (
          <div style={S.dropdown} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <span style={{ ...S.link, cursor: 'pointer' }}>⚙️ Admin ▾</span>
            {open && (
              <div style={S.dropMenu}>
                <Link to="/admin"             style={S.dropItem} onClick={() => setOpen(false)}>📊 Dashboard</Link>
                <Link to="/admin/products"    style={S.dropItem} onClick={() => setOpen(false)}>📦 All Products</Link>
                <Link to="/admin/new-product" style={S.dropItem} onClick={() => setOpen(false)}>➕ Add Product</Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={S.right}>
        <Link to="/cart" style={S.cartBtn}>
          🛒
          {totalQty > 0 && <span style={S.badge}>{totalQty}</span>}
        </Link>
        {user ? (
          <div style={S.userMenu}>
            <span style={S.userName}>{user.name.split(' ')[0]}</span>
            <button onClick={() => { dispatch(logout()); navigate('/login'); }} style={S.logoutBtn}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login"    style={S.loginBtn}>Login</Link>
            <Link to="/register" style={S.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const S = {
  nav:        { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 2rem', backgroundColor: '#1a1a2e', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  brand:      { color: '#e94560', fontSize: '1.3rem', fontWeight: '800', textDecoration: 'none', flexShrink: 0 },
  links:      { display: 'flex', gap: '0.25rem', flex: 1, marginLeft: '1.5rem' },
  link:       { color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.15s' },
  activeLink: { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
  dropdown:   { position: 'relative' },
  dropMenu:   { position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '0.4rem', minWidth: '180px', zIndex: 200 },
  dropItem:   { display: 'block', padding: '0.6rem 0.875rem', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500' },
  right:      { display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' },
  cartBtn:    { position: 'relative', color: 'white', fontSize: '1.1rem', textDecoration: 'none', padding: '0.3rem 0.5rem' },
  badge:      { position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#e94560', color: 'white', borderRadius: '50%', width: '17px', height: '17px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  userMenu:   { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  userName:   { color: '#a8dadc', fontSize: '0.875rem', fontWeight: '500' },
  logoutBtn:  { padding: '0.35rem 0.75rem', backgroundColor: 'rgba(233,69,96,0.15)', color: '#e94560', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  loginBtn:   { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.875rem', padding: '0.35rem 0.75rem' },
  registerBtn:{ backgroundColor: '#e94560', color: 'white', textDecoration: 'none', padding: '0.4rem 0.875rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600' },
};

export default Navbar;
