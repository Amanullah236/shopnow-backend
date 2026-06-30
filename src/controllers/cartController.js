const { Cart, Product } = require('../models');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await Cart.create({ 
        userId: req.user.id, 
        items: [],
        totalAmount: 0,
      });
    }

    // Populate product details
    if (cart.items && cart.items.length > 0) {
      const productIds = cart.items.map(item => item.product);
      const products = await Product.findAll({
        where: { id: productIds },
        attributes: ['id', 'name', 'price', 'images', 'stock'],
      });

      // Map products to cart items
      const itemsWithDetails = cart.items.map(item => {
        const product = products.find(p => p.id === item.product);
        return {
          ...item,
          productDetails: product,
        };
      });

      cart.dataValues.itemsWithDetails = itemsWithDetails;
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Update items
    const items = cart.items || [];
    const itemIndex = items.findIndex(item => item.product === productId);

    if (itemIndex > -1) {
      items[itemIndex].quantity += quantity;
    } else {
      items.push({
        product: productId,
        quantity,
        price: parseFloat(product.price),
      });
    }

    // Calculate total
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.items = items;
    cart.totalAmount = totalAmount;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const items = cart.items || [];
    const itemIndex = items.findIndex(item => item.product === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }

    // Calculate total
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.items = items;
    cart.totalAmount = totalAmount;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const items = (cart.items || []).filter(item => item.product !== productId);

    // Calculate total
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.items = items;
    cart.totalAmount = totalAmount;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};