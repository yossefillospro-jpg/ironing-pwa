import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { t, language, setLanguage, languages } = useLanguage();
  const { itemCount } = useCart();
  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-top">
       <Link to="/" className="header-brand">
  <img
    src="/logo-iron-jojo.png"
    alt="Iron JoJo"
    className="brand-logo"
  />

  <div className="brand-text">
    <span className="brand-name">{t('appName')}</span>
  </div>
</Link>


        <div className="header-actions">
          {/* Overlay pour bloquer les clics derrière + fermer au clic */}
          {showLangMenu && (
            <button
              type="button"
              className="lang-overlay"
              onClick={() => setShowLangMenu(false)}
              aria-label="Close language menu"
            />
          )}

          {/* Language Selector */}
          <div className="lang-selector">
            <button
              type="button"
              className="lang-btn"
              onClick={() => setShowLangMenu((v) => !v)}
              aria-label={t('language')}
              aria-expanded={showLangMenu}
              aria-haspopup="menu"
            >
              <span className="lang-flag">{language === 'he' ? '🇮🇱' : '🇫🇷'}</span>
              <span className="lang-code">{language.toUpperCase()}</span>
              <svg
                className="lang-chevron"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showLangMenu && (
              <div className="lang-menu" role="menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    role="menuitem"
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                  >
                    <span className="lang-flag">{lang.code === 'he' ? '🇮🇱' : '🇫🇷'}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link to="/cart" className="cart-btn" aria-label={t('cart')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>{t('catalog')}</span>
        </Link>

        <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>{t('cart')}</span>
          {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
        </Link>

        <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>{t('orders')}</span>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
