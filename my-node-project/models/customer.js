'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');


module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    id: {
      type: DataTypes.STRING, // Kiểu dữ liệu của id là STRING
      primaryKey: true,       // Đặt làm khóa chính
      defaultValue: () => uuidv4(), // Tự động tạo UUID nếu không có giá trị
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};