import { v2 as cloudinary } from 'cloudinary';

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
    throw new Error('Cloudinary is not configured');
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `gamevault/payment-proofs/${orderNumber}`,
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
