import crypto from 'crypto';

export const generateRecoveryKey = () => {
  return crypto.randomBytes(16).toString('hex').match(/.{1,4}/g).join('-');
};
