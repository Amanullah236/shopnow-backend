const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'cod', 'paypal'),
    allowNull: false,
  },
  paymentResult: {
    type: DataTypes.JSON,
  },
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  orderStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      if (!order.orderNumber) {
        const count = await Order.count();
        order.orderNumber = `ORD-${Date.now()}-${count + 1}`;
      }
    },
  },
});

module.exports = Order;