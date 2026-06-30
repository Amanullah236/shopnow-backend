const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = this.generateToken(user.id);

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};