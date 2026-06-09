import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, resetOrderSuccess } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';

const PAYMENT_METHODS = [
  { value: 'UPI',        label: '📱 UPI (GPay, PhonePe, Paytm)', desc: 'Instant payment via UPI apps' },
  { value: 'Card',       label: '💳 Credit / Debit Card',        desc: 'Visa, Mastercard, RuPay' },
  { value: 'NetBanking', label: '🏦 Net Banking',                desc: 'All major banks supported' },
  { value: 'Wallet',     label: '👛 Wallets',                    desc: 'Paytm, Amazon Pay, Mobikwik' },
  { value: 'COD',        label: '💵 Cash on Delivery',           desc: 'Pay when you receive' },
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const { loading, error, success, createdOrder } = useSelector(s => s.orders);

  const [form, setForm] = useState({ address: '', city: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const subtotal      = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingPrice = subtotal > 999 ? 0 : 99;
  const totalPrice    = subtotal + shippingPrice;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (cartItems.length === 0) { navigate('/'); return; }
  }, [user, cartItems]);

  useEffect(() => {
    if (success && createdOrder) {
      dispatch(clearCart());
      dispatch(resetOrderSuccess());
      navigate('/orders');
    }
  }, [success, createdOrder]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const allFilled = Object.values(form).every(v => v.trim() !== '');

  const handlePayment = () => {
    if (!allFilled) { alert('Please fill all shipping details'); return; }
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        const orderData = {
          orderItems: cartItems.map(i => ({ name: i.name, qty: i.qty, image: i.image, price: i.price, product: i._id })),
          shippingAddress: form,
          paymentMethod,
          itemsPrice: subtotal,
          shippingPrice,
          totalPrice,
        };
        dispatch(createOrder(orderData));
      }, 1000);
    }, 2000);
  };

  if (paying) return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.spinner} />
        <h3 style={{ margin: '1rem 0 0.5rem', color: '#1a1a2e' }}>Processing Payment...</h3>
        <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Please wait</p>
      </div>
    </div>
  );

  if (paySuccess) return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={{ fontSize: '3.5rem' }}>✅</div>
        <h3 style={{ margin: '0.75rem 0 0.5rem', color: '#1a1a2e' }}>Payment Successful!</h3>
        <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Placing your order...</p>
      </div>
    </div>
  );

  return (
    <div style={S.container}>
      <h1 style={S.title}>Checkout</h1>
      <div style={S.layout}>
        <div>
          <div style={S.section}>
            <h2 style={S.secTitle}>📦 Shipping Details</h2>
            {[
              { name: 'address', label: 'Address', ph: 'House No., Street, Area' },
              { name: 'city',    label: 'City',    ph: 'Chennai, Mumbai...' },
              { name: 'pincode', label: 'Pincode', ph: '600001' },
              { name: 'phone',   label: 'Phone',   ph: '9876543210' },
            ].map(f => (
              <div key={f.name} style={S.field}>
                <label style={S.label}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} style={S.input} />
              </div>
            ))}
          </div>

          <div style={S.section}>
            <h2 style={S.secTitle}>💳 Select Payment Method</h2>
            <div style={S.payOptions}>
              {PAYMENT_METHODS.map(pm => (
                <label key={pm.value}
                  style={{ ...S.payCard, borderColor: paymentMethod === pm.value ? '#e94560' : '#eee', backgroundColor: paymentMethod === pm.value ? '#fff5f7' : 'white' }}>
                  <input type="radio" name="payment" value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                    style={{ display: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.2rem', fontWeight: '600', fontSize: '0.95rem' }}>{pm.label}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{pm.desc}</p>
                    </div>
                    <div style={{ ...S.radioCircle, borderColor: paymentMethod === pm.value ? '#e94560' : '#ddd', backgroundColor: paymentMethod === pm.value ? '#e94560' : 'white' }}>
                      {paymentMethod === pm.value && <div style={S.radioDot} />}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <p style={S.demoNote}>Demo mode — no real payment charged</p>
          </div>
        </div>

        <div style={S.summary}>
          <h2 style={S.secTitle}>Order Summary</h2>
          {cartItems.map(i => (
            <div key={i._id} style={S.sumItem}>
              <img src={i.image} alt={i.name} style={S.sumImg} />
              <span style={{ flex: 1, fontSize: '0.875rem', color: '#555' }}>{i.name} x{i.qty}</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Rs.{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={S.divider} />
          <div style={S.sumRow}><span>Subtotal</span><span>Rs.{subtotal.toLocaleString()}</span></div>
          <div style={S.sumRow}><span>Shipping</span><span style={{ color: shippingPrice === 0 ? 'green' : '#333' }}>{shippingPrice === 0 ? 'FREE' : 'Rs.' + shippingPrice}</span></div>
          <div style={S.divider} />
          <div style={{ ...S.sumRow, fontWeight: '700', fontSize: '1.1rem', color: '#1a1a2e' }}>
            <span>Total</span><span>Rs.{totalPrice.toLocaleString()}</span>
          </div>
          <div style={S.selectedPay}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Paying via</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}</span>
          </div>
          {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
          <button onClick={handlePayment} disabled={loading} style={{ ...S.payBtn, opacity: !allFilled ? 0.65 : 1 }}>
            {loading ? 'Placing Order...' : 'Pay Rs.' + totalPrice.toLocaleString()}
          </button>
          {!allFilled && <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: '0.4rem' }}>Fill shipping details to continue</p>}
        </div>
      </div>
    </div>
  );
};

const S = {
  container:   { maxWidth: '1050px', margin: '0 auto', padding: '2rem' },
  title:       { color: '#1a1a2e', marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: '700' },
  layout:      { display: 'grid', gridTemplateColumns: '1fr 330px', gap: '1.5rem', alignItems: 'start' },
  section:     { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  secTitle:    { margin: '0 0 1rem', color: '#1a1a2e', fontSize: '1.05rem', fontWeight: '700' },
  field:       { marginBottom: '0.875rem' },
  label:       { display: 'block', marginBottom: '0.3rem', fontWeight: '500', color: '#555', fontSize: '0.875rem' },
  input:       { width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  payOptions:  { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  payCard:     { border: '1.5px solid #eee', borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', transition: 'all 0.15s' },
  radioCircle: { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioDot:    { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' },
  demoNote:    { fontSize: '0.75rem', color: '#bbb', marginTop: '0.75rem', textAlign: 'center' },
  summary:     { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: '1rem' },
  sumItem:     { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' },
  sumImg:      { width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' },
  divider:     { borderTop: '1px solid #f0f0f0', margin: '0.75rem 0' },
  sumRow:      { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '0.4rem' },
  selectedPay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#f8f9fa', borderRadius: '6px' },
  payBtn:      { width: '100%', marginTop: '1rem', padding: '0.9rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  overlay:     { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal:       { backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem 3rem', textAlign: 'center', minWidth: '280px' },
  spinner:     { width: '48px', height: '48px', border: '4px solid #f0f0f0', borderTop: '4px solid #e94560', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' },
};

export default CheckoutPage;
