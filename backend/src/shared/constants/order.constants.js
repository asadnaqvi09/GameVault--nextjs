export const PAYMENT_METHOD = {
  COD: 'cod',
  JAZZCASH: 'jazzcash',
  EASYPAISA: 'easypaisa',
};

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_UNDER_REVIEW: 'payment_under_review',
  PAID: 'paid',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  AWAITING_VERIFICATION: 'awaiting_verification',
  SUCCEEDED: 'succeeded',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const FULFILLMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const ORDER_EXPIRY_HOURS = 48;
export const CURRENCY = 'PKR';
