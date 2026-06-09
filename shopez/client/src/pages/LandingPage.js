import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const features = [
  { icon: '🛒', title: 'Easy Shopping',    desc: 'Browse thousands of products across all categories with smart filters.' },
  { icon: '🔒', title: 'Secure Payments',  desc: 'Multiple payment options including UPI, Cards, and Net Banking.' },
  { icon: '📦', title: 'Fast Delivery',    desc: 'Free shipping on orders above ₹999. Track your orders in real time.' },
  { icon: '⭐', title: 'Genuine Reviews',  desc: 'Verified customer reviews to help you make the best choices.' },
];

const categories = [
  { name: 'Electronics', icon: '💻', bg: '#e3f2fd' },
  { name: 'Clothing',    icon: '👕', bg: '#fce4ec' },
  { name: 'Sports',      icon: '🏃', bg: '#e8f5e9' },
  { name: 'Kitchen',     icon: '🍳', bg: '#fff3e0' },
  { name: 'Books',       icon: '📚', bg: '#f3e5f5' },
  { name: 'Toys',        icon: '🧸', bg: '#e0f7fa' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  return (
    <div style={S.page}>

      {/* Hero */}
      <section style={S.hero}>
        <div style={S.heroContent}>
          <h1 style={S.heroTitle}>Shop Smart.<br />Shop <span style={S.accent}>ShopEZ</span></h1>
          <p style={S.heroSub}>Discover amazing products at unbeatable prices. Electronics, clothing, sports & more — all in one place.</p>
          <div style={S.heroBtns}>
            <button onClick={() => navigate('/products')} style={S.primaryBtn}>Shop Now →</button>
            {!user && <button onClick={() => navigate('/register')} style={S.secondaryBtn}>Create Account</button>}
          </div>
          <div style={S.heroStats}>
            <div style={S.stat}><strong>500+</strong><span>Products</span></div>
            <div style={S.statDiv}/>
            <div style={S.stat}><strong>10K+</strong><span>Customers</span></div>
            <div style={S.statDiv}/>
            <div style={S.stat}><strong>Free</strong><span>Shipping ₹999+</span></div>
          </div>
        </div>
        <div style={S.heroImg}>
          <div style={S.heroImgBox}>
            <span style={{ fontSize: '8rem' }}>🛍️</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={S.section}>
        <h2 style={S.secTitle}>Shop by Category</h2>
        <div style={S.catGrid}>
          {categories.map(c => (
            <div key={c.name} style={{ ...S.catCard, backgroundColor: c.bg }}
              onClick={() => navigate(`/products?category=${c.name}`)}>
              <span style={S.catIcon}>{c.icon}</span>
              <span style={S.catName}>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ ...S.section, backgroundColor: '#f8f9fa' }}>
        <div style={S.featureInner}>
          <h2 style={S.secTitle}>Why ShopEZ?</h2>
          <div style={S.featureGrid}>
            {features.map(f => (
              <div key={f.title} style={S.featureCard}>
                <span style={S.featureIcon}>{f.icon}</span>
                <h3 style={S.featureTitle}>{f.title}</h3>
                <p style={S.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <h2 style={S.ctaTitle}>Ready to start shopping?</h2>
        <p style={S.ctaSub}>Join thousands of happy customers today.</p>
        <button onClick={() => navigate('/products')} style={S.ctaBtn}>Browse Products</button>
      </section>

      {/* Footer */}
      <footer style={S.footer}>
        <p style={{ margin: 0, color: '#888' }}>© 2024 ShopEZ. Built with MERN Stack.</p>
      </footer>
    </div>
  );
};

const S = {
  page:        { backgroundColor: '#fff', minHeight: '100vh' },
  hero:        { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '5rem 4rem', display: 'flex', alignItems: 'center', gap: '4rem', minHeight: '90vh' },
  heroContent: { flex: 1, maxWidth: '600px' },
  heroTitle:   { fontSize: '3.5rem', color: 'white', lineHeight: 1.15, margin: '0 0 1.25rem', fontWeight: '800' },
  accent:      { color: '#e94560' },
  heroSub:     { fontSize: '1.15rem', color: '#a8dadc', lineHeight: 1.7, margin: '0 0 2rem' },
  heroBtns:    { display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' },
  primaryBtn:  { padding: '0.875rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn:{ padding: '0.875rem 2rem', backgroundColor: 'transparent', color: 'white', border: '1.5px solid white', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  heroStats:   { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  stat:        { display: 'flex', flexDirection: 'column', color: 'white', fontSize: '0.875rem', gap: '0.15rem' },
  statDiv:     { width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)' },
  heroImg:     { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  heroImgBox:  { width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(233,69,96,0.3)' },
  section:     { padding: '4rem 4rem' },
  featureInner:{ maxWidth: '1200px', margin: '0 auto' },
  secTitle:    { textAlign: 'center', fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '2.5rem', fontWeight: '700' },
  catGrid:     { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', maxWidth: '1200px', margin: '0 auto' },
  catCard:     { borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  catIcon:     { fontSize: '2rem' },
  catName:     { fontWeight: '600', color: '#1a1a2e', fontSize: '0.9rem' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' },
  featureCard: { backgroundColor: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', textAlign: 'center' },
  featureIcon: { fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' },
  featureTitle:{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 0.5rem' },
  featureDesc: { fontSize: '0.875rem', color: '#666', lineHeight: 1.6, margin: 0 },
  cta:         { background: '#e94560', padding: '4rem 2rem', textAlign: 'center' },
  ctaTitle:    { color: 'white', fontSize: '2rem', margin: '0 0 0.75rem', fontWeight: '700' },
  ctaSub:      { color: 'rgba(255,255,255,0.85)', margin: '0 0 1.5rem' },
  ctaBtn:      { padding: '0.875rem 2.5rem', backgroundColor: 'white', color: '#e94560', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  footer:      { backgroundColor: '#1a1a2e', padding: '1.5rem 2rem', textAlign: 'center' },
};

export default LandingPage;
