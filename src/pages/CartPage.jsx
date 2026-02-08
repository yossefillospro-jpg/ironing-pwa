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

// Numéro WhatsApp du prestataire (à configurer)
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;


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
    customer,
    providerFullAddress
  } = useCart();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get delivery method label
  const getDeliveryMethodLabel = () => {
    switch (deliveryMethod) {
      case 'pickupDelivery': return t('pickupDelivery');
      case 'pickupOnly': return t('pickupOnly');
      case 'deliveryOnly': return t('deliveryOnly');
      case 'dropOff': return t('dropOff');
      default: return deliveryMethod;
    }
  };

  // Get payment method label
  const getPaymentMethodLabel = () => {
    return paymentMethod === 'cash' ? t('cash') : t('bit');
  };

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

    if (deliveryMethod !== 'dropOff') {
      if (!customer.address.trim()) {
        newErrors.address = t('requiredField');
      }
      if (!customer.floor.trim()) {
        newErrors.floor = t('requiredField');
      }
      if (!customer.apartment.trim()) {
        newErrors.apartment = t('requiredField');
      }
      if (!selectedTimeSlot) {
        newErrors.timeSlot = t('selectTimeSlot');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const lines = [];
    
    // Header
    lines.push(t('whatsappIntro'));
    lines.push('');
    
    // Client info
    lines.push(t('whatsappClient') + ':');
    lines.push(`${t('fullName')}: ${customer.name}`);
    lines.push(`${t('phone')}: ${customer.phone}`);
    lines.push('');
    
    // Address (only for pickup/delivery)
    if (deliveryMethod !== 'dropOff') {
      lines.push(t('whatsappAddress') + ':');
      lines.push(`${t('whatsappStreet')}: ${customer.address}`);
      lines.push(`${t('whatsappFloor')}: ${customer.floor}`);
      lines.push(`${t('whatsappApartment')}: ${customer.apartment}`);
      lines.push(`${t('whatsappNotes')}: ${customer.notes || t('whatsappNoNotes')}`);
      lines.push('');
    }
    
    // Delivery mode
    lines.push(`${t('whatsappMode')}: ${getDeliveryMethodLabel()}`);
    
    // Time slot (only for pickup/delivery)
    if (deliveryMethod !== 'dropOff' && selectedTimeSlot) {
      lines.push(`${t('whatsappTimeSlot')}: ${formatTimeSlot(selectedTimeSlot, language)}`);
    }
    
    // Drop-off address
    if (deliveryMethod === 'dropOff') {
      lines.push(`📍 ${providerFullAddress}`);
    }
    lines.push('');
    
    // Order items
    lines.push(t('whatsappOrder') + ':');
    items.forEach(item => {
      const name = language === 'he' ? item.nameHe : item.nameFr;
      lines.push(`• ${name} x${item.quantity} = ₪${item.price * item.quantity}`);
    });
    lines.push('');
    
    // Total
    if (deliveryFee > 0) {
      lines.push(`${t('whatsappTotal')}: ₪${grandTotal} (${t('whatsappDeliveryIncluded')}: ₪${deliveryFee})`);
    } else {
      lines.push(`${t('whatsappTotal')}: ₪${grandTotal}`);
    }
    
    // Payment
    lines.push(`${t('whatsappPayment')}: ${getPaymentMethodLabel()} (${t('whatsappAtDelivery')})`);
    lines.push('');
    
    // Confirmation
    lines.push(t('whatsappConfirmation'));
    
    return lines.join('\n');
  };

  // Handle order submission via WhatsApp
  const handleSubmit = () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.form-input.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Generate WhatsApp message
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open in new tab/window
    window.open(whatsappUrl, '_blank');
    
    // Generate order ID and navigate to confirmation
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    // Clear cart after small delay
    setTimeout(() => {
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    }, 500);
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
          <div className="summary-row summary-mode">
            <span>{t('deliveryMethod')}</span>
            <span>{getDeliveryMethodLabel()}</span>
          </div>
          {selectedTimeSlot && (
            <div className="summary-row summary-slot">
              <span>{t('timeSlotTitle')}</span>
              <span className="slot-value">{formatTimeSlot(selectedTimeSlot, language)}</span>
            </div>
          )}
          <div className="summary-row summary-payment">
            <span>{t('paymentMethod')}</span>
            <span>{getPaymentMethodLabel()} ({t('paymentOnDelivery')})</span>
          </div>
          <div className="summary-row total">
            <span>{t('grandTotal')}</span>
            <span className="total-value">₪{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="cart-actions">
        <button 
          className="btn btn-whatsapp btn-lg btn-block"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-small"></span>
              {t('loading')}
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('placeOrder')}
            </>
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
