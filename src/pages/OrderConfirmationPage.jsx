import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './OrderConfirmationPage.css';

function OrderConfirmationPage() {
  const { t } = useLanguage();
  const { orderId } = useParams();

  return (
    <div className="confirmation-page">
      <div className="confirmation-content">
        <div className="confirmation-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 className="confirmation-title">{t('orderPlaced')}</h1>
        
        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">{t('orderNumber')}</span>
            <span className="detail-value">{orderId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('paymentMethod')}</span>
            <span className="detail-value">{t('paymentOnDelivery')}</span>
          </div>
        </div>

        <div className="confirmation-message">
          <p>
            {t('language') === 'he' 
              ? 'תודה על ההזמנה! ניצור איתך קשר בקרוב לאישור.'
              : 'Merci pour votre commande ! Nous vous contacterons bientôt pour confirmation.'
            }
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary btn-lg btn-block">
            {t('orderHistory')}
          </Link>
          <Link to="/" className="btn btn-secondary btn-block">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
