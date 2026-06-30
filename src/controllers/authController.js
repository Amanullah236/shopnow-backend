const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const nodemailer = require('nodemailer');

const otpStore = new Map();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone };

    console.log('Login successful:', userResponse);
    res.status(200).json({ success: true, token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log('Register attempt:', { name, email, phone });

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user.id);
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone };

    console.log('Register successful:', userResponse);
    res.status(201).json({ success: true, token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user)
    console.log('req.body:', req.body)
    const { name, phone, avatar } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    const updatedUser = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current password and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user.id);
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone };

    res.status(200).json({ success: true, message: 'Password changed successfully', token, user: userResponse });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expiry });
    console.log(`OTP for ${email}: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: `"ShopNow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - ShopNow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; 
          background: #0a0a0f; color: white; padding: 40px; border-radius: 16px; 
          border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="color: white; text-align: center; font-size: 32px; margin-bottom: 8px;">🛍️ ShopNow</h1>
          <h2 style="color: #60a5fa; text-align: center; font-size: 20px;">Password Reset OTP</h2>
          <p style="color: #9ca3af; text-align: center;">Your OTP code is:</p>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); 
            border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
            <span style="font-size: 52px; font-weight: bold; letter-spacing: 10px; color: white;">${otp}</span>
          </div>
          <p style="color: #9ca3af; text-align: center; font-size: 14px;">
            This OTP expires in <strong style="color: white;">10 minutes</strong>
          </p>
          <p style="color: #6b7280; text-align: center; font-size: 12px; margin-top: 20px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Check email configuration.' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please request again.' });
    }
    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request again.' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please request again.' });
    }
    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request again.' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    otpStore.delete(email);

    console.log('Password reset successful for:', email);
    res.status(200).json({ success: true, message: 'Password reset successfully. Please login with new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};