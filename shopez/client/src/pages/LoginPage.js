import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = () => dispatch(loginUser({ email, password }));

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to ShopEZ</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 style={styles.input} placeholder="you@example.com" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 style={styles.input} placeholder="••••••••"
                 onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#f5f5f5' },
  card:    { backgroundColor:'white', padding:'2.5rem', borderRadius:'12px',
             boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' },
  title:   { textAlign:'center', marginBottom:'1.5rem', color:'#1a1a2e' },
  field:   { marginBottom:'1rem' },
  label:   { display:'block', marginBottom:'0.4rem', fontWeight:'500', color:'#555' },
  input:   { width:'100%', padding:'0.7rem', border:'1px solid #ddd', borderRadius:'6px',
             fontSize:'1rem', boxSizing:'border-box' },
  btn:     { width:'100%', padding:'0.8rem', backgroundColor:'#e94560', color:'white',
             border:'none', borderRadius:'6px', fontSize:'1rem', cursor:'pointer', marginTop:'0.5rem' },
  error:   { backgroundColor:'#ffe0e0', color:'#c00', padding:'0.7rem', borderRadius:'6px',
             marginBottom:'1rem', fontSize:'0.9rem' },
  footer:  { textAlign:'center', marginTop:'1rem', color:'#666' },
  link:    { color:'#e94560', textDecoration:'none', fontWeight:'600' },
};

export default LoginPage;
