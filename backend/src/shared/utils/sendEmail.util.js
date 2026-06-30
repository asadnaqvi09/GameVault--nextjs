import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const mailFrom = process.env.MAIL_FROM || 'GameVault <onboarding@resend.dev>';

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const sendContactAdminEmail = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error('ADMIN_EMAIL is not configured');
  const fullName = `${contact.firstName} ${contact.lastName}`;
  await resend.emails.send({
    from: mailFrom,
    to: adminEmail,
    replyTo: contact.email,
    subject: `New Contact Message from ${fullName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">New Contact Submission</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;"><strong>Submitted:</strong> ${contact.createdAt.toUTCString()}</p>
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px;">
          <p style="color: #2d3748; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(contact.message)}</p>
        </div>
      </div>
    `
  });
};

export const sendContactAutoReply = async (contact) => {
  await resend.emails.send({
    from: mailFrom,
    to: contact.email,
    subject: 'We received your message - GameVault',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 12px;">Hello, ${escapeHtml(contact.firstName)}!</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thank you for reaching out to GameVault. We have received your message and our team will get back to you as soon as possible.
        </p>
        <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0;">
          This is an automated response. Please do not reply to this email unless you need to add more details to your inquiry.
        </p>
      </div>
    `
  });
};

const formatMoney = (amount, currency = 'PKR') =>
  `${currency} ${Number(amount).toLocaleString('en-PK')}`;

const orderSummaryBlock = (order) => {
  const items = order.items
    .map((i) => `<li style="margin: 4px 0;">${escapeHtml(i.title)} × ${i.quantity} — ${formatMoney(i.price * i.quantity, order.currency)}</li>`)
    .join('');
  return `
    <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
    <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Total:</strong> ${formatMoney(order.total, order.currency)}</p>
    <ul style="color: #4a4a4a; font-size: 14px; padding-left: 20px; margin: 12px 0;">${items}</ul>
  `;
};

export const sendOrderPlacedUserEmail = async (order, payment) => {
  const name = order.billingDetails.firstName;
  const isManual = payment?.method === 'jazzcash' || payment?.method === 'easypaisa';
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Order ${order.orderNumber} received — GameVault`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">Hello, ${escapeHtml(name)}!</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          ${isManual
            ? 'We received your order and payment proof. Our team will verify your payment shortly.'
            : 'Your cash on delivery order has been placed. We will confirm once payment is collected.'}
        </p>
        ${orderSummaryBlock(order)}
        <p style="color: #718096; font-size: 14px; margin: 16px 0 0;">Track your order anytime from your profile page.</p>
      </div>
    `
  });
};

export const sendOrderPlacedAdminEmail = async (order, payment) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  const fullName = `${order.billingDetails.firstName} ${order.billingDetails.lastName}`;
  const methodLabel = payment?.method?.toUpperCase() || order.paymentMethod?.toUpperCase();
  await resend.emails.send({
    from: mailFrom,
    to: adminEmail,
    replyTo: order.billingDetails.email,
    subject: `[${methodLabel}] Order ${order.orderNumber} — ${formatMoney(order.total, order.currency)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">New Order Submission</h2>
        <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Customer:</strong> ${escapeHtml(fullName)}</p>
        <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(order.billingDetails.email)}</p>
        <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Method:</strong> ${escapeHtml(methodLabel)}</p>
        <p style="color: #e53e3e; font-size: 18px; font-weight: bold; margin: 16px 0;">Expected amount: ${formatMoney(order.total, order.currency)}</p>
        ${orderSummaryBlock(order)}
        ${payment?.manualProof?.transactionId ? `<p style="color: #4a4a4a; font-size: 15px;"><strong>Transaction ID:</strong> ${escapeHtml(payment.manualProof.transactionId)}</p>` : ''}
      </div>
    `
  });
};

export const sendPaymentUnderReviewEmail = async (order, payment) => {
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Payment under review — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">Payment Under Review</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Your ${escapeHtml(payment.method)} payment for order <strong>${escapeHtml(order.orderNumber)}</strong> is being verified.
        </p>
        <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Amount:</strong> ${formatMoney(order.total, order.currency)}</p>
        <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 8px;"><strong>Transaction ID:</strong> ${escapeHtml(payment.manualProof?.transactionId || '')}</p>
        <p style="color: #718096; font-size: 14px; margin: 16px 0 0;">You will receive another email once verification is complete.</p>
      </div>
    `
  });
};

export const sendPaymentApprovedEmail = async (order, payment) => {
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Payment approved — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #16a34a; margin: 0 0 16px;">Payment Approved</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Your payment of <strong>${formatMoney(order.total, order.currency)}</strong> for order <strong>${escapeHtml(order.orderNumber)}</strong> has been approved.
        </p>
        <p style="color: #718096; font-size: 14px; margin: 0;">Your game keys will be delivered shortly. Check your profile for updates.</p>
      </div>
    `
  });
};

export const sendPaymentRejectedEmail = async (order, _payment, reason) => {
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Payment declined — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #e53e3e; margin: 0 0 16px;">Payment Declined</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Unfortunately we could not verify your payment for order <strong>${escapeHtml(order.orderNumber)}</strong>.
        </p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="color: #991b1b; font-size: 15px; margin: 0; white-space: pre-wrap;">${escapeHtml(reason)}</p>
        </div>
        <p style="color: #718096; font-size: 14px; margin: 0;">You can place a new order with a valid payment proof from your profile.</p>
      </div>
    `
  });
};

export const sendOrderFulfilledEmail = async (order, keys) => {
  const keyBlocks = keys
    .map(
      (k) => `
        <div style="background: #f7fafc; border: 1px dashed #cbd5e0; padding: 12px; border-radius: 6px; margin: 8px 0;">
          <p style="color: #2d3748; font-size: 13px; margin: 0 0 4px; font-weight: bold;">${escapeHtml(k.title)}</p>
          <p style="color: #1a1a1a; font-size: 16px; margin: 0; font-family: monospace; letter-spacing: 1px;">${escapeHtml(k.key)}</p>
        </div>
      `
    )
    .join('');
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Your game keys — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">Order Fulfilled</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Your order <strong>${escapeHtml(order.orderNumber)}</strong> is complete. Here are your game keys:
        </p>
        ${keyBlocks}
        <p style="color: #718096; font-size: 14px; margin: 16px 0 0;">Keys are also available on your profile page.</p>
      </div>
    `
  });
};

export const sendOrderExpiredEmail = async (order, _payment) => {
  await resend.emails.send({
    from: mailFrom,
    to: order.billingDetails.email,
    subject: `Order expired — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">Order Expired</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Order <strong>${escapeHtml(order.orderNumber)}</strong> expired because payment was not verified in time.
        </p>
        <p style="color: #718096; font-size: 14px; margin: 0;">Please place a new order if you still wish to purchase.</p>
      </div>
    `
  });
};

export const sendRecoveryEmail = async (email, userName, recoveryKey) => {
  await resend.emails.send({
    from: 'GameVault Security <onboarding@resend.dev>',
    to: email,
    subject: 'Your Account Recovery Key',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin-bottom: 5px;">Hello, ${userName}!</h2>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">
          Thank you for registering. Below is your unique account recovery key. 
        </p>
        <p style="color: #e53e3e; font-weight: bold; font-size: 14px;">
          Keep this key safe! You will need it to reset your password if you are ever locked out.
        </p>
        <div style="background: #f7fafc; border: 1px dashed #cbd5e0; padding: 15px; text-align: center; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 2px; margin: 20px 0; color: #2d3748; border-radius: 4px;">
          ${recoveryKey}
        </div>
        <p style="color: #718096; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          If you did not create this account, please ignore this email.
        </p>
      </div>
    `
  });
};
