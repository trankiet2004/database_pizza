'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thay đổi kiểu dữ liệu cột id trong bảng Employees
    await queryInterface.changeColumn('Employees', 'id', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });

    // Thay đổi kiểu dữ liệu cột id trong các bảng khác
    await queryInterface.changeColumn('Chefs', 'id', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });

    // Cập nhật khóa ngoại nếu có
    await queryInterface.changeColumn('Chefs', 'employeeId', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    // Đổi lại kiểu dữ liệu thành INTEGER nếu rollback
    await queryInterface.changeColumn('Employees', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.changeColumn('Chefs', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.changeColumn('Chefs', 'employeeId', {
      type: Sequelize.INTEGER,
    });
  },
};
