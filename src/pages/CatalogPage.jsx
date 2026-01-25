import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

// Initial seed data (will be replaced by API data)
const SEED_PRODUCTS = [
  { id: 1, nameHe: 'טי שירט', nameFr: 'T-shirt', price: 7 },
  { id: 2, nameHe: 'מכופתרת', nameFr: 'Chemise', price: 15 },
  { id: 3, nameHe: 'מכנס', nameFr: 'Pantalon', price: 11 },
  { id: 4, nameHe: 'שמלה קצרה', nameFr: 'Robe courte', price: 15 },
  { id: 5, nameHe: 'שמלה ארוכה', nameFr: 'Robe longue', price: 20 },
  { id: 6, nameHe: 'חצאית קצרה', nameFr: 'Jupe courte', price: 10 },
  { id: 7, nameHe: 'חצאית ארוכה', nameFr: 'Jupe longue', price: 13 }
];

function CatalogPage() {
  const { t } = useLanguage();
  const { itemCount, grandTotal, deliveryRules, itemsTotal, amountForFreeDelivery } = useCart();
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // Load products from API (fallback to seed data)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.log('Using seed data');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const progressPercent = Math.min(100, (itemsTotal / deliveryRules.freeThreshold) * 100);

  return (
    <div className="catalog-page">
      {/* Hero Section */}
      <div className="catalog-hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('catalogTitle')}</h1>
          <p className="hero-subtitle">{t('appTagline')}</p>
        </div>
        <div className="hero-decoration">
          <span className="decoration-icon">👔</span>
          <span className="decoration-icon">👕</span>
          <span className="decoration-icon">👗</span>
        </div>
      </div>

      {/* Free Delivery Progress */}
      {itemCount > 0 && amountForFreeDelivery > 0 && (
        <div className="free-delivery-progress">
          <div className="progress-text">
            <span>{t('minimumForFreeDelivery', { amount: amountForFreeDelivery })}</span>
            <span className="progress-goal">₪{deliveryRules.freeThreshold}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="product-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <div className="floating-cart">
          <Link to="/cart" className="floating-cart-btn">
            <div className="floating-cart-info">
              <span className="floating-cart-count">{itemCount} {t('cart')}</span>
              <span className="floating-cart-total">₪{grandTotal}</span>
            </div>
            <span className="floating-cart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
