const { User } = require('../models');

// Get all users (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single user (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.update(req.body);

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    const addresses = user.addresses || [];

    // If this is set as default, remove default from others
    if (req.body.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(req.body);
    user.addresses = addresses;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addresses = user.addresses || [];
    const addressIndex = addresses.findIndex(addr => addr.id === req.params.addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If this is set as default, remove default from others
    if (req.body.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses[addressIndex] = { ...addresses[addressIndex], ...req.body };
    user.addresses = addresses;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addresses = (user.addresses || []).filter(addr => addr.id !== req.params.addressId);
    
    user.addresses = addresses;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};