function getRandomTime(isMorning = true) {
    const startHour = isMorning ? 6 : 12;
    const endHour = isMorning ? 12 : 18;
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
}

try {
    fetch(
        `http://localhost:8000/shift/getShifts`, {
            method: "GET"
        }
    ).then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        response.json().then(res => {
            let listCaTrucTuanNayDiv = ``;

            for(let i = 0; i < res.length; i ++) {
                let startTime = new Date(res[i].starttime);
                let hourStart = startTime.getUTCHours();
                let minuteStart = startTime.getUTCMinutes();

                let endTime = new Date(res[i].endtime);
                let hourEnd = endTime.getUTCHours();
                let minuteEnd = endTime.getUTCMinutes();

                let date = new Date(res[i].shiftdate);
                let day = date.getUTCDate();
                let month = date.getUTCMonth() + 1;
                let year = date.getUTCFullYear();

                listCaTrucTuanNayDiv += 
                `<div style="width: 100%; height: auto; border: 1px solid black; border-radius: 10px; margin-bottom: 9px;">
                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">GIỜ BẮT ĐẦU: </nobr>

                        <nobr id="gio-bat-dau">${hourStart}H${minuteStart}</nobr>

                        <nobr style="font-size: 16px; font-style: italic; font-weight: 400; line-height: 20.8px; color: black; float: right;">
                            Số người thực hiện: ${res[i].currentparticipants}/${res[i].maxparticipants}
                        </nobr>
                    </p>
                    
                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">GIỜ KẾT THÚC: </nobr>

                        <nobr id="gio-bat-dau">${hourEnd}H${minuteEnd}</nobr>
                    </p>

                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">NGÀY THỰC HIỆN: </nobr>

                        <nobr id="gio-bat-dau">${day}/${month}/${year}</nobr>
                    </p>
                </div>`;
            }

            document.getElementById("list-ca-truc-tuan-nay").innerHTML = listCaTrucTuanNayDiv;
            document.getElementById("so-ca-truc").innerHTML = res.length;
            document.getElementById("so-ca-truc-can-dang-ky").innerHTML = `${Math.floor(Math.random() * (res.length * 2)) + 1}/${res.length * 2}`;

            let listCaTrucTuanSauDiv = ``;

            for(let i = 0; i < 4; i ++) {
                listCaTrucTuanSauDiv += 
                `<div style="width: 100%; height: auto; border: 1px solid black; border-radius: 10px; margin-bottom: 9px;">
                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">GIỜ BẮT ĐẦU: </nobr>

                        <nobr id="gio-bat-dau">07H15</nobr>

                        <nobr style="font-size: 16px; font-style: italic; font-weight: 400; line-height: 20.8px; color: black; float: right;">
                            Số người thực hiện: 5/5
                        </nobr>
                    </p>
                    
                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">GIỜ KẾT THÚC: </nobr>

                        <nobr id="gio-bat-dau">12H15</nobr>
                    </p>

                    <p style="font-size: 20px; font-weight: 600; line-height: 26px; color: black; margin: 11px;">
                        <nobr style="color: #DC802A;">NGÀY THỰC HIỆN: </nobr>

                        <nobr id="gio-bat-dau">04/12/2024</nobr>
                    </p>
                </div>`;
            }
        });
    });
} catch (error) {
    console.error(error.message);
}