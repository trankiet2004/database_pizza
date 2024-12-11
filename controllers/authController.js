const Employee = require('../model/employee.js');

const employe = Employee.getInstance();

exports.register = async (req, res) => {
    try {
        const { name, phone, birth_date, chef_flag, username, password } = req.body;
        const employeeId = await employe.addEmployee(name, phone, birth_date, chef_flag, username, password);
        res.json({ message: `Đăng ký thành công! ${username}`, employee_id: employeeId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            res.status(400).json({ message: 'Tên đăng nhập hoặc số điện thoại đã tồn tại.' });
        } else {
            res.status(500).json({ message: 'Đã xảy ra lỗi.', error });
        }
    }
};
exports.login = async (req,res) => {
    try {
        const { username, password } = req.body;
        const employee = await employe.checkEmployee(username,password);
        res.json({message: `Đăng nhập thành công! ${username}`, nhanvien: employee});
    } catch (err) {
        res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }
}
