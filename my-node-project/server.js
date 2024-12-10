require('dotenv').config(); // Đọc biến môi trường từ file .env
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import models để kết nối Sequelize
const app = express();

// Middleware
app.use(cors()); // Cho phép API hoạt động với các nguồn khác nhau (CORS)
app.use(express.json()); // Parse body các request có dạng JSON

// Routes (định nghĩa các route chính)
const employeeRoutes = require('./routes/employee'); // Route cho Employee
const chefRoutes = require('./routes/chef');         // Route cho Chef
const customerRoutes = require('./routes/customer');
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/chefs', chefRoutes);

// Kết nối database và chạy server
const PORT = process.env.PORT || 5000;

db.sequelize
  .authenticate() // Kiểm tra kết nối database
  .then(() => {
    console.log('Database connected...');
    return db.sequelize.sync(); // Sync models với database
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });