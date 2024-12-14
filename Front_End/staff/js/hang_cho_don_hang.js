function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getEmployeeMapping() {
    try {        
        const response = await fetch('http://localhost:8000/listemployee', {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const employees = await response.json();
        const idNameMapping = employees.map(employee => ({
            id: employee.employee_id,
            name: employee.name
        }));

        return idNameMapping; 
    } catch (error) {
        console.error(`Error fetching employees: ${error.message}`);
        return []; 
    }
}

getEmployeeMapping().then(mapping => {    
    try {
        fetch(
            `http://localhost:8000/get-don-hang`, {
                method: "GET"
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            response.json().then(res => {
                let divLichSuDonHang = ``;

                for(let i = 0; i < res.length; i ++) {
                    const date = new Date(res[i].Ngay_dat);
                    const formatDate = (date) => {
                        const pad = (num) => String(num).padStart(2, '0');
                        const hours = pad(date.getUTCHours()); 
                        const minutes = pad(date.getUTCMinutes());
                        const day = pad(date.getUTCDate());
                        const month = pad(date.getUTCMonth() + 1); 
                        const year = date.getUTCFullYear();
                        return `${hours}:${minutes} - ${day}/${month}/${year}`;
                    };

                    divLichSuDonHang += 
                    `<div class="row" style="border: 1px solid black; border-radius: 10px; margin: 0px 12px 10px;">
                        <div class="col col-6" style="padding: 9px 9px 0px;">
                            <p style="color: black; font-size: 20px; font-weight: 600; line-height: 26px;">
                                <nobr style="color: #DC802A;">MÃ ĐƠN HÀNG: </nobr>
                                <nobr id="ma-don-hang">${res[i].ID_don_hang}</nobr>
                            </p>

                            <p style="color: black; font-size: 20px; font-weight: 600; line-height: 26px;">
                                <nobr style="color: #DC802A;">THỜI GIAN NHẬN: </nobr>
                                <nobr id="thoi-gian-nhan">${formatDate(date)}</nobr>
                            </p>

                            <p style="color: black; font-size: 20px; font-weight: 600; line-height: 26px;">
                                <nobr style="color: #DC802A;">ID BÀN ĂN: </nobr>
                                <nobr id="id-ban-an">${getRandomInt(1, 10)}</nobr>
                            </p>
                        </div>

                        <div class="col col-6" style="padding: 9px 9px 0px;">
                            <p style="font-size: 16px; font-style: italic; font-weight: 400; line-height: 20.8px; color: #FD080C; float: right; margin-right: 20px;">
                                Tình trạng: ${res[i].Tinh_trang}
                            </p>
                        </div>
                    </div>`;
                }

                document.getElementById("list-hang-cho-don-hang").innerHTML = divLichSuDonHang;

                fetch(
                    `http://localhost:8000/get-don-hang`, {
                        method: "GET"
                    }
                ).then(response => {
                    response.json().then(res2 => {
                        
                    });
                });
            });
        });
    } catch (error) {
        console.error(error.message);
    }
});