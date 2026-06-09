import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Navbar               from './components/Navbar';
import LandingPage          from './pages/LandingPage';
import ProductsPage         from './pages/ProductsPage';
import ProductPage          from './pages/ProductPage';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';
import CartPage             from './pages/CartPage';
import CheckoutPage         from './pages/CheckoutPage';
import OrdersPage           from './pages/OrdersPage';
import UserProfilePage      from './pages/UserProfilePage';
import AdminDashboardPage   from './pages/AdminDashboardPage';
import AdminAllProductsPage from './pages/AdminAllProductsPage';
import AdminNewProductPage  from './pages/AdminNewProductPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"                       element={<LandingPage />} />
          <Route path="/products"               element={<ProductsPage />} />
          <Route path="/product/:id"            element={<ProductPage />} />
          <Route path="/login"                  element={<LoginPage />} />
          <Route path="/register"               element={<RegisterPage />} />
          <Route path="/cart"                   element={<CartPage />} />
          <Route path="/checkout"               element={<CheckoutPage />} />
          <Route path="/orders"                 element={<OrdersPage />} />
          <Route path="/profile"                element={<UserProfilePage />} />
          <Route path="/admin"                  element={<AdminDashboardPage />} />
          <Route path="/admin/products"         element={<AdminAllProductsPage />} />
          <Route path="/admin/new-product"      element={<AdminNewProductPage />} />
          <Route path="/admin/edit-product/:id" element={<AdminNewProductPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
