'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    id: {
      type: DataTypes.STRING, // Kiểu dữ liệu của id là STRING
      primaryKey: true,       // Đặt làm khóa chính
      defaultValue: () => uuidv4(), // Tự động tạo UUID nếu không có giá trị
    },
    customerId: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    totalPrice: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};