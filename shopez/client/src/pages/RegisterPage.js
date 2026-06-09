import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = () => {
    if (password !== confirm) { setLocalError('Passwords do not match'); return; }
    setLocalError('');
    dispatch(registerUser({ name, email, password }));
  };

  const fields = [
    { label:'Name',             value:name,     setter:setName,     type:'text',     ph:'Your name' },
    { label:'Email',            value:email,    setter:setEmail,    type:'email',    ph:'you@example.com' },
    { label:'Password',         value:password, setter:setPassword, type:'password', ph:'••••••••' },
    { label:'Confirm Password', value:confirm,  setter:setConfirm,  type:'password', ph:'••••••••' },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {(error || localError) && <p style={styles.error}>{localError || error}</p>}
        {fields.map(({ label, value, setter, type, ph }) => (
          <div style={styles.field} key={label}>
            <label style={styles.label}>{label}</label>
            <input type={type} value={value} placeholder={ph}
                   onChange={(e) => setter(e.target.value)} style={styles.input} />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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

export default RegisterPage;
