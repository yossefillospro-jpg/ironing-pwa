import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './DeliveryOptions.css';

function DeliveryOptions() {
  const { t } = useLanguage();
  const { 
    deliveryMethod, 
    setDeliveryMethod,
    customer,
    updateCustomer,
    deliveryRules,
    itemsTotal,
    providerFullAddress
  } = useCart();

  const deliveryOptions = [
    {
      id: 'pickupDelivery',
      label: t('pickupDelivery'),
      description: t('pickupDeliveryDesc'),
      price: deliveryRules.pickupDelivery,
      icon: '🚚'
    },
    {
      id: 'pickupOnly',
      label: t('pickupOnly'),
      description: t('pickupOnlyDesc'),
      price: deliveryRules.pickupOnly,
      icon: '📦'
    },
    {
      id: 'deliveryOnly',
      label: t('deliveryOnly'),
      description: t('deliveryOnlyDesc'),
      price: deliveryRules.deliveryOnly,
      icon: '🏠'
    },
    {
      id: 'dropOff',
      label: t('dropOff'),
      description: t('dropOffDesc'),
      price: 0,
      icon: '📍'
    }
  ];

  const isFreeForThreshold = itemsTotal >= deliveryRules.freeThreshold;

// Adresse du prestataire (même immeuble)
const SAME_BUILDING_ADDRESS = 'התקווה 11, רמת גן';

const handleSameBuildingChange = (e) => {
  const isChecked = e.target.checked;

  if (isChecked) {
    updateCustomer({ 
      isSameBuilding: true,
      address: SAME_BUILDING_ADDRESS
    });
  } else {
    updateCustomer({ 
      isSameBuilding: false
    });
  }
};

  

  return (
    <div className="delivery-options">
      <h3 className="delivery-title">{t('deliveryMethod')}</h3>

      {/* Same Building Checkbox */}
      {deliveryMethod !== 'dropOff' && (
        <label className="same-building-option">
          <input
            type="checkbox"
            checked={customer.isSameBuilding}
            onChange={handleSameBuildingChange}
          />
          <div className="same-building-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="same-building-content">
            <span className="same-building-label">{t('sameBuildingQuestion')}</span>
            {customer.isSameBuilding && (
              <span className="same-building-message">{t('sameBuildingMessage')}</span>
            )}
          </div>
        </label>
      )}

      <div className="delivery-options-list">
        {deliveryOptions.map(option => {
          const isSelected = deliveryMethod === option.id;
          const isFree = option.id === 'dropOff' || customer.isSameBuilding || isFreeForThreshold;
          
          return (
            <label 
              key={option.id}
              className={`delivery-option ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.id}
                checked={isSelected}
                onChange={() => setDeliveryMethod(option.id)}
              />
              <div className="delivery-option-radio">
                <div className="radio-inner"></div>
              </div>
              <div className="delivery-option-icon">{option.icon}</div>
              <div className="delivery-option-content">
                <span className="delivery-option-label">{option.label}</span>
                <span className="delivery-option-desc">{option.description}</span>
              </div>
              <div className="delivery-option-price">
                {option.id === 'dropOff' ? (
                  <span className="price-free">{t('free')}</span>
                ) : isFree ? (
                  <>
                    <span className="price-crossed">₪{option.price}</span>
                    <span className="price-free">{t('free')}</span>
                  </>
                ) : (
                  <span className="price-value">₪{option.price}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Show provider address for drop-off */}
      {deliveryMethod === 'dropOff' && (
        <div className="provider-address">
          <h4 className="provider-address-title">
            <span className="provider-icon">📍</span>
            {t('providerAddress')}
          </h4>
          <p className="provider-address-text">{providerFullAddress}</p>
          <div className="provider-address-actions">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(providerFullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Google Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(providerFullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a7.1 7.1 0 0 0-7.1 7.1c0 2.1.9 3.9 2.4 5.2l4.7 4.7 4.7-4.7c1.5-1.3 2.4-3.1 2.4-5.2A7.1 7.1 0 0 0 12 2zm0 9.6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              Waze
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryOptions;
