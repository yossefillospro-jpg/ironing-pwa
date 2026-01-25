import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AdminPage.css';

// Order status configuration
const ORDER_STATUSES = [
  { id: 'received', he: 'התקבלה', fr: 'Reçue' },
  { id: 'collected', he: 'נאספה', fr: 'Collectée' },
  { id: 'ironing', he: 'בגיהוץ', fr: 'En cours' },
  { id: 'ready', he: 'מוכנה', fr: 'Prête' },
  { id: 'delivering', he: 'בהחזרה', fr: 'En livraison' },
  { id: 'completed', he: 'הושלמה', fr: 'Terminée' }
];

function AdminPage() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Mark order as paid
  const markAsPaid = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/paid`, {
        method: 'PUT'
      });
      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      language === 'he' ? 'he-IL' : 'fr-FR',
      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    );
  };

  // Get status label
  const getStatusLabel = (statusId) => {
    const status = ORDER_STATUSES.find(s => s.id === statusId);
    return status ? status[language] : statusId;
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">{t('adminTitle')}</h1>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t('allOrders')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {t('settings')}
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            {loading ? (
              <div className="admin-loading">
                <div className="spinner"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">
                <p>{t('noOrders')}</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {orders.map(order => (
                  <div 
                    key={order.id} 
                    className={`admin-order-card ${selectedOrder?.id === order.id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="order-card-header"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      <div className="order-main-info">
                        <span className="order-id">#{order.id.slice(-8)}</span>
                        <span className="order-customer">{order.customer?.name}</span>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status-info">
                        <span className={`status-pill status-${order.status}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className={`payment-pill ${order.paymentStatus}`}>
                          {order.paymentStatus === 'paid' ? '✓' : '₪'} {order.totals?.grand}
                        </span>
                      </div>
                    </div>

                    {selectedOrder?.id === order.id && (
                      <div className="order-card-details">
                        {/* Customer Info */}
                        <div className="detail-section">
                          <h4>{t('customerInfo')}</h4>
                          <p><strong>{t('phone')}:</strong> {order.customer?.phone}</p>
                          <p><strong>{t('address')}:</strong> {order.customer?.address}</p>
                          {order.customer?.floor && <p><strong>{t('floor')}:</strong> {order.customer?.floor}</p>}
                          {order.customer?.notes && <p><strong>{t('notes')}:</strong> {order.customer?.notes}</p>}
                        </div>

                        {/* Items */}
                        <div className="detail-section">
                          <h4>{t('orderDetails')}</h4>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="detail-item">
                              <span>{language === 'he' ? item.nameHe : item.nameFr} × {item.quantity}</span>
                              <span>₪{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="detail-item total">
                            <span>{t('grandTotal')}</span>
                            <span>₪{order.totals?.grand}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="order-actions">
                          <div className="action-group">
                            <label>{t('updateStatus')}</label>
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="status-select"
                            >
                              {ORDER_STATUSES.map(status => (
                                <option key={status.id} value={status.id}>
                                  {status[language]}
                                </option>
                              ))}
                            </select>
                          </div>
                          {order.paymentStatus !== 'paid' && (
                            <button 
                              className="btn btn-accent"
                              onClick={() => markAsPaid(order.id)}
                            >
                              {t('markAsPaid')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>{t('editPrices')}</h3>
              <p className="settings-desc">
                {language === 'he' 
                  ? 'ניהול מחירי הפריטים יתווסף בגרסה הבאה'
                  : 'La gestion des prix sera ajoutée dans la prochaine version'
                }
              </p>
            </div>
            <div className="settings-card">
              <h3>{t('editTimeSlots')}</h3>
              <p className="settings-desc">
                {language === 'he' 
                  ? 'ניהול חלונות הזמן יתווסף בגרסה הבאה'
                  : 'La gestion des créneaux sera ajoutée dans la prochaine version'
                }
              </p>
            </div>
            <div className="settings-card">
              <h3>{t('editDeliveryRules')}</h3>
              <p className="settings-desc">
                {language === 'he' 
                  ? 'ניהול כללי המשלוח יתווסף בגרסה הבאה'
                  : 'La gestion des règles de livraison sera ajoutée dans la prochaine version'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
