import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const { isRTL } = useLanguage();

  return (
    <div className="app-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
