import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'ironing-app-cart';
const CUSTOMER_KEY = 'ironing-app-customer';

// Provider address constant (can be updated from settings)
const DEFAULT_PROVIDER_ADDRESS = 'התקווה 11, רמת גן';
const DEFAULT_PROVIDER_FULL_ADDRESS = 'התקווה 11, רמת גן';


// Delivery pricing rules
const DEFAULT_DELIVERY_RULES = {
  pickupDelivery: 15,   // Collecte + retour
  pickupOnly: 10,       // Collecte seule
  deliveryOnly: 10,     // Retour seul
  freeThreshold: 100,    // Gratuit si total >= 100₪
  sameBuildingAddress: 'התקווה 11, רמת גן' // Adresse même immeuble
};

export function CartProvider({ children }) {
  // Cart items: { productId, name, nameHe, nameFr, price, quantity }
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer info
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_KEY);
      return saved ? JSON.parse(saved) : {
        name: '',
        phone: '',
        address: '',
        floor: '',
        apartment: '',
        notes: '',
        isSameBuilding: false
      };
    } catch {
      return {
        name: '',
        phone: '',
        address: '',
        floor: '',
        apartment: '',
        notes: '',
        isSameBuilding: false
      };
    }
  });

  // Delivery & payment options
  const [deliveryMethod, setDeliveryMethod] = useState('pickupDelivery');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist customer info
  useEffect(() => {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  }, [customer]);

  // Add item to cart
  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        nameHe: product.nameHe,
        nameFr: product.nameFr,
        price: product.price,
        quantity: 1
      }];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  // Increment quantity
  const incrementItem = useCallback((productId) => {
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decrement quantity
  const decrementItem = useCallback((productId) => {
    setItems(prev => {
      const item = prev.find(i => i.productId === productId);
      if (item && item.quantity <= 1) {
        return prev.filter(i => i.productId !== productId);
      }
      return prev.map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setDeliveryMethod('pickupDelivery');
    setPaymentMethod('cash');
    setSelectedTimeSlot(null);
  }, []);

  // Calculate items total
  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate delivery fee based on rules
  const calculateDeliveryFee = useCallback(() => {
    // Drop-off is always free
    if (deliveryMethod === 'dropOff') {
      return 0;
    }

    // Same building is always free
    if (customer.isSameBuilding) {
      return 0;
    }

    // Free if above threshold
    if (itemsTotal >= DEFAULT_DELIVERY_RULES.freeThreshold) {
      return 0;
    }

    // Apply standard fees
    switch (deliveryMethod) {
      case 'pickupDelivery':
        return DEFAULT_DELIVERY_RULES.pickupDelivery;
      case 'pickupOnly':
        return DEFAULT_DELIVERY_RULES.pickupOnly;
      case 'deliveryOnly':
        return DEFAULT_DELIVERY_RULES.deliveryOnly;
      default:
        return 0;
    }
  }, [deliveryMethod, customer.isSameBuilding, itemsTotal]);

  const deliveryFee = calculateDeliveryFee();
  const grandTotal = itemsTotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Check if delivery is free
  const isFreeDelivery = deliveryFee === 0 && deliveryMethod !== 'dropOff';
  const amountForFreeDelivery = Math.max(0, DEFAULT_DELIVERY_RULES.freeThreshold - itemsTotal);

  // Update customer info
  const updateCustomer = useCallback((updates) => {
    setCustomer(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    // Cart items
    items,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    
    // Totals
    itemsTotal,
    deliveryFee,
    grandTotal,
    itemCount,
    isFreeDelivery,
    amountForFreeDelivery,
    
    // Delivery
    deliveryMethod,
    setDeliveryMethod,
    deliveryRules: DEFAULT_DELIVERY_RULES,
    
    // Payment
    paymentMethod,
    setPaymentMethod,
    
    // Time slot
    selectedTimeSlot,
    setSelectedTimeSlot,
    
    // Customer
    customer,
    updateCustomer,
    
    // Provider info
    providerAddress: DEFAULT_PROVIDER_ADDRESS,
    providerFullAddress: DEFAULT_PROVIDER_FULL_ADDRESS
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
