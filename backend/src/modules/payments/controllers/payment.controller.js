import {
  manualPaymentValidator,
  parseMultipartBody,
} from '../validators/payment.validator.js';
import { placeManualPaymentOrder } from '../../orders/services/order.service.js';
import {
  buildPaymentDebug,
  getCloudinaryInfo,
  getRuntimeEmailInfo,
  logPayment,
  logPaymentError,
} from '../../../shared/utils/paymentDebug.util.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', '),
  });

export const submitManualPayment = async (req, res) => {
  const requestId = `mp-${Date.now()}`;
  try {
    logPayment('request_start', {
      requestId,
      userId: req.user?._id?.toString(),
      email: getRuntimeEmailInfo(),
      cloudinary: getCloudinaryInfo(),
      filePresent: Boolean(req.file),
      fileSize: req.file?.size ?? 0,
      fileMime: req.file?.mimetype ?? null,
    });

    if (!req.file) {
      logPayment('validation_failed', { requestId, reason: 'missing_proof_file' });
      return res.status(400).json({ success: false, message: 'Payment proof image is required' });
    }

    let body;
    try {
      body = parseMultipartBody(req.body);
    } catch (parseErr) {
      logPaymentError('parse_multipart', parseErr, { requestId });
      return res.status(400).json({ success: false, message: 'Invalid billing or items data' });
    }

    const { error, value } = manualPaymentValidator(body);
    if (error) {
      logPayment('validation_failed', {
        requestId,
        reason: 'joi',
        details: error.details.map((e) => e.message),
      });
      return joiError(res, error);
    }

    logPayment('validation_ok', {
      requestId,
      paymentMethod: value.paymentMethod,
      transactionId: value.transactionId,
      itemCount: value.items?.length ?? 0,
    });

    const result = await placeManualPaymentOrder(req.user._id, value, req.file, requestId);

    logPayment('request_success', {
      requestId,
      orderNumber: result.order?.orderNumber,
      orderId: result.order?.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Payment submitted and is under review',
      data: result.order,
    });
  } catch (err) {
    const debug = buildPaymentDebug(err, { requestId });
    logPaymentError(debug.step || 'submit_manual_payment', err, debug);

    if (err.message === 'This transaction ID has already been used') {
      return res.status(409).json({ success: false, message: err.message, debug });
    }
    if (err.message === 'Cloudinary is not configured') {
      return res.status(503).json({
        success: false,
        message: 'Payment upload service is unavailable',
        debug,
      });
    }
    if (err.message?.startsWith('Game not found')) {
      return res.status(400).json({ success: false, message: err.message, debug });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to submit payment',
      error: err.message,
      debug,
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
