import Payment from '../models/payment.model.js';
import { PAYMENT_STATUS } from '../../../shared/constants/order.constants.js';

export const findUsedTransactionId = async (transactionId) => {
  if (!transactionId) return null;
  return Payment.findOne({
    'manualProof.transactionId': transactionId.trim(),
    status: { $in: [PAYMENT_STATUS.AWAITING_VERIFICATION, PAYMENT_STATUS.SUCCEEDED] },
  }).lean();
};

export const createPayment = async (data) => Payment.create(data);

export const getPaymentByOrderId = async (orderId) =>
  Payment.findOne({ order: orderId }).lean();
