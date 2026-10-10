import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/orders
// body: { items: [{ product: "<id>", qty: 2 }], shippingAddress: {...} }
// Prices come from the DATABASE, never from the client.
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  const products = await Product.find({ _id: { $in: items.map((i) => i.product) } });
  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = products.find((p) => p._id.equals(item.product));
    const qty = Number(item.qty);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (!Number.isInteger(qty) || qty < 1) {
      res.status(400);
      throw new Error(`Invalid quantity for ${product.name}`);
    }
    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }
    orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
    totalPrice += product.price * qty;
  }

  // Reduce stock (only if still enough, avoids overselling)
  for (const item of orderItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
    if (!updated) {
      res.status(400);
      throw new Error(`Not enough stock for ${item.name}`);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    totalPrice: Number(totalPrice.toFixed(2)),
  });
  res.status(201).json(order);
});

// GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id  (owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed to view this order');
  }
  res.json(order);
});

// GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  await order.save(); // enum validation runs here
  res.json(order);
});
