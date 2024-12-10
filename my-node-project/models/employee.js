'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Import thư viện tạo UUID

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      // Ví dụ: Employee.hasOne(models.Chef, { foreignKey: 'employeeId' });
    }
  }

  Employee.init(
    {
      id: {
        type: DataTypes.STRING, // Chuyển từ INTEGER sang STRING
        primaryKey: true, // Đặt làm khóa chính
        defaultValue: () => uuidv4(), // Tự động tạo UUID khi thêm bản ghi mới
      },
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      position: DataTypes.STRING,
      salary: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Employee',
    }
  );

  return Employee;
};
