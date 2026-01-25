# 🧺 מגהץ פרו - Ironing Service PWA

Application PWA privée pour un service de repassage local.

## 🌍 Langues supportées
- 🇮🇱 Hébreu (RTL)
- 🇫🇷 Français (LTR)

## 🚀 Lancement rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner ou décompresser le projet
cd ironing-pwa

# Installer les dépendances
npm install

# Lancer en développement (API + Frontend)
npm start
```

L'application sera accessible sur:
- Frontend: http://localhost:3000
- API: http://localhost:3001

### Production

```bash
# Build
npm run build

# Servir le build
npm run preview
```

## 📁 Structure du projet

```
ironing-pwa/
├── public/              # Assets statiques
├── server/
│   └── index.js        # API Express + SQLite
├── src/
│   ├── components/     # Composants React réutilisables
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── DeliveryOptions.jsx
│   │   ├── TimeSlotPicker.jsx
│   │   └── CustomerForm.jsx
│   ├── context/        # Contextes React
│   │   ├── LanguageContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/          # Pages de l'application
│   │   ├── CatalogPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── OrdersPage.jsx
│   │   └── AdminPage.jsx
│   ├── styles/         # Styles CSS globaux
│   ├── utils/          # Utilitaires
│   │   ├── api.js
│   │   ├── translations.js
│   │   └── timeSlots.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 📊 Modèle de données

### Products (Articles)
| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Identifiant unique |
| nameHe | TEXT | Nom en hébreu |
| nameFr | TEXT | Nom en français |
| price | REAL | Prix en ₪ |
| active | INTEGER | 1 = actif, 0 = inactif |

### Orders (Commandes)
| Champ | Type | Description |
|-------|------|-------------|
| id | TEXT | ID unique (ORD-XXXXXXXX) |
| customerName | TEXT | Nom du client |
| customerPhone | TEXT | Téléphone |
| customerAddress | TEXT | Adresse |
| deliveryMethod | TEXT | pickup/delivery/dropoff |
| paymentMethod | TEXT | cash/bit |
| paymentStatus | TEXT | pending/paid |
| status | TEXT | Statut de la commande |
| itemsTotal | REAL | Total articles |
| grandTotal | REAL | Total avec livraison |

### Order Items (Articles commandés)
| Champ | Type | Description |
|-------|------|-------------|
| orderId | TEXT | Référence commande |
| productId | INTEGER | Référence produit |
| quantity | INTEGER | Quantité |
| price | REAL | Prix unitaire |

## ⚙️ Règles métier

### Créneaux horaires (stricts)
- **Lundi → Jeudi**: 20:30 - 23:00
- **Dimanche**: 09:00 - 14:00 ET 19:00 - 23:00
- **Vendredi**: 09:00 - 15:00
- **Samedi**: FERMÉ

### Livraison
- **Même immeuble** (התקווה 11, רמת גן): GRATUIT
- **Autres adresses**:
  - Collecte + Retour: ₪15
  - Collecte seule: ₪10
  - Retour seul: ₪10
  - **GRATUIT si total ≥ ₪50**
- **Dépôt sur place**: GRATUIT (pas de créneau obligatoire)

### Paiement
- Hors ligne uniquement
- Espèces (💵) ou Bit (📱)
- Paiement à la remise

## 🔌 API Endpoints

### Products
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `PUT /api/products/:id` - Modifier un produit

### Orders
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détail d'une commande
- `GET /api/orders/phone/:phone` - Commandes par téléphone
- `PUT /api/orders/:id/status` - Changer le statut
- `PUT /api/orders/:id/paid` - Marquer comme payée

### Settings
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Modifier les paramètres

## 📱 Catalogue initial

| Article | Hébreu | Prix |
|---------|--------|------|
| T-shirt | טי שירט | ₪7 |
| Chemise | מכופתרת | ₪15 |
| Pantalon | מכנס | ₪11 |
| Robe courte | שמלה קצרה | ₪15 |
| Robe longue | שמלה ארוכה | ₪20 |
| Jupe courte | חצאית קצרה | ₪10 |
| Jupe longue | חצאית ארוכה | ₪13 |

## 🛣️ URLs

| Route | Description |
|-------|-------------|
| `/` | Catalogue (page d'accueil) |
| `/cart` | Panier et checkout |
| `/orders` | Historique des commandes |
| `/order-confirmation/:id` | Confirmation de commande |
| `/admin` | Back-office admin |

## 🔮 Évolutions futures possibles

1. **Authentification admin** - Sécuriser le back-office
2. **Notifications push** - Alertes de statut
3. **Notifications SMS** - Via Twilio ou équivalent
4. **Calendrier de disponibilité** - Bloquer des dates
5. **Statistiques** - Dashboard analytics
6. **Multi-prestataires** - Support de plusieurs points de collecte
7. **Exports** - CSV/PDF des commandes
8. **Mode hors-ligne** - Service Worker amélioré
9. **Intégration Bit** - Deep link pour paiement
10. **QR Code** - Pour le suivi des commandes

## 📄 Licence

Usage privé uniquement. Non destiné à la publication sur les stores.

---

Développé avec ❤️ pour un service de repassage local.
