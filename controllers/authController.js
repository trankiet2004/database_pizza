const Employees = require('../model/employee');
const employee = Employees.getInstance();

exports.register = async (req, res) => {
    try {
        const { name, phone, birth_date, chef_flag, username, password } = req.body;
        var isChef = (chef_flag === "FALSE") ? 0 : 1;
        const employeeId = await employee.addEmployee(name, phone, birth_date, isChef, username, password);
        res.json({ message: `Đăng ký thành công! ${username}`, employee_id: employeeId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            res.status(400).json({ message: 'Tên đăng nhập hoặc số điện thoại đã tồn tại.' });
        } else {
            res.status(500).json({ message: `Đã xảy ra lỗi.`, error });
        }
    }
};