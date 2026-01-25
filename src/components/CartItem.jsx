import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './CartItem.css';

function CartItem({ item }) {
  const { language } = useLanguage();
  const { incrementItem, decrementItem, removeItem } = useCart();

  // Get localized name
  const displayName = language === 'he' 
    ? `${item.nameHe} (${item.nameFr})`
    : `${item.nameFr} (${item.nameHe})`;

  const subtotal = item.price * item.quantity;

  // Article icons mapping
  const getIcon = (nameHe) => {
    const icons = {
      'טי שירט': '👕',
      'מכופתרת': '👔',
      'מכנס': '👖',
      'שמלה קצרה': '👗',
      'שמלה ארוכה': '👗',
      'חצאית קצרה': '🩱',
      'חצאית ארוכה': '🩱'
    };
    return icons[nameHe] || '👕';
  };

  return (
    <div className="cart-item">
      <div className="cart-item-icon">
        {getIcon(item.nameHe)}
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{displayName}</h4>
        <div className="cart-item-price">
          ₪{item.price} × {item.quantity}
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="cart-qty-control">
          <button 
            className="cart-qty-btn"
            onClick={() => decrementItem(item.productId)}
            aria-label="Decrease"
          >
            −
          </button>
          <span className="cart-qty-value">{item.quantity}</span>
          <button 
            className="cart-qty-btn"
            onClick={() => incrementItem(item.productId)}
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <div className="cart-item-subtotal">
          ₪{subtotal}
        </div>
      </div>

      <button 
        className="cart-item-remove"
        onClick={() => removeItem(item.productId)}
        aria-label="Remove item"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
}

export default CartItem;
