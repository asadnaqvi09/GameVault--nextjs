import AuditLog from '../../../shared/models/auditLog.model.js';
import {
  createOrderValidator,
  rejectOrderValidator,
  fulfillOrderValidator,
  adminListValidator,
  userListValidator,
} from '../validators/order.validator.js';
import {
  placeCodOrder,
  getOrdersForUser,
  getOrderForUser,
  cancelOrderByUser,
  listOrdersForAdmin,
  getOrderForAdmin,
  approveOrderPayment,
  rejectOrderPayment,
  confirmCodPayment,
  fulfillOrder,
  cancelOrderByAdmin,
} from '../services/order.service.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', '),
  });

const logAdminAction = async (adminId, action, details, ipAddress) => {
  await AuditLog.create({
    user: adminId,
    action,
    ipAddress,
    details,
  });
};

export const createCodOrder = async (req, res) => {
  try {
    const { error, value } = createOrderValidator(req.body);
    if (error) return joiError(res, error);
    const result = await placeCodOrder(req.user._id, value);
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Create COD Order : ', err.message);
    if (err.message?.startsWith('Game not found')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: err.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { error, value } = userListValidator(req.query);
    if (error) return joiError(res, error);
    const result = await getOrdersForUser(req.user._id, value);
    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: result.orders,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    console.log('Error in Get My Orders : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: err.message,
    });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const order = await getOrderForUser(req.user._id, req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (err) {
    console.log('Error in Get My Order : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: err.message,
    });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const order = await cancelOrderByUser(req.user._id, req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (err) {
    console.log('Error in Cancel Order : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'Order cannot be cancelled',
    });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const { error, value } = adminListValidator(req.query);
    if (error) return joiError(res, error);
    const result = await listOrdersForAdmin(value);
    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: result.orders,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    console.log('Error in Get Admin Orders : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: err.message,
    });
  }
};

export const getAdminOrderById = async (req, res) => {
  try {
    const order = await getOrderForAdmin(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (err) {
    console.log('Error in Get Admin Order : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: err.message,
    });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const result = await approveOrderPayment(req.user._id, req.params.id, req.ip);
    await logAdminAction(
      req.user._id,
      'ORDER_PAYMENT_APPROVED',
      `Order approved. Expected amount: ${result.order.expectedAmount} ${result.order.currency}`,
      req.ip
    );
    return res.status(200).json({
      success: true,
      message: 'Payment approved successfully',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Approve Payment : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'Payment could not be approved',
    });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { error, value } = rejectOrderValidator(req.body);
    if (error) return joiError(res, error);
    const result = await rejectOrderPayment(req.user._id, req.params.id, value.reason, req.ip);
    await logAdminAction(
      req.user._id,
      'ORDER_PAYMENT_REJECTED',
      `Order rejected. Reason: ${value.reason}`,
      req.ip
    );
    return res.status(200).json({
      success: true,
      message: 'Payment rejected',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Reject Payment : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'Payment could not be rejected',
    });
  }
};

export const confirmCod = async (req, res) => {
  try {
    const result = await confirmCodPayment(req.user._id, req.params.id, req.ip);
    await logAdminAction(
      req.user._id,
      'ORDER_COD_CONFIRMED',
      `COD confirmed for order ${result.order.orderNumber}`,
      req.ip
    );
    return res.status(200).json({
      success: true,
      message: 'COD payment confirmed',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Confirm COD : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'COD order could not be confirmed',
    });
  }
};

export const fulfillOrderKeys = async (req, res) => {
  try {
    const { error, value } = fulfillOrderValidator(req.body);
    if (error) return joiError(res, error);
    const result = await fulfillOrder(
      req.user._id,
      req.params.id,
      value.keys,
      value.adminNotes,
      req.ip
    );
    await logAdminAction(
      req.user._id,
      'ORDER_FULFILLED',
      `Order ${result.order.orderNumber} fulfilled with ${value.keys.length} key(s)`,
      req.ip
    );
    return res.status(200).json({
      success: true,
      message: 'Order fulfilled successfully',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Fulfill Order : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'Order could not be fulfilled',
    });
  }
};

export const adminCancelOrder = async (req, res) => {
  try {
    const result = await cancelOrderByAdmin(req.user._id, req.params.id, req.ip);
    await logAdminAction(
      req.user._id,
      'ORDER_CANCELLED_BY_ADMIN',
      `Order ${result.order.orderNumber} cancelled`,
      req.ip
    );
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Admin Cancel Order : ', err.message);
    return res.status(409).json({
      success: false,
      message: err.message || 'Order could not be cancelled',
    });
  }
};
