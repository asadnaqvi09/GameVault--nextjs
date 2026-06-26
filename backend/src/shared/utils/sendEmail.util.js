import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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
