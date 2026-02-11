import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

import CartItem from '../components/CartItem';
import DeliveryOptions from '../components/DeliveryOptions';
import TimeSlotPicker from '../components/TimeSlotPicker';
import CustomerForm from '../components/CustomerForm';
import Accordion from '../components/Accordion';

import { formatTimeSlot } from '../utils/timeSlots';
import { sendWhatsAppOrder } from '../utils/whatsapp';

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
  const [openSection, setOpenSection] = useState("delivery");

  const deliveryValid =
    Boolean(deliveryMethod) &&
    (deliveryMethod === 'dropOff' || Boolean(selectedTimeSlot));

  const customerValid =
    customer.name?.trim() &&
    customer.phone?.trim() &&
    (deliveryMethod === 'dropOff' || (
      (customer.isSameBuilding || customer.address?.trim()) &&
      customer.floor?.toString().trim() &&
      customer.apartment?.toString().trim()
    ));

  useEffect(() => {
    if (deliveryValid && openSection === "delivery") {
      setOpenSection("customer");
    }
  }, [deliveryValid, openSection]);

  const validateForm = () => {
    const newErrors = {};

    if (!customer.name?.trim()) {
      newErrors.name = t('requiredField');
    }

    if (!customer.phone?.trim()) {
      newErrors.phone = t('requiredField');
    }

    if (deliveryMethod !== 'dropOff') {

      if (!customer.isSameBuilding && !customer.address?.trim()) {
        newErrors.address = t('requiredField');
      }

      if (!customer.floor?.toString().trim()) {
        newErrors.floor = t('requiredField');
      }

      if (!customer.apartment?.toString().trim()) {
        newErrors.apartment = t('requiredField');
      }

      if (!selectedTimeSlot) {
        newErrors.timeSlot = t('selectTimeSlot');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const pickupAddress = customer.isSameBuilding
      ? providerFullAddress
      : customer.address;

    sendWhatsAppOrder({
      name: customer.name,
      phone: customer.phone,
      pickupAddress,
      floor: customer.floor,
      apartment: customer.apartment,
      notes: customer.notes,
      items,
      total: grandTotal,
      slot: selectedTimeSlot
        ? formatTimeSlot(selectedTimeSlot, language)
        : '',
      language
    });

    const order
