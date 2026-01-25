import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import DeliveryOptions from '../components/DeliveryOptions';
import TimeSlotPicker from '../components/TimeSlotPicker';
import CustomerForm from '../components/CustomerForm';
import { formatTimeSlot } from '../utils/timeSlots';
import './CartPage.css';

function CartPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { 
    items, 
    itemsTotal,
    deliveryFee,
    grandTotal,
    clearCart,
    isFreeDelivery,
    amountForFreeDelivery,
    deliveryRules,
    deliveryMethod,
    paymentMethod,
    selectedTimeSlot,
    customer
  } = useCart();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = t('requiredField');
    }

    if (!customer.phone.trim()) {
      newErrors.phone = t('requiredField');
    } else if (!/^0\d{8,9}$/.test(customer.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = t('invalidPhone');
    }

    if (deliveryMethod !== 'dropOff' && !customer.address.trim()) {
      newErrors.address = t('requiredField');
    }

    if (deliveryMethod !== 'dropOff' && !selectedTimeSlot) {
      newErrors.timeSlot = t('selectTimeSlot');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          nameHe: item.nameHe,
          nameFr: item.nameFr,
          price: item.price,
          quantity: item.quantity
        })),
        customer: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          floor: customer.floor,
          apartment: customer.apartment,
          notes: customer.notes,
          isSameBuilding: customer.isSameBuilding
        },
        delivery: {
          method: deliveryMethod,
          fee: deliveryFee,
          timeSlot: selectedTimeSlot
        },
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        totals: {
          items: itemsTotal,
          delivery: deliveryFee,
          grand: grandTotal
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      // For demo purposes, navigate anyway with a mock order ID
      const mockOrderId = `ORD-${Date.now()}`;
      clearCart();
      navigate(`/order-confirmation/${mockOrderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-icon">🛒</div>
          <h2>{t('cartEmpty')}</h2>
          <p>{t('cartEmptyMessage')}</p>
          <Link to="/" className="btn btn-primary">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, (itemsTotal / deliveryRules.freeThreshold) * 100);

  return (
    <div className="cart-page">
      {/* Cart Header */}
      <div className="cart-header">
        <h1 className="cart-title">{t('cartTitle')}</h1>
        <button className="cart-clear-btn" onClick={clearCart}>
          {t('clearCart')}
        </button>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {items.map(item => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Free Delivery Progress */}
      {amountForFreeDelivery > 0 && deliveryMethod !== 'dropOff' && !customer.isSameBuilding && (
        <div className="cart-delivery-progress">
          <div className="progress-text">
            <span>{t('minimumForFreeDelivery', { amount: amountForFreeDelivery })}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Delivery Options */}
      <DeliveryOptions />

      {/* Time Slot Picker */}
      <TimeSlotPicker />
      {errors.timeSlot && (
        <div className="form-error-banner">{errors.timeSlot}</div>
      )}

      {/* Customer Form */}
      <CustomerForm errors={errors} />

      {/* Order Summary */}
      <div className="cart-summary-section">
        <div className="cart-summary">
          <div className="summary-row">
            <span>{t('itemsTotal')}</span>
            <span>₪{itemsTotal}</span>
          </div>
          <div className="summary-row">
            <span>{t('deliveryFee')}</span>
            {deliveryFee === 0 ? (
              <span className="free-badge">{t('freeDelivery')}</span>
            ) : (
              <span>₪{deliveryFee}</span>
            )}
          </div>
          {selectedTimeSlot && (
            <div className="summary-row summary-slot">
              <span>{t('timeSlotTitle')}</span>
              <span className="slot-value">{formatTimeSlot(selectedTimeSlot, language)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>{t('grandTotal')}</span>
            <span className="total-value">₪{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="cart-actions">
        <button 
          className="btn btn-primary btn-lg btn-block"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-small"></span>
              {t('loading')}
            </>
          ) : (
            t('placeOrder')
          )}
        </button>
        <Link to="/" className="btn btn-ghost btn-block">
          {t('continueShopping')}
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
