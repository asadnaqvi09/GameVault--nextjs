const TAG = '[manual-payment]';

export const getRuntimeEmailInfo = () => ({
  provider: 'nodemailer',
  resendKeyOnServer: Boolean(process.env.RESEND_API_KEY),
  smtpConfigured: Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ),
});

export const getCloudinaryInfo = () => ({
  configured: Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
});

export const logPayment = (step, meta = {}) => {
  console.log(TAG, step, JSON.stringify(meta));
};

export const logPaymentError = (step, err, meta = {}) => {
  console.error(
    TAG,
    'FAILED',
    step,
    JSON.stringify({
      ...meta,
      errorName: err?.name || null,
      errorMessage: err?.message || String(err),
      httpCode: err?.http_code ?? err?.statusCode ?? null,
    })
  );
};

export const classifyPaymentError = (err) => {
  const message = String(err?.message || '');
  const lower = message.toLowerCase();
  const httpCode = err?.http_code ?? err?.statusCode ?? null;
  const failedStep = err?.failedStep || null;

  if (failedStep === 'cloudinary_upload') {
    return {
      source: 'cloudinary',
      step: failedStep,
      hint: `Cloudinary upload failed: ${message}`,
    };
  }

  if (message === 'Cloudinary is not configured') {
    return {
      source: 'cloudinary',
      step: 'upload_proof',
      hint: 'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET missing on Render',
    };
  }

  if (httpCode === 401 || httpCode === 403 || lower.includes('cloudinary')) {
    return {
      source: 'cloudinary',
      step: 'upload_proof',
      hint: `Cloudinary rejected upload (http ${httpCode || 'unknown'}). Verify API secret and account status`,
    };
  }

  if (lower.includes('unexpected status code') && lower.includes('403')) {
    return {
      source: 'external-http-403',
      step: 'unknown',
      hint:
        '403 from external API. If /api/v1/health has no email.provider field, Render is running OLD Resend code. If health shows nodemailer, this is likely Cloudinary credentials',
    };
  }

  if (message === 'This transaction ID has already been used') {
    return { source: 'database', step: 'duplicate_transaction', hint: 'Transaction ID already exists' };
  }

  if (lower.startsWith('game not found')) {
    return { source: 'database', step: 'resolve_items', hint: message };
  }

  if (lower.includes('eauth') || lower.includes('invalid login') || lower.includes('smtp')) {
    return {
      source: 'nodemailer',
      step: 'email',
      hint: 'SMTP auth failed. Checkout should still succeed; fix SMTP_USER/SMTP_PASS on Render',
    };
  }

  return {
    source: 'unknown',
    step: failedStep || 'unknown',
    hint: message || 'Unhandled payment error',
  };
};

export const buildPaymentDebug = (err, extra = {}) => ({
  ...extra,
  ...classifyPaymentError(err),
  errorMessage: err?.message || null,
  httpCode: err?.http_code ?? err?.statusCode ?? null,
  email: getRuntimeEmailInfo(),
  cloudinary: getCloudinaryInfo(),
});
