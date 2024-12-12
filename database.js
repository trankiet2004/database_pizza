const sql = require('mssql');

// Cấu hình kết nối SQL Server
const config = {
  user: 'sa',                      // Tên người dùng SQL Server
  password: 'TrunTrun_TramCam3004',       // Mật khẩu người dùng
  server: 'truntrun.ddns.net',   // IP hoặc hostname của SQL Server
  database: 'TUANEMTRAMTINH',  // Tên cơ sở dữ liệu
  options: {
    encrypt: false,                // Đặt false nếu không dùng SSL
    trustServerCertificate: true,  // Bypass SSL nếu không dùng chứng chỉ
  },
};

module.exports = config;
