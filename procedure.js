// const sql = require('mssql');
// const config = require('./config');

// async function createStoredProcedure() {
//     try {
//         const pool = await sql.connect(config);
//         const createSPQuery = `
//         CREATE PROCEDURE sp_test3

//             @FullName NVARCHAR(255),
//             @Email VARCHAR(255),
//             @DateOfBirth DATE,
//             @Password NVARCHAR(255),
//             @CreatedAt DATETIME
//         AS
//         BEGIN
//            DECLARE @Prefix NVARCHAR(3) = 'EMP';
//             DECLARE @NewID NVARCHAR(10);
//             DECLARE @Number INT;

//     -- Lấy số lớn nhất hiện tại
//             SELECT @Number = ISNULL(MAX(CAST(SUBSTRING(NewID, 4, LEN(NewID) - 3) AS INT)), 0) + 1
//             FROM Users;

//     -- Tạo ID mới
//             SET @NewID = @Prefix + RIGHT('00000' + CAST(@Number AS NVARCHAR), 5);

//     -- Thêm bản ghi mới
//             INSERT INTO Users
//             VALUES (@NewID, @FullName, @Email, @DateOfBirth, GETDATE(), @Password);


//         END;
//     `;
//     await pool.request().query(createSPQuery);

//     console.log('Stored procedure created successfully');
//     }
//     catch (err) {
//         console.error(err);
//         throw new Error('Failed to create stored procedure');
//     }
// }
// module.exports = createStoredProcedure; 
    
// // -- Trả về ID mới
// // SELECT @NewID AS NewEmployeeID;
const sql = require('mssql');
const config = require('./config');

// Function để kiểm tra và tạo hoặc cập nhật Stored Procedure
async function createStoredProcedure() {
    try {
        // Kết nối đến cơ sở dữ liệu
        const pool = await sql.connect(config);

        // Kiểm tra xem stored procedure đã tồn tại chưa
        const result = await pool.request().query(`
            SELECT * 
            FROM sys.objects 
            WHERE type = 'P' AND name = 'sp_AddEmployee'
        `);

            // Nếu chưa tồn tại, tạo mới Stored Procedure
            console.log("Stored Procedure 'sp_AddEmployee1' chưa tồn tại. Đang tạo mới...");
            await pool.request().query(`
                CREATE PROCEDURE sp_AddEmployee3
                    @FullName NVARCHAR(255),
                    @Email VARCHAR(255),
                    @DateOfBirth DATE,
                    @CreatedAt DATETIME,
                    @Password NVARCHAR(255)
                AS
                BEGIN
                    SET NOCOUNT ON;

                    -- Tìm số lớn nhất hiện tại trong cột UsersID
                    DECLARE @MaxNumber INT;

                    -- Sửa lại câu SELECT với ORDER BY chính xác
                    SELECT @MaxNumber = 
                        CAST(SUBSTRING(UsersID, 4, LEN(UsersID)) AS INT)
                    FROM Users
                    WHERE UsersID LIKE 'EMP%'
                    ORDER BY CAST(SUBSTRING(UsersID, 4, LEN(UsersID)) AS INT) DESC;

                    -- Nếu không có dữ liệu, bắt đầu từ 1
                    SET @MaxNumber = ISNULL(@MaxNumber, 0) + 1;

                    -- Tạo UsersID mới
                    DECLARE @NewUsersID NVARCHAR(20);
                    SET @NewUsersID = 'EMP' + RIGHT('00000' + CAST(@MaxNumber AS NVARCHAR), 5);

                    -- Chèn dữ liệu vào bảng
                    INSERT INTO Users (FullName, Email, DateOfBirth, CreatedAt, Password, UsersID)
                    VALUES (@FullName, @Email, @DateOfBirth, @CreatedAt, @Password, @NewUsersID);

                    -- Trả về ID mới (nếu cần)
                    SELECT @NewUsersID AS UsersID;
                END;
            `);
            console.log("Stored Procedure 'sp_AddEmployee1' đã được tạo.");
    } catch (err) {
        console.error("Error checking or creating/updating stored procedure:", err.message);
        throw err;
    }
}

module.exports = createStoredProcedure;
