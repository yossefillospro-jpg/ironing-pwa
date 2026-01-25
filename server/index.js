/**
 * Ironing Service API Server
 * Simple Express API with SQLite database
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Try to load better-sqlite3, fall back to in-memory storage
let db;
let useInMemory = false;

try {
  const Database = require('better-sqlite3');
  db = new Database(path.join(__dirname, 'ironing.db'));
  db.pragma('journal_mode = WAL');
  console.log('✅ SQLite database connected');
} catch (error) {
  console.log('⚠️ SQLite not available, using in-memory storage');
  useInMemory = true;
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =====================================
// In-Memory Storage (fallback)
// =====================================

const inMemoryData = {
  products: [
    { id: 1, nameHe: 'טי שירט', nameFr: 'T-shirt', price: 7, active: 1 },
    { id: 2, nameHe: 'מכופתרת', nameFr: 'Chemise', price: 15, active: 1 },
    { id: 3, nameHe: 'מכנס', nameFr: 'Pantalon', price: 11, active: 1 },
    { id: 4, nameHe: 'שמלה קצרה', nameFr: 'Robe courte', price: 15, active: 1 },
    { id: 5, nameHe: 'שמלה ארוכה', nameFr: 'Robe longue', price: 20, active: 1 },
    { id: 6, nameHe: 'חצאית קצרה', nameFr: 'Jupe courte', price: 10, active: 1 },
    { id: 7, nameHe: 'חצאית ארוכה', nameFr: 'Jupe longue', price: 13, active: 1 }
  ],
  orders: [],
  settings: {
    providerAddress: 'התקווה 11, רמת גן, קומה 28, דירה 106',
    sameBuildingAddress: 'התקווה 11, רמת גן',
    deliveryFees: {
      pickupDelivery: 15,
      pickupOnly: 10,
      deliveryOnly: 10
    },
    freeDeliveryThreshold: 50
  }
};

// =====================================
// Database Setup (SQLite)
// =====================================

if (!useInMemory) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nameHe TEXT NOT NULL,
      nameFr TEXT NOT NULL,
      price REAL NOT NULL,
      active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerAddress TEXT,
      customerFloor TEXT,
      customerApartment TEXT,
      customerNotes TEXT,
      isSameBuilding INTEGER DEFAULT 0,
      deliveryMethod TEXT NOT NULL,
      deliveryFee REAL DEFAULT 0,
      timeSlotId TEXT,
      timeSlotDate TEXT,
      timeSlotStart TEXT,
      timeSlotEnd TEXT,
      paymentMethod TEXT NOT NULL,
      paymentStatus TEXT DEFAULT 'pending',
      itemsTotal REAL NOT NULL,
      grandTotal REAL NOT NULL,
      status TEXT DEFAULT 'received',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productId INTEGER,
      nameHe TEXT NOT NULL,
      nameFr TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed products if empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (nameHe, nameFr, price) VALUES (?, ?, ?)
    `);
    
    const seedProducts = [
      ['טי שירט', 'T-shirt', 7],
      ['מכופתרת', 'Chemise', 15],
      ['מכנס', 'Pantalon', 11],
      ['שמלה קצרה', 'Robe courte', 15],
      ['שמלה ארוכה', 'Robe longue', 20],
      ['חצאית קצרה', 'Jupe courte', 10],
      ['חצאית ארוכה', 'Jupe longue', 13]
    ];
    
    seedProducts.forEach(p => insertProduct.run(...p));
    console.log('✅ Seed products inserted');
  }

  // Seed default settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('providerAddress', 'התקווה 11, רמת גן, קומה 28, דירה 106');
    insertSetting.run('sameBuildingAddress', 'התקווה 11, רמת גן');
    insertSetting.run('deliveryFees', JSON.stringify({ pickupDelivery: 15, pickupOnly: 10, deliveryOnly: 10 }));
    insertSetting.run('freeDeliveryThreshold', '50');
    console.log('✅ Default settings inserted');
  }
}

// =====================================
// API Routes - Products
// =====================================

app.get('/api/products', (req, res) => {
  try {
    if (useInMemory) {
      return res.json(inMemoryData.products);
    }
    const products = db.prepare('SELECT * FROM products WHERE active = 1').all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    if (useInMemory) {
      const product = inMemoryData.products.find(p => p.id === parseInt(req.params.id));
      return product ? res.json(product) : res.status(404).json({ error: 'Product not found' });
    }
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { price, nameHe, nameFr } = req.body;
    if (useInMemory) {
      const idx = inMemoryData.products.findIndex(p => p.id === parseInt(req.params.id));
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      if (price !== undefined) inMemoryData.products[idx].price = price;
      if (nameHe !== undefined) inMemoryData.products[idx].nameHe = nameHe;
      if (nameFr !== undefined) inMemoryData.products[idx].nameFr = nameFr;
      return res.json(inMemoryData.products[idx]);
    }
    
    const updates = [];
    const values = [];
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (nameHe !== undefined) { updates.push('nameHe = ?'); values.push(nameHe); }
    if (nameFr !== undefined) { updates.push('nameFr = ?'); values.push(nameFr); }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    values.push(req.params.id);
    db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// =====================================
// API Routes - Orders
// =====================================

app.post('/api/orders', (req, res) => {
  try {
    const { items, customer, delivery, payment, totals } = req.body;
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    if (useInMemory) {
      const order = {
        id: orderId,
        items,
        customer,
        delivery,
        payment,
        totals,
        status: 'received',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      inMemoryData.orders.unshift(order);
      return res.status(201).json(order);
    }
    
    // Insert order
    db.prepare(`
      INSERT INTO orders (
        id, customerName, customerPhone, customerAddress, customerFloor, 
        customerApartment, customerNotes, isSameBuilding, deliveryMethod, 
        deliveryFee, timeSlotId, timeSlotDate, timeSlotStart, timeSlotEnd,
        paymentMethod, itemsTotal, grandTotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      customer.name,
      customer.phone,
      customer.address || '',
      customer.floor || '',
      customer.apartment || '',
      customer.notes || '',
      customer.isSameBuilding ? 1 : 0,
      delivery.method,
      delivery.fee,
      delivery.timeSlot?.id || '',
      delivery.timeSlot?.date || '',
      delivery.timeSlot?.start || '',
      delivery.timeSlot?.end || '',
      payment.method,
      totals.items,
      totals.grand
    );
    
    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, nameHe, nameFr, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    items.forEach(item => {
      insertItem.run(orderId, item.productId, item.nameHe, item.nameFr, item.price, item.quantity);
    });
    
    res.status(201).json({ id: orderId, status: 'received' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    if (useInMemory) {
      return res.json(inMemoryData.orders);
    }
    
    const orders = db.prepare(`
      SELECT * FROM orders ORDER BY createdAt DESC
    `).all();
    
    // Fetch items for each order
    const getItems = db.prepare('SELECT * FROM order_items WHERE orderId = ?');
    
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: getItems.all(order.id),
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
        floor: order.customerFloor,
        apartment: order.customerApartment,
        notes: order.customerNotes,
        isSameBuilding: order.isSameBuilding === 1
      },
      delivery: {
        method: order.deliveryMethod,
        fee: order.deliveryFee,
        timeSlot: order.timeSlotId ? {
          id: order.timeSlotId,
          date: order.timeSlotDate,
          start: order.timeSlotStart,
          end: order.timeSlotEnd
        } : null
      },
      totals: {
        items: order.itemsTotal,
        delivery: order.deliveryFee,
        grand: order.grandTotal
      }
    }));
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/phone/:phone', (req, res) => {
  try {
    const phone = decodeURIComponent(req.params.phone).replace(/[-\s]/g, '');
    
    if (useInMemory) {
      const orders = inMemoryData.orders.filter(o => 
        o.customer.phone.replace(/[-\s]/g, '') === phone
      );
      return res.json(orders);
    }
    
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE REPLACE(REPLACE(customerPhone, '-', ''), ' ', '') = ?
      ORDER BY createdAt DESC
    `).all(phone);
    
    const getItems = db.prepare('SELECT * FROM order_items WHERE orderId = ?');
    
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: getItems.all(order.id),
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
        floor: order.customerFloor,
        apartment: order.customerApartment,
        notes: order.customerNotes,
        isSameBuilding: order.isSameBuilding === 1
      },
      delivery: {
        method: order.deliveryMethod,
        fee: order.deliveryFee
      },
      totals: {
        items: order.itemsTotal,
        delivery: order.deliveryFee,
        grand: order.grandTotal
      }
    }));
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders by phone:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    if (useInMemory) {
      const order = inMemoryData.orders.find(o => o.id === req.params.id);
      return order ? res.json(order) : res.status(404).json({ error: 'Order not found' });
    }
    
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(req.params.id);
    
    res.json({
      ...order,
      items,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress
      },
      totals: {
        items: order.itemsTotal,
        delivery: order.deliveryFee,
        grand: order.grandTotal
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['received', 'collected', 'ironing', 'ready', 'delivering', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    if (useInMemory) {
      const order = inMemoryData.orders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      order.status = status;
      return res.json({ success: true, status });
    }
    
    db.prepare('UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, req.params.id);
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.put('/api/orders/:id/paid', (req, res) => {
  try {
    if (useInMemory) {
      const order = inMemoryData.orders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      order.paymentStatus = 'paid';
      return res.json({ success: true, paymentStatus: 'paid' });
    }
    
    db.prepare('UPDATE orders SET paymentStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run('paid', req.params.id);
    
    res.json({ success: true, paymentStatus: 'paid' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as paid' });
  }
});

// =====================================
// API Routes - Settings
// =====================================

app.get('/api/settings', (req, res) => {
  try {
    if (useInMemory) {
      return res.json(inMemoryData.settings);
    }
    
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(row => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const updates = req.body;
    
    if (useInMemory) {
      Object.assign(inMemoryData.settings, updates);
      return res.json(inMemoryData.settings);
    }
    
    const upsert = db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    
    Object.entries(updates).forEach(([key, value]) => {
      const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      upsert.run(key, valueStr);
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// =====================================
// Start Server
// =====================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🧺 Ironing Service API                  ║
║   Running on http://localhost:${PORT}        ║
║   ${useInMemory ? '⚠️  In-Memory Mode' : '✅ SQLite Database'}                   ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
