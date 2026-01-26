import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './CustomerForm.css';

function CustomerForm({ errors = {} }) {
  const { t } = useLanguage();
  const { customer, updateCustomer, deliveryMethod, paymentMethod, setPaymentMethod } = useCart();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCustomer({ [name]: value });
  };

  // Don't need address for drop-off
  const needsAddress = deliveryMethod !== 'dropOff';

  return (
    <div className="customer-form">
      <h3 className="form-title">{t('customerInfo')}</h3>

      <div className="form-group">
        <label className="form-label" htmlFor="name">{t('fullName')} *</label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={customer.name}
          onChange={handleChange}
          placeholder={t('fullName')}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">{t('phone')} *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`form-input ${errors.phone ? 'error' : ''}`}
          value={customer.phone}
          onChange={handleChange}
          placeholder="05X-XXX-XXXX"
          dir="ltr"
        />
        {errors.phone && <span className="form-error">{errors.phone}</span>}
      </div>

      {needsAddress && (
        <>
          <div className="form-group">
            <label className="form-label" htmlFor="address">{t('address')} *</label>
            <input
              type="text"
              id="address"
              name="address"
              className={`form-input ${errors.address ? 'error' : ''}`}
              value={customer.address}
              onChange={handleChange}
              placeholder={t('address')}
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="floor">{t('floor')} *</label>
              <input
                type="text"
                id="floor"
                name="floor"
                className={`form-input ${errors.floor ? 'error' : ''}`}
                value={customer.floor}
                onChange={handleChange}
                placeholder={t('floor')}
              />
              {errors.floor && <span className="form-error">{errors.floor}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="apartment">{t('apartment')} *</label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                className={`form-input ${errors.apartment ? 'error' : ''}`}
                value={customer.apartment}
                onChange={handleChange}
                placeholder={t('apartment')}
              />
              {errors.apartment && <span className="form-error">{errors.apartment}</span>}
            </div>
          </div>
        </>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="notes">{t('notes')}</label>
        <textarea
          id="notes"
          name="notes"
          className="form-input form-textarea"
          value={customer.notes}
          onChange={handleChange}
          placeholder={t('notesPlaceholder')}
          rows="3"
        />
      </div>

      {/* Payment Method */}
      <div className="form-section">
        <h4 className="form-section-title">{t('paymentMethod')}</h4>
        <div className="payment-options">
          <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
            />
            <div className="payment-radio">
              <div className="payment-radio-inner"></div>
            </div>
            <span className="payment-icon">💵</span>
            <span className="payment-label">{t('cash')}</span>
          </label>
          <label className={`payment-option ${paymentMethod === 'bit' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="bit"
              checked={paymentMethod === 'bit'}
              onChange={() => setPaymentMethod('bit')}
            />
            <div className="payment-radio">
              <div className="payment-radio-inner"></div>
            </div>
            <span className="payment-icon">📱</span>
            <span className="payment-label">{t('bit')}</span>
          </label>
        </div>
        <p className="payment-note">{t('paymentOnDelivery')}</p>
      </div>
    </div>
  );
}

export default CustomerForm;
