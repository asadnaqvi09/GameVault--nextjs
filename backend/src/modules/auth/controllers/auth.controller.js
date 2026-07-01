import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import AuditLog from '../../../shared/models/auditLog.model.js';
import { generateRecoveryKey } from '../../../shared/utils/crypto.util.js';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/token.util.js';
import { sendRecoveryEmail } from '../../../shared/utils/sendEmail.util.js';
import { refreshTokenCookieOptions, clearRefreshTokenCookieOptions } from '../../../shared/utils/cookie.util.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await AuditLog.create({
      user: user._id,
      action: 'USER_GET_ME',
      ipAddress: req.ip,
      details: 'User data fetched successfully'
    });
    res.status(200).json({
      message: 'User data fetched successfully',
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log("Error in GetMe Controller : ", error.message);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};

export const register = async (req, res) => {
  const { userName, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const rawRecoveryKey = generateRecoveryKey();
    const user = await User.create({
      userName,
      email,
      password,
      recoveryKey: rawRecoveryKey,
      role: "User"
    });
    await sendRecoveryEmail(user.email, user.userName, rawRecoveryKey);
    console.log(`Recovery Email Send Success Check Your Email ${user.email}`);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    await AuditLog.create({
      user: user._id,
      action: 'USER_REGISTRATION',
      ipAddress: req.ip,
      details: 'Account created and recovery key emailed successfully'
    });
    res.status(201).json({
      message: 'Registration successful',
      accessToken
    });
  } catch (error) {
    console.log("Error in RegisterController : ", error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await AuditLog.create({
        action: 'FAILED_LOGIN_ATTEMPT',
        ipAddress: req.ip,
        details: `Failed attempt for email: ${email}`
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    await AuditLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      ipAddress: req.ip,
      details: 'Successful authentication'
    });
    res.json({ accessToken });
  } catch (error) {
    console.log("Error in LoginController : ", error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ message: 'No refresh token' });
  const oldRefreshToken = cookies.refreshToken;
  res.clearCookie('refreshToken', clearRefreshTokenCookieOptions);
  try {
    const foundToken = await Token.findOne({ token: oldRefreshToken });
    if (!foundToken || foundToken.isRevoked || foundToken.expiresAt < new Date()) {
      if (foundToken) {
        await Token.updateMany({ user: foundToken.user }, { isRevoked: true });
        await AuditLog.create({
          user: foundToken.user,
          action: 'TOKEN_REUSE_DETECTED',
          ipAddress: req.ip,
          details: 'Potential token theft breach attempt'
        });
      }
      return res.status(403).json({ message: 'Invalid or expired refresh session' });
    }
    const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    foundToken.isRevoked = true;
    await foundToken.save();
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await Token.create({
      user: user._id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);
    res.json({ accessToken });
  } catch (error) {
    console.log("Error in RefreshToken : ", error.message);
    return res.status(403).json({ message: 'Token token verification failed' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, recoveryKey, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or recovery key' });
    }
    const isKeyValid = await bcrypt.compare(recoveryKey, user.recoveryKey);
    if (!isKeyValid) {
      await AuditLog.create({
        user: user._id,
        action: 'FAILED_PASSWORD_RESET',
        ipAddress: req.ip,
        details: 'Incorrect recovery key match attempt'
      });
      return res.status(401).json({ message: 'Invalid email or recovery key' });
    }
    user.password = newPassword;
    await user.save();
    await Token.deleteMany({ user: user._id });
    await AuditLog.create({
      user: user._id,
      action: 'SUCCESSFUL_PASSWORD_RESET',
      ipAddress: req.ip,
      details: 'Password modified using recovery key. All prior sessions cleared.'
    });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log("Error in ResetPassword Controller : ", error.message);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204);
  const refreshToken = cookies.refreshToken;
  try {
    await Token.deleteOne({ token: refreshToken });
    res.clearCookie('refreshToken', clearRefreshTokenCookieOptions);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log("Error in Logout Controller : ", error.message);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
