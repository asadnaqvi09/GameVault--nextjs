import mongoose from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS, CURRENCY } from '../../../shared/constants/order.constants.js';

const manualProofSchema = new mongoose.Schema({
  imageUrl: { type: String, trim: true },
  imagePublicId: { type: String, trim: true },
  transactionId: { type: String, trim: true },
  senderNumber: { type: String, trim: true },
  uploadedAt: { type: Date },
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  method: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
    required: true,
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: CURRENCY },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
    index: true,
  },
  manualProof: manualProofSchema,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String, trim: true },
  expiresAt: { type: Date, index: true },
}, { timestamps: true });

paymentSchema.index(
  { 'manualProof.transactionId': 1 },
  { unique: true, sparse: true }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
