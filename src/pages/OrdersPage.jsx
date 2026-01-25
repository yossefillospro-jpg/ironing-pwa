import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './OrdersPage.css';

// Order status configuration
const ORDER_STATUSES = {
  received: { he: 'התקבלה', fr: 'Reçue', color: 'info' },
  collected: { he: 'נאספה', fr: 'Collectée', color: 'info' },
  ironing: { he: 'בגיהוץ', fr: 'En cours', color: 'warning' },
  ready: { he: 'מוכנה', fr: 'Prête', color: 'success' },
  delivering: { he: 'בהחזרה', fr: 'En livraison', color: 'info' },
  completed: { he: 'הושלמה', fr: 'Terminée', color: 'success' }
};

const PAYMENT_STATUSES = {
  pending: { he: 'ממתין לתשלום', fr: 'En attente', color: 'warning' },
  paid: { he: 'שולם', fr: 'Payée', color: 'success' }
};

function OrdersPage() {
  const { t, language } = useLanguage();
  const { customer } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState(customer.phone || '');
  const [searched, setSearched] = useState(false);

  // Search orders by phone
  const searchOrders = async () => {
    if (!phoneInput.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(`/api/orders/phone/${encodeURIComponent(phoneInput)}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      language === 'he' ? 'he-IL' : 'fr-FR',
      { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  // Get status badge
  const getStatusBadge = (status, type = 'order') => {
    const config = type === 'order' ? ORDER_STATUSES[status] : PAYMENT_STATUSES[status];
    if (!config) return null;
    return (
      <span className={`status-badge status-${config.color}`}>
        {config[language]}
      </span>
    );
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <h1 className="orders-title">{t('orderHistory')}</h1>
      </div>

      {/* Phone Search */}
      <div className="phone-search">
        <div className="phone-search-form">
          <input
            type="tel"
            className="phone-input"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder={t('phone')}
            dir="ltr"
          />
          <button 
            className="btn btn-primary"
            onClick={searchOrders}
            disabled={!phoneInput.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {loading && searched ? (
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : !searched ? (
          <div className="orders-empty">
            <div className="empty-icon">🔍</div>
            <p>{language === 'he' ? 'הזן מספר טלפון לחיפוש הזמנות' : 'Entrez un numéro de téléphone pour rechercher vos commandes'}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>{t('noOrders')}</h3>
            <p>{t('noOrdersMessage')}</p>
            <Link to="/" className="btn btn-primary">
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="order-label">{t('orderNumber')}</span>
                  <span className="order-value">{order.id}</span>
                </div>
                <div className="order-statuses">
                  {getStatusBadge(order.status, 'order')}
                  {getStatusBadge(order.paymentStatus, 'payment')}
                </div>
              </div>

              <div className="order-date">
                {formatDate(order.createdAt)}
              </div>

              <div className="order-items">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="item-name">
                      {language === 'he' ? item.nameHe : item.nameFr} × {item.quantity}
                    </span>
                    <span className="item-price">₪{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-delivery">
                  {order.delivery?.method === 'dropOff' 
                    ? (language === 'he' ? 'הבאה עצמית' : 'Dépôt sur place')
                    : (language === 'he' ? 'איסוף והחזרה' : 'Collecte et retour')
                  }
                </div>
                <div className="order-total">
                  <span>{t('grandTotal')}</span>
                  <span className="total-value">₪{order.totals?.grand || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
