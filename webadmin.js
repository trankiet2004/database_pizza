const express =require('express');
const app = express();
const cors=require('cors');
// const sql = require('mssql');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/Front_End`));

const {sql,config} = require('./config/db'); // Kết nối từ tệp db.js
const authRoutes = require('./routes/auth');
const shiftRoutes = require('./routes/shift');


app.use('/', authRoutes);
app.use('/shift', shiftRoutes); // shift

app.get('/pizza', async (req, res) => {
    try {
        //const Kich_co = ''
        const pool = await sql.connect(config);
        const result = await pool.request()
        //.input('KichCo', sql.NVarChar, Kich_co) // Truyền tham số an toàn
        .execute('ViewLuaChonThucDonDetails'); // Gọi stored procedure

        res.json(result.recordset);
  
    } catch (err) {
      console.error('Lỗi:', err.message);
      res.status(500).send('Đã xảy ra lỗi');
    }
});

app.get('/pizza/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('ID_mon', sql.NVarChar, id) // Truyền tham số an toàn
        .execute('FindMonAnDetails'); // Gọi stored procedure
        res.status(200).json(result.recordset);
    }
    catch(err){
      console.error('L��i:', err.message);
      res.status(500).send('Đã xảy ra l��i');
    }
});

app.post('/pizza', async(req, res) => {
    try {
        const { TenThucDon, gia,loai, pizza_flag,Thucuong_flag,Kich_co,loai_mon } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('Ten_mon', sql.NVarChar, (TenThucDon))
        .input('GiaTien',sql.NVarChar, (gia))
        .input('Loai',sql.NVarChar,(loai))
        .input('Pizza_flag', sql.NVarChar,(pizza_flag))
        .input('Thuc_uong_flag', sql.NVarChar,(Thucuong_flag))
        .input('Kich_co',sql.NVarChar,(Kich_co))
        .input('Loai_mon',sql.NVarChar,(loai_mon))
        .execute('AddLuaChonThucDon')
        res.json(result.recordset);
    }
    catch(err){
      console.error('Lỗi:', err.message);
      res.status(500).send('Đã xảy ra lỗi');
    }
});

app.post('/add-mon-an-to-combo', async (req, res) => {
    const { ID_Combo, ID_MonAn, SoLuong } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!ID_Combo || !ID_MonAn || SoLuong == null) {
            return res.status(400).send({ message: 'Thiếu dữ liệu bắt buộc: ID_Combo, ID_MonAn hoặc SoLuong.' });
        }
        let pool = await sql.connect(config);
        await pool.request()
            .input('ID_Combo', sql.NVarChar(10), ID_Combo)
            .input('ID_MonAn', sql.NVarChar(10), ID_MonAn)
            .input('SoLuong', sql.Int, SoLuong)
            .execute('AddMonAnToCombo');

        res.status(200).send({ message: 'Món ăn đã được thêm hoặc cập nhật thành công trong combo.' });
    } catch (error) {
        console.error('Lỗi khi thêm món ăn vào combo:', error);
        res.status(500).send({ message: 'Lỗi khi thêm món ăn vào combo.', error: error.message });
    }
});

app.post('/add-multiple-nguyen-lieu', async (req, res) => {
    const { NguyenLieuList } = req.body;

    if (!Array.isArray(NguyenLieuList) || NguyenLieuList.length === 0) {
        return res.status(400).send({ message: 'Danh sách nguyên liệu không hợp lệ hoặc rỗng.' });
    }

    try {
        let pool = await sql.connect(config);

        // Tạo bảng tạm cho danh sách nguyên liệu
        const table = new sql.Table();
        table.columns.add('Ten_nguyen_lieu', sql.NVarChar(255));
        table.columns.add('Gia_mua', sql.Decimal(10, 2));
        table.columns.add('Nguon_mua', sql.NVarChar(255));
        table.columns.add('Han_su_dung', sql.Date);
        table.columns.add('So_luong_ton_kho', sql.Int);
        table.columns.add('So_luong_ban_dau', sql.Int);
        table.columns.add('Ton_kho_toi_thieu', sql.Int);
        table.columns.add('Ngay_mua', sql.Date);

        NguyenLieuList.forEach(item => {
            table.rows.add(
                item.Ten_nguyen_lieu,
                item.Gia_mua,
                item.Nguon_mua,
                item.Han_su_dung,
                item.So_luong_ton_kho,
                item.So_luong_ban_dau,
                item.Ton_kho_toi_thieu,
                item.Ngay_mua
            );
        });
        await pool.request()
            .input('NguyenLieuList', table)
            .execute('AddMultipleNguyenLieu');

        res.status(200).send({ message: 'Thêm danh sách nguyên liệu thành công.' });
    } catch (error) {
        console.error('Lỗi khi thêm danh sách nguyên liệu:', error);
        res.status(500).send({ message: 'Lỗi khi thêm danh sách nguyên liệu.', error: error.message });
    }
});

app.post('/add-nguyen-lieu', async (req, res) => {
    const {
        Ten_nguyen_lieu,
        Gia_mua,
        Nguon_mua,
        Han_su_dung,
        So_luong_ton_kho,
        So_luong_ban_dau,
        Ton_kho_toi_thieu,
        Ngay_mua
    } = req.body;

    if (
        !Ten_nguyen_lieu || Gia_mua == null || !Nguon_mua || !Han_su_dung ||
        So_luong_ton_kho == null || So_luong_ban_dau == null || Ton_kho_toi_thieu == null || !Ngay_mua
    ) {
        return res.status(400).send({ message: 'Thiếu dữ liệu cần thiết.' });
    }

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Ten_nguyen_lieu', sql.NVarChar(255), Ten_nguyen_lieu)
            .input('Gia_mua', sql.Decimal(10, 2), Gia_mua)
            .input('Nguon_mua', sql.NVarChar(255), Nguon_mua)
            .input('Han_su_dung', sql.Date, Han_su_dung)
            .input('So_luong_ton_kho', sql.Int, So_luong_ton_kho)
            .input('So_luong_ban_dau', sql.Int, So_luong_ban_dau)
            .input('Ton_kho_toi_thieu', sql.Int, Ton_kho_toi_thieu)
            .input('Ngay_mua', sql.Date, Ngay_mua)
            .execute('AddNguyenLieu');

        const newID = result.recordset[0]?.NewID || null;
        res.status(200).send({
            message: 'Thêm nguyên liệu thành công.',
            NewID: newID
        });
    } catch (error) {
        console.error('Lỗi khi thêm nguyên liệu:', error);
        res.status(500).send({
            message: 'Lỗi khi thêm nguyên liệu.',
            error: error.message
        });
    }
});

app.get('/view-lua-chon-thuc-don', async (req, res) => {
    const { Loai } = req.query;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Loai', sql.NVarChar(50), Loai)
            .execute('ViewLuaChonThucDon');

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Lỗi khi hiển thị lựa chọn thực đơn:', error);
        res.status(500).send({ message: 'Lỗi khi hiển thị lựa chọn thực đơn.', error: error.message });
    }
});

app.get('/get-mon-an-by-size', async (req, res) => {
    const { KichCo } = req.query;

    try {
        let pool = await sql.connect(config);
        let result;
        if (!KichCo || KichCo.trim() === '') {
            result = await pool.request().query('SELECT * FROM MonAnDon');
        } else {
            result = await pool.request()
                .input('KichCo', sql.NVarChar(50), KichCo)
                .execute('GetMonAnBySize');
        }

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn theo kích thước:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách món ăn theo kích thước.', error: error.message });
    }
});

app.get('/get-dish-details-in-combo/:ID_Combo', async (req, res) => {
    const { ID_Combo } = req.params;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('ID_Combo', sql.NVarChar(10), ID_Combo)
            .execute('GetDishDetailsInCombo');

        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset);
        } else {
            res.status(404).send({ message: 'Không tìm thấy món ăn trong combo này.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin món ăn trong combo:', error);
        res.status(500).send({ message: 'Lỗi khi lấy thông tin món ăn trong combo.', error: error.message });
    }
});

app.get('/show-nguyen-lieu', async (req, res) => {
    const { FilterColumn, FilterValue } = req.query;

    try {
        let pool = await sql.connect(config);

        let result;
        if (!FilterColumn || !FilterValue) {
            // Lấy tất cả nguyên liệu nếu không có bộ lọc
            result = await pool.request().query('SELECT * FROM NguyenLieu');
        } else {
            result = await pool.request()
                .input('FilterColumn', sql.NVarChar(50), FilterColumn)
                .input('FilterValue', sql.NVarChar(255), FilterValue)
                .execute('ShowNguyenLieu');
        }

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Lỗi khi hiển thị nguyên liệu:', error);
        res.status(500).send({ message: 'Lỗi khi hiển thị nguyên liệu.', error: error.message });
    }
});

app.put('/update-nguyen-lieu/:ID_nguyen_lieu', async (req, res) => {
    const { ID_nguyen_lieu } = req.params;
    const {
        Ten_nguyen_lieu,
        Gia_mua,
        Nguon_mua,
        Han_su_dung,
        So_luong_ton_kho,
        So_luong_ban_dau,
        Ton_kho_toi_thieu,
        Ngay_mua
    } = req.body;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('ID_nguyen_lieu', sql.NVarChar(10), ID_nguyen_lieu)
            .input('Ten_nguyen_lieu', sql.NVarChar(255), Ten_nguyen_lieu)
            .input('Gia_mua', sql.Decimal(10, 2), Gia_mua)
            .input('Nguon_mua', sql.NVarChar(255), Nguon_mua)
            .input('Han_su_dung', sql.Date, Han_su_dung)
            .input('So_luong_ton_kho', sql.Int, So_luong_ton_kho)
            .input('So_luong_ban_dau', sql.Int, So_luong_ban_dau)
            .input('Ton_kho_toi_thieu', sql.Int, Ton_kho_toi_thieu)
            .input('Ngay_mua', sql.Date, Ngay_mua)
            .execute('UpdateNguyenLieu');

        res.status(200).send({ message: 'Cập nhật nguyên liệu thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật nguyên liệu:', error);
        res.status(500).send({ message: 'Lỗi khi cập nhật nguyên liệu.', error: error.message });
    }
});

app.delete('/pizza/:id_mon', async (req, res) => {
    const idMon = req.params.id_mon;

    try {
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('ID_Mon', sql.NVarChar(10), idMon)
            .execute('DeleteLuaChonThucDon');

        res.status(200).send({
            message: `Đã thực hiện xóa lựa chọn thực đơn với ID: ${idMon}`,
            details: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Lỗi khi xóa lựa chọn thực đơn.',
            error: err.message
        });
    }
});

// API để gọi thủ tục lưu trữ DeleteNguyenLieu
app.delete('/delete-nguyen-lieu/:ID_NguyenLieu', async (req, res) => {
    const { ID_NguyenLieu } = req.params;
    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('ID_NguyenLieu', sql.NVarChar(10), ID_NguyenLieu)
            .execute('DeleteNguyenLieu');

        res.status(200).send({ message: 'Nguyên liệu đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa nguyên liệu:', error);
        res.status(500).send({ message: 'Lỗi khi xóa nguyên liệu.', error: error.message });
    }
});

// API để gọi thủ tục lưu trữ DeleteLuaChonThucDon
app.delete('/delete-lua-chon-thuc-don/:ID_Mon', async (req, res) => {
    const { ID_Mon } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('ID_Mon', sql.NVarChar(10), ID_Mon)
            .execute('DeleteLuaChonThucDon');

        res.status(200).send({ message: 'Lựa chọn thực đơn đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa lựa chọn thực đơn:', error);
        res.status(500).send({ message: 'Lỗi khi xóa lựa chọn thực đơn.', error: error.message });
    }
});

// API để gọi thủ tục lưu trữ GetMonAnTrongDonHang
app.get('/get-mon-an-trong-don-hang/:ID_don_hang', async (req, res) => {
    const { ID_don_hang } = req.params;

    try {
        // Kết nối đến SQL Server
        let pool = await sql.connect(config);

        // Gọi thủ tục lưu trữ GetMonAnTrongDonHang
        let result = await pool.request()
            .input('ID_don_hang', sql.NVarChar(20), ID_don_hang)
            .execute('GetMonAnTrongDonHang');

        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset);
        } else {
            res.status(404).send({ message: 'Không tìm thấy món ăn trong đơn hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn trong đơn hàng:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách món ăn trong đơn hàng.', error: error.message });
    }
});

// API để gọi thủ tục lưu trữ GetNguyenLieuSapHetHang
app.get('/get-nguyen-lieu-sap-het-hang', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        let pool = await sql.connect(config);

        // Gọi thủ tục lưu trữ GetNguyenLieuSapHetHang
        let result = await pool.request()
            .execute('GetNguyenLieuSapHetHang');

        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset);
        } else {
            res.status(404).send({ message: 'Không có nguyên liệu nào sắp hết hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nguyên liệu sắp hết hàng:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách nguyên liệu sắp hết hàng.', error: error.message });
    }
});

// API để gọi thủ tục lưu trữ ThemDonHangMoi
app.post('/them-don-hang-moi', async (req, res) => {
    const { ID_khach_hang, ID_nhan_vien, Tinh_trang } = req.body;

    try {
        // Kết nối đến SQL Server
        let pool = await sql.connect(config);

        // Tạo biến để lưu giá trị output của ID_don_hang
        const request = pool.request()
            .input('ID_khach_hang', sql.Int, ID_khach_hang)
            .input('ID_nhan_vien', sql.VarChar(20), ID_nhan_vien)
            .input('Tinh_trang', sql.NVarChar(50), Tinh_trang)
            .output('ID_don_hang', sql.VarChar(20));

        await request.execute('ThemDonHangMoi');

        // Lấy giá trị output của ID_don_hang
        const newOrderID = request.parameters.ID_don_hang.value;

        res.status(200).send({
            message: 'Đơn hàng mới đã được tạo thành công.',
            ID_don_hang: newOrderID
        });
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng mới:', error);
        res.status(500).send({ message: 'Lỗi khi tạo đơn hàng mới.', error: error.message });
    }
});

// API để gọi thủ tục lưu trữ ThemLuaChonMonAn
app.post('/them-lua-chon-mon-an', async (req, res) => {
    const { ID_don_hang, ID_mon } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!ID_don_hang || !ID_mon) {
            return res.status(400).send({ message: 'Thiếu dữ liệu: ID_don_hang hoặc ID_mon.' });
        }

        // Kết nối đến SQL Server
        let pool = await sql.connect(config);

        // Gọi thủ tục lưu trữ ThemLuaChonMonAn
        await pool.request()
            .input('ID_don_hang', sql.VarChar(20), ID_don_hang)
            .input('ID_mon', sql.NVarChar(10), ID_mon)
            .execute('ThemLuaChonMonAn');

        res.status(200).send({ message: 'Món ăn đã được thêm vào đơn hàng và tổng tiền đã được cập nhật.' });
    } catch (error) {
        console.error('Lỗi khi thêm món ăn vào đơn hàng:', error);
        res.status(500).send({ message: 'Lỗi khi thêm món ăn vào đơn hàng.', error: error.message });
    }
});

app.post('/tao-don-hang/:ID_nhan_vien', async (req, res) => {
    const { items, ID_khach_hang, ID_nguoi_giao_hang, Tinh_trang } = req.body;
    const { ID_nhan_vien } = req.params   // Kiểm tra dữ liệu đầu và
    console.log(ID_nhan_vien)
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Danh sách món ăn không được để trống.' });
    }
    
    try {
        const pool = await sql.connect(config);

        // Chuyển danh sách món ăn sang JSON
        const jsonItems = JSON.stringify(items);

        // Gọi thủ tục SQL để tạo đơn hàng và lưu món ăn
        const result = await pool.request()
            .input('ID_khach_hang', sql.Int, ID_khach_hang)
            .input('ID_nhan_vien', sql.NVarChar(20), ID_nhan_vien)
            .input('ID_nguoi_giao_hang', sql.Int, ID_nguoi_giao_hang)
            .input('Ngay_dat_hang', sql.Date, new Date()) // Lấy ngày hiện tại
            .input('Tinh_trang', sql.NVarChar(50), Tinh_trang)
            .input('DanhSachMonAn', sql.NVarChar(sql.MAX), jsonItems) // Truyền danh sách món ăn
            .execute('TaoDonHangVaLuuMonAn');

        // Lấy ID đơn hàng trả về
        const ID_don_hang = result.recordset[0].ID_don_hang;

        res.status(200).json({
            message: 'Đơn hàng đã được tạo thành công!',
            ID_don_hang,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo đơn hàng.', error: err.message });
    }
});


app.listen(8000, () => {
    console.log("The Server for pizza store is running in http://localhost:8000")
})