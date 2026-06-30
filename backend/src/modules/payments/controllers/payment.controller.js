import {
  manualPaymentValidator,
  parseMultipartBody,
} from '../validators/payment.validator.js';
import { placeManualPaymentOrder } from '../../orders/services/order.service.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', '),
  });

export const submitManualPayment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Payment proof image is required' });
    }
    let body;
    try {
      body = parseMultipartBody(req.body);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid billing or items data' });
    }
    const { error, value } = manualPaymentValidator(body);
    if (error) return joiError(res, error);
    const result = await placeManualPaymentOrder(req.user._id, value, req.file);
    return res.status(201).json({
      success: true,
      message: 'Payment submitted and is under review',
      data: result.order,
    });
  } catch (err) {
    console.log('Error in Submit Manual Payment : ', err.message);
    if (err.message === 'This transaction ID has already been used') {
      return res.status(409).json({ success: false, message: err.message });
    }
    if (err.message === 'Cloudinary is not configured') {
      return res.status(503).json({ success: false, message: 'Payment upload service is unavailable' });
    }
    if (err.message?.startsWith('Game not found')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to submit payment',
      error: err.message,
    });
  }
};

export const getPendingPayments = async (_req, res) => {
  try {
    const { listOrdersForAdmin } = await import('../../orders/services/order.service.js');
    const result = await listOrdersForAdmin({
      status: 'payment_under_review',
      page: 1,
      limit: 50,
    });
    return res.status(200).json({
      success: true,
      message: 'Pending payments fetched',
      data: result.orders,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    console.log('Error in Get Pending Payments : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending payments',
      error: err.message,
    });
  }
};
