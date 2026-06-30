import mongoose from 'mongoose';
import {
  PAYMENT_METHOD,
  ORDER_STATUS,
  FULFILLMENT_STATUS,
  CURRENCY,
} from '../../../shared/constants/order.constants.js';

const orderItemSchema = new mongoose.Schema({
  gameId: { type: String, required: true, trim: true },
  gameRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  platform: { type: String, trim: true },
  edition: { type: String, trim: true },
}, { _id: false });

const billingSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  province: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  streetAddress: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  orderNotes: { type: String, trim: true },
}, { _id: false });

const fulfillmentKeySchema = new mongoose.Schema({
  gameId: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  key: { type: String, required: true, trim: true },
  assignedAt: { type: Date, default: Date.now },
}, { _id: false });

const fulfillmentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(FULFILLMENT_STATUS),
    default: FULFILLMENT_STATUS.PENDING,
  },
  keys: [fulfillmentKeySchema],
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fulfilledAt: { type: Date },
  adminNotes: { type: String, trim: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  billingDetails: { type: billingSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: CURRENCY },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING_PAYMENT,
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
    required: true,
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  rejectionReason: { type: String, trim: true },
  fulfillment: { type: fulfillmentSchema, default: () => ({ status: FULFILLMENT_STATUS.PENDING, keys: [] }) },
  expiresAt: { type: Date, index: true },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
