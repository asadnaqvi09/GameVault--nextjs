import { randomBytes } from 'crypto';
import Order from '../models/order.model.js';
import Game from '../../games/models/game.model.js';
import Payment from '../../payments/models/payment.model.js';
import { createPayment, findUsedTransactionId } from '../../payments/services/payment.service.js';
import { uploadPaymentProof, removePaymentProof } from '../../payments/services/cloudinary.service.js';
import {
  PAYMENT_METHOD,
  ORDER_STATUS,
  PAYMENT_STATUS,
  FULFILLMENT_STATUS,
  ORDER_EXPIRY_HOURS,
  CURRENCY,
} from '../../../shared/constants/order.constants.js';
import {
  dispatchOrderPlacedEmails,
  safeSend,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
  sendOrderFulfilledEmail,
  sendOrderExpiredEmail,
} from '../../../shared/utils/sendEmail.util.js';

export const buildOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = randomBytes(3).toString('hex').toUpperCase();
  return `GV-${date}-${suffix}`;
};

const getExpiryDate = () => new Date(Date.now() + ORDER_EXPIRY_HOURS * 60 * 60 * 1000);

export const resolveOrderItems = async (items) => {
  const resolved = [];
  let subtotal = 0;
  for (const item of items) {
    const game = await Game.findOne({
      id: item.gameId,
      isActive: true,
      isDeleted: false,
    }).lean();
    if (!game) {
      throw new Error(`Game not found: ${item.gameId}`);
    }
    const quantity = item.quantity || 1;
    const lineTotal = game.price * quantity;
    subtotal += lineTotal;
    resolved.push({
      gameId: game.id,
      gameRef: game._id,
      title: game.title,
      price: game.price,
      quantity,
      platform: item.platform || null,
      edition: item.edition || null,
    });
  }
  return { items: resolved, subtotal, total: subtotal };
};

const toPublicOrder = (order, payment = null) => ({
  id: order._id,
  orderNumber: order.orderNumber,
  status: order.status,
  paymentMethod: order.paymentMethod,
  items: order.items,
  billingDetails: order.billingDetails,
  subtotal: order.subtotal,
  total: order.total,
  currency: order.currency,
  rejectionReason: order.rejectionReason || null,
  fulfillment: order.fulfillment,
  expiresAt: order.expiresAt || null,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  payment: payment ? {
    status: payment.status,
    transactionId: payment.manualProof?.transactionId || null,
    proofImageUrl: payment.manualProof?.imageUrl || null,
  } : null,
});

const toAdminOrder = (order, payment = null) => ({
  ...toPublicOrder(order, payment),
  expectedAmount: order.total,
  user: order.user,
  paymentDetail: payment ? {
    id: payment._id,
    status: payment.status,
    method: payment.method,
    amount: payment.amount,
    currency: payment.currency,
    transactionId: payment.manualProof?.transactionId || null,
    senderNumber: payment.manualProof?.senderNumber || null,
    proofImageUrl: payment.manualProof?.imageUrl || null,
    rejectionReason: payment.rejectionReason || null,
  } : null,
});

export const placeCodOrder = async (userId, payload) => {
  const { items, subtotal, total } = await resolveOrderItems(payload.items);
  const orderNumber = buildOrderNumber();
  const order = await Order.create({
    orderNumber,
    user: userId,
    items,
    billingDetails: payload.billingDetails,
    subtotal,
    total,
    currency: CURRENCY,
    status: ORDER_STATUS.PENDING_PAYMENT,
    paymentMethod: PAYMENT_METHOD.COD,
    fulfillment: { status: FULFILLMENT_STATUS.PENDING, keys: [] },
  });
  const payment = await createPayment({
    order: order._id,
    user: userId,
    method: PAYMENT_METHOD.COD,
    amount: total,
    currency: CURRENCY,
    status: PAYMENT_STATUS.PENDING,
  });
  order.payment = payment._id;
  await order.save();
  const populated = order.toObject();
  dispatchOrderPlacedEmails(populated, payment);
  return { order: toPublicOrder(populated, payment), payment };
};

export const placeManualPaymentOrder = async (userId, payload, file) => {
  if (!file) throw new Error('Payment proof image is required');
  const duplicate = await findUsedTransactionId(payload.transactionId);
  if (duplicate) throw new Error('This transaction ID has already been used');
  const { items, subtotal, total } = await resolveOrderItems(payload.items);
  const orderNumber = buildOrderNumber();
  const expiresAt = getExpiryDate();

  let order = null;
  let proofPublicId = null;

  try {
    order = await Order.create({
      orderNumber,
      user: userId,
      items,
      billingDetails: payload.billingDetails,
      subtotal,
      total,
      currency: CURRENCY,
      status: ORDER_STATUS.PAYMENT_UNDER_REVIEW,
      paymentMethod: payload.paymentMethod,
      expiresAt,
      fulfillment: { status: FULFILLMENT_STATUS.PENDING, keys: [] },
    });

    const proof = await uploadPaymentProof(file.buffer, orderNumber);
    proofPublicId = proof.publicId;

    const payment = await createPayment({
      order: order._id,
      user: userId,
      method: payload.paymentMethod,
      amount: total,
      currency: CURRENCY,
      status: PAYMENT_STATUS.AWAITING_VERIFICATION,
      expiresAt,
      manualProof: {
        imageUrl: proof.url,
        imagePublicId: proof.publicId,
        transactionId: payload.transactionId.trim(),
        senderNumber: payload.senderNumber?.trim() || null,
        uploadedAt: new Date(),
      },
    });

    order.payment = payment._id;
    await order.save();
    const populated = order.toObject();
    dispatchOrderPlacedEmails(populated, payment);
    return { order: toPublicOrder(populated, payment), payment };
  } catch (err) {
    if (order?._id) {
      await Order.findByIdAndDelete(order._id).catch(() => {});
    }
    if (proofPublicId) {
      await removePaymentProof(proofPublicId).catch(() => {});
    }
    throw err;
  }
};

export const getOrdersForUser = async (userId, { page, limit }) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);
  const paymentIds = orders.map((o) => o.payment).filter(Boolean);
  const payments = await Payment.find({ _id: { $in: paymentIds } }).lean();
  const paymentMap = new Map(payments.map((p) => [p._id.toString(), p]));
  return {
    orders: orders.map((o) => toPublicOrder(o, paymentMap.get(o.payment?.toString()) || null)),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getOrderForUser = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId }).lean();
  if (!order) return null;
  const payment = order.payment
    ? await Payment.findById(order.payment).lean()
    : null;
  return toPublicOrder(order, payment);
};

export const cancelOrderByUser = async (userId, orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId, status: ORDER_STATUS.PENDING_PAYMENT },
    { status: ORDER_STATUS.CANCELLED },
    { new: true }
  );
  if (!order) throw new Error('Order cannot be cancelled');
  if (order.payment) {
    await Payment.findByIdAndUpdate(order.payment, { status: PAYMENT_STATUS.REJECTED });
  }
  return toPublicOrder(order.toObject());
};

export const listOrdersForAdmin = async ({ status, page, limit }) => {
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'userName email')
      .lean(),
    Order.countDocuments(filter),
  ]);
  const paymentIds = orders.map((o) => o.payment).filter(Boolean);
  const payments = await Payment.find({ _id: { $in: paymentIds } }).lean();
  const paymentMap = new Map(payments.map((p) => [p._id.toString(), p]));
  return {
    orders: orders.map((o) => toAdminOrder(o, paymentMap.get(o.payment?.toString()) || null)),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getOrderForAdmin = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'userName email')
    .lean();
  if (!order) return null;
  const payment = order.payment
    ? await Payment.findById(order.payment).lean()
    : null;
  return toAdminOrder(order, payment);
};

export const approveOrderPayment = async (adminId, orderId, ipAddress) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: ORDER_STATUS.PAYMENT_UNDER_REVIEW },
    { status: ORDER_STATUS.PAID },
    { new: true }
  );
  if (!order) throw new Error('Order is not awaiting payment review');
  const payment = await Payment.findOneAndUpdate(
    { order: orderId, status: PAYMENT_STATUS.AWAITING_VERIFICATION },
    {
      status: PAYMENT_STATUS.SUCCEEDED,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
    { new: true }
  );
  if (!payment) throw new Error('Payment record not found');
  safeSend(sendPaymentApprovedEmail(order.toObject(), payment), 'payment-approved');
  return { order: toAdminOrder(order.toObject(), payment), audit: { adminId, orderId, ipAddress } };
};

export const rejectOrderPayment = async (adminId, orderId, reason, ipAddress) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: ORDER_STATUS.PAYMENT_UNDER_REVIEW },
    { status: ORDER_STATUS.REJECTED, rejectionReason: reason },
    { new: true }
  );
  if (!order) throw new Error('Order is not awaiting payment review');
  const payment = await Payment.findOneAndUpdate(
    { order: orderId, status: PAYMENT_STATUS.AWAITING_VERIFICATION },
    {
      status: PAYMENT_STATUS.REJECTED,
      rejectionReason: reason,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
    { new: true }
  );
  if (!payment) throw new Error('Payment record not found');
  safeSend(sendPaymentRejectedEmail(order.toObject(), payment, reason), 'payment-rejected');
  return { order: toAdminOrder(order.toObject(), payment), audit: { adminId, orderId, ipAddress } };
};

export const confirmCodPayment = async (adminId, orderId, ipAddress) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: ORDER_STATUS.PENDING_PAYMENT, paymentMethod: PAYMENT_METHOD.COD },
    { status: ORDER_STATUS.PAID },
    { new: true }
  );
  if (!order) throw new Error('COD order cannot be confirmed');
  const payment = await Payment.findOneAndUpdate(
    { order: orderId, status: PAYMENT_STATUS.PENDING },
    {
      status: PAYMENT_STATUS.SUCCEEDED,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
    { new: true }
  );
  safeSend(sendPaymentApprovedEmail(order.toObject(), payment), 'cod-confirmed');
  return { order: toAdminOrder(order.toObject(), payment), audit: { adminId, orderId, ipAddress } };
};

export const fulfillOrder = async (adminId, orderId, keys, adminNotes, ipAddress) => {
  const order = await Order.findOne({ _id: orderId, status: ORDER_STATUS.PAID }).lean();
  if (!order) throw new Error('Order must be paid before fulfillment');
  const titleMap = new Map(order.items.map((i) => [i.gameId, i.title]));
  const fulfillmentKeys = keys.map((k) => ({
    gameId: k.gameId,
    title: titleMap.get(k.gameId) || k.gameId,
    key: k.key,
    assignedAt: new Date(),
  }));
  const updated = await Order.findByIdAndUpdate(
    orderId,
    {
      status: ORDER_STATUS.FULFILLED,
      fulfillment: {
        status: FULFILLMENT_STATUS.COMPLETED,
        keys: fulfillmentKeys,
        fulfilledBy: adminId,
        fulfilledAt: new Date(),
        adminNotes: adminNotes || null,
      },
    },
    { new: true }
  ).lean();
  safeSend(sendOrderFulfilledEmail(updated, fulfillmentKeys), 'order-fulfilled');
  return { order: toAdminOrder(updated), audit: { adminId, orderId, ipAddress } };
};

export const cancelOrderByAdmin = async (adminId, orderId, ipAddress) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      status: { $in: [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.PAYMENT_UNDER_REVIEW] },
    },
    { status: ORDER_STATUS.CANCELLED },
    { new: true }
  );
  if (!order) throw new Error('Order cannot be cancelled');
  if (order.payment) {
    await Payment.findByIdAndUpdate(order.payment, { status: PAYMENT_STATUS.REJECTED });
  }
  return { order: toAdminOrder(order.toObject()), audit: { adminId, orderId, ipAddress } };
};

export const expireStaleOrders = async () => {
  const now = new Date();
  const staleOrders = await Order.find({
    status: { $in: [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.PAYMENT_UNDER_REVIEW] },
    expiresAt: { $lte: now },
    paymentMethod: { $in: [PAYMENT_METHOD.JAZZCASH, PAYMENT_METHOD.EASYPAISA] },
  }).lean();
  for (const order of staleOrders) {
    await Order.findByIdAndUpdate(order._id, { status: ORDER_STATUS.EXPIRED });
    const payment = order.payment
      ? await Payment.findByIdAndUpdate(order.payment, { status: PAYMENT_STATUS.EXPIRED }, { new: true })
      : null;
    if (payment?.manualProof?.imagePublicId) {
      await removePaymentProof(payment.manualProof.imagePublicId);
    }
    safeSend(sendOrderExpiredEmail(order, payment), 'order-expired');
  }
  return staleOrders.length;
};
