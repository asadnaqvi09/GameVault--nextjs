import { v2 as cloudinary } from 'cloudinary';
import { logPayment, logPaymentError } from '../../../shared/utils/paymentDebug.util.js';

const isConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadPaymentProof = async (buffer, orderNumber) => {
  if (!isConfigured()) {
    logPaymentError('cloudinary_config', new Error('Cloudinary is not configured'), { orderNumber });
    throw new Error('Cloudinary is not configured');
  }
  logPayment('cloudinary_upload_stream_open', { orderNumber, bytes: buffer?.length ?? 0 });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `gamevault/payment-proofs/${orderNumber}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) {
          logPaymentError('cloudinary_upload_callback', error, {
            orderNumber,
            httpCode: error.http_code,
            cloudinaryMessage: error.message,
          });
          return reject(error);
        }
        logPayment('cloudinary_upload_callback_ok', {
          orderNumber,
          publicId: result.public_id,
        });
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

export const removePaymentProof = async (publicId) => {
  if (!publicId || !isConfigured()) return;
  await cloudinary.uploader.destroy(publicId);
};

export const uploadGameAsset = async (buffer, slug) => {
  if (!isConfigured()) {
    throw new Error('Cloudinary is not configured');
  }
  const folderSlug = String(slug || 'draft').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'draft';
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `gamevault/games/${folderSlug}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};
