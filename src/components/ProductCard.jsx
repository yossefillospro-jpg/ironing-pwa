import '../components/ProductCard.css';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { t, language } = useLanguage();
  const { items, addItem, incrementItem, decrementItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Localized display name
  const displayName =
    language === 'he'
      ? `${product.nameHe} (${product.nameFr})`
      : `${product.nameFr} (${product.nameHe})`;

  // ✅ Use product.productId (not product.id)
  const cartItem = items.find((item) => item.productId === product.productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 300);
  };

  // ✅ Icons mapping (use your images for skirts)
  const getIcon = (nameHe) => {
    if (nameHe === 'חצאית קצרה') {
      return <img className="product-icon-img" src="/icons/skirt-short.webp" alt="Jupe courte" />;
    }

    if (nameHe === 'חצאית ארוכה') {
      return <img className="product-icon-img" src="/icons/skirt-long.webp" alt="Jupe longue" />;
    }

    const icons = {
      'טי שירט': '👕',
      'מכופתרת': '👔',
      'מכנס': '👖',
      'שמלה קצרה': '👗',
      'שמלה ארוכה': '👗',
    };

    return icons[nameHe] || '👕';
  };

  return (
    <div className={`product-card ${isAdding ? 'adding' : ''}`}>
      <div className="product-icon">
        {getIcon(product.nameHe)}
      </div>

      <div className="product-info">
        <h3 className="product-name">{displayName}</h3>
        <div className="product-price">
          <span className="price-symbol">₪</span>
          <span className="price-value">{product.price}</span>
        </div>
      </div>

      <div className="product-actions">
        {quantity === 0 ? (
          <button
            className="btn-add"
            onClick={handleAdd}
            aria-label={t('addToCart')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        ) : (
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() => decrementItem(product.productId)}
              aria-label="Decrease quantity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => incrementItem(product.productId)}
              aria-label="Increase quantity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

