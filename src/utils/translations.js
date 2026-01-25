/**
 * Translations for Hebrew (HE) and French (FR)
 * All UI strings are centralized here for easy maintenance
 */

export const translations = {
  he: {
    // App
    appName: 'מגהץ פרו',
    appTagline: 'שירות גיהוץ מקצועי',
    
    // Navigation
    home: 'ראשי',
    catalog: 'קטלוג',
    cart: 'סל',
    orders: 'הזמנות',
    admin: 'ניהול',
    
    // Language
    language: 'שפה',
    hebrew: 'עברית',
    french: 'צרפתית',
    
    // Catalog
    catalogTitle: 'הפריטים שלנו',
    addToCart: 'הוסף לסל',
    itemAdded: 'נוסף לסל',
    
    // Cart
    cartTitle: 'סל הקניות',
    cartEmpty: 'הסל ריק',
    cartEmptyMessage: 'הוסף פריטים מהקטלוג',
    itemsTotal: 'סה"כ פריטים',
    deliveryFee: 'דמי משלוח',
    freeDelivery: 'משלוח חינם',
    grandTotal: 'סה"כ לתשלום',
    clearCart: 'נקה סל',
    continueShopping: 'המשך קניות',
    proceedToCheckout: 'המשך להזמנה',
    
    // Delivery options
    deliveryMethod: 'אופן המסירה',
    pickupDelivery: 'איסוף והחזרה',
    pickupOnly: 'איסוף בלבד',
    deliveryOnly: 'החזרה בלבד',
    dropOff: 'הבאה עצמית',
    
    pickupDeliveryDesc: 'נאסוף ונחזיר עד אליך',
    pickupOnlyDesc: 'נאסוף ממך',
    deliveryOnlyDesc: 'נחזיר אליך',
    dropOffDesc: 'הבא ואסוף מאתנו',
    
    // Same building discount
    sameBuildingTitle: 'אותו בניין',
    sameBuildingMessage: 'איסוף והחזרה חינם – אותו בניין',
    sameBuildingQuestion: 'האם אתה גר באותו בניין?',
    
    // Minimum order
    freeDeliveryThreshold: 'משלוח חינם מ-₪50',
    minimumForFreeDelivery: 'חסר ₪{amount} למשלוח חינם',
    
    // Time slots
    selectTimeSlot: 'בחר מועד',
    timeSlotTitle: 'מועד איסוף',
    noSlotsAvailable: 'אין מועדים זמינים',
    
    // Days
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת',
    
    // Payment
    paymentMethod: 'אמצעי תשלום',
    cash: 'מזומן',
    bit: 'ביט',
    paymentOnDelivery: 'תשלום במסירה',
    
    // Customer info
    customerInfo: 'פרטי לקוח',
    fullName: 'שם מלא',
    phone: 'טלפון',
    address: 'כתובת',
    floor: 'קומה',
    apartment: 'דירה',
    notes: 'הערות',
    
    // Order
    placeOrder: 'שלח הזמנה',
    orderPlaced: 'ההזמנה נשלחה',
    orderNumber: 'מספר הזמנה',
    orderDate: 'תאריך הזמנה',
    orderStatus: 'סטטוס',
    orderDetails: 'פרטי הזמנה',
    orderHistory: 'היסטוריית הזמנות',
    noOrders: 'אין הזמנות',
    noOrdersMessage: 'עדיין לא ביצעת הזמנות',
    
    // Order statuses
    statusReceived: 'התקבלה',
    statusCollected: 'נאספה',
    statusIroning: 'בגיהוץ',
    statusReady: 'מוכנה',
    statusDelivering: 'בהחזרה',
    statusCompleted: 'הושלמה',
    
    // Payment statuses
    paymentPending: 'ממתין לתשלום',
    paymentPaid: 'שולם',
    
    // Provider address
    providerAddress: 'הכתובת שלנו',
    openInGoogleMaps: 'פתח ב-Google Maps',
    openInWaze: 'פתח ב-Waze',
    
    // Validation
    requiredField: 'שדה חובה',
    invalidPhone: 'מספר טלפון לא תקין',
    selectDeliveryMethod: 'בחר אופן מסירה',
    selectTimeSlot: 'בחר מועד',
    selectPaymentMethod: 'בחר אמצעי תשלום',
    
    // Misc
    currency: '₪',
    free: 'חינם',
    cancel: 'ביטול',
    confirm: 'אישור',
    save: 'שמור',
    edit: 'ערוך',
    delete: 'מחק',
    back: 'חזור',
    next: 'הבא',
    loading: 'טוען...',
    error: 'שגיאה',
    success: 'הצלחה',
    
    // Admin
    adminTitle: 'ממשק ניהול',
    allOrders: 'כל ההזמנות',
    settings: 'הגדרות',
    updateStatus: 'עדכן סטטוס',
    markAsPaid: 'סמן כשולם',
    editPrices: 'ערוך מחירים',
    editTimeSlots: 'ערוך מועדים',
    editDeliveryRules: 'ערוך כללי משלוח',
    editAddress: 'ערוך כתובת',
  },
  
  fr: {
    // App
    appName: 'Pressing Pro',
    appTagline: 'Service de repassage professionnel',
    
    // Navigation
    home: 'Accueil',
    catalog: 'Catalogue',
    cart: 'Panier',
    orders: 'Commandes',
    admin: 'Admin',
    
    // Language
    language: 'Langue',
    hebrew: 'Hébreu',
    french: 'Français',
    
    // Catalog
    catalogTitle: 'Nos articles',
    addToCart: 'Ajouter au panier',
    itemAdded: 'Ajouté au panier',
    
    // Cart
    cartTitle: 'Votre panier',
    cartEmpty: 'Panier vide',
    cartEmptyMessage: 'Ajoutez des articles depuis le catalogue',
    itemsTotal: 'Total articles',
    deliveryFee: 'Frais de livraison',
    freeDelivery: 'Livraison gratuite',
    grandTotal: 'Total à payer',
    clearCart: 'Vider le panier',
    continueShopping: 'Continuer les achats',
    proceedToCheckout: 'Commander',
    
    // Delivery options
    deliveryMethod: 'Mode de livraison',
    pickupDelivery: 'Collecte et retour',
    pickupOnly: 'Collecte seule',
    deliveryOnly: 'Retour seul',
    dropOff: 'Dépôt sur place',
    
    pickupDeliveryDesc: 'Nous collectons et livrons chez vous',
    pickupOnlyDesc: 'Nous collectons chez vous',
    deliveryOnlyDesc: 'Nous livrons chez vous',
    dropOffDesc: 'Déposez et récupérez sur place',
    
    // Same building discount
    sameBuildingTitle: 'Même immeuble',
    sameBuildingMessage: 'Collecte et retour gratuits – même immeuble',
    sameBuildingQuestion: 'Habitez-vous dans le même immeuble ?',
    
    // Minimum order
    freeDeliveryThreshold: 'Livraison gratuite dès 50₪',
    minimumForFreeDelivery: 'Il manque {amount}₪ pour la livraison gratuite',
    
    // Time slots
    selectTimeSlot: 'Choisir un créneau',
    timeSlotTitle: 'Créneau de collecte',
    noSlotsAvailable: 'Aucun créneau disponible',
    
    // Days
    sunday: 'Dimanche',
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    
    // Payment
    paymentMethod: 'Mode de paiement',
    cash: 'Espèces',
    bit: 'Bit',
    paymentOnDelivery: 'Paiement à la remise',
    
    // Customer info
    customerInfo: 'Vos informations',
    fullName: 'Nom complet',
    phone: 'Téléphone',
    address: 'Adresse',
    floor: 'Étage',
    apartment: 'Appartement',
    notes: 'Notes',
    
    // Order
    placeOrder: 'Valider la commande',
    orderPlaced: 'Commande envoyée',
    orderNumber: 'N° de commande',
    orderDate: 'Date de commande',
    orderStatus: 'Statut',
    orderDetails: 'Détails de la commande',
    orderHistory: 'Historique des commandes',
    noOrders: 'Aucune commande',
    noOrdersMessage: 'Vous n\'avez pas encore commandé',
    
    // Order statuses
    statusReceived: 'Reçue',
    statusCollected: 'Collectée',
    statusIroning: 'En cours',
    statusReady: 'Prête',
    statusDelivering: 'En livraison',
    statusCompleted: 'Terminée',
    
    // Payment statuses
    paymentPending: 'En attente',
    paymentPaid: 'Payée',
    
    // Provider address
    providerAddress: 'Notre adresse',
    openInGoogleMaps: 'Ouvrir dans Google Maps',
    openInWaze: 'Ouvrir dans Waze',
    
    // Validation
    requiredField: 'Champ obligatoire',
    invalidPhone: 'Numéro de téléphone invalide',
    selectDeliveryMethod: 'Choisissez un mode de livraison',
    selectTimeSlot: 'Choisissez un créneau',
    selectPaymentMethod: 'Choisissez un mode de paiement',
    
    // Misc
    currency: '₪',
    free: 'Gratuit',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    edit: 'Modifier',
    delete: 'Supprimer',
    back: 'Retour',
    next: 'Suivant',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Admin
    adminTitle: 'Administration',
    allOrders: 'Toutes les commandes',
    settings: 'Paramètres',
    updateStatus: 'Mettre à jour le statut',
    markAsPaid: 'Marquer comme payée',
    editPrices: 'Modifier les prix',
    editTimeSlots: 'Modifier les créneaux',
    editDeliveryRules: 'Modifier les règles de livraison',
    editAddress: 'Modifier l\'adresse',
  }
};

/**
 * Get a translation by key
 * Supports nested keys with dot notation: 'cart.title'
 * Supports interpolation: 'Hello {name}' with { name: 'World' }
 */
export function t(translations, lang, key, params = {}) {
  const langTranslations = translations[lang] || translations.he;
  let text = langTranslations[key] || key;
  
  // Handle interpolation
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

export default translations;
