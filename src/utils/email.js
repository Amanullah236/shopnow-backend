const nodemailer = require('nodemailer');

// Send OTP Email
exports.sendOTPEmail = async (email, otp, userName) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ShopNow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - ShopNow',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .otp-box {
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              font-size: 32px;
              font-weight: bold;
              padding: 20px;
              border-radius: 10px;
              letter-spacing: 8px;
              margin: 30px 0;
              display: inline-block;
            }
            .message {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              color: #ef4444;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              background: #f9f9f9;
              padding: 20px;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p class="message">Hello ${userName},</p>
              <p class="message">We received a request to reset your password. Use the OTP below to reset your password:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">This OTP is valid for <strong>10 minutes</strong>.</p>
              <p class="warning">⚠️ If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2026 ShopNow. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Generate OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};