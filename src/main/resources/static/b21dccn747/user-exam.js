
async function fetchExam() {
        try {
            const jwt = localStorage.getItem("jwt");
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            };
            const response = await fetch("http://localhost:8080/exam/getAllExamsUser",requestOptions)
            if(!response.ok){
                if(response.status==401)
                    window.location.href="/student";
            }
            else{
            document.getElementById('user-page').style.display="block";
            const exam = await response.json();
            return exam;
            }
        } catch (error) {
            console.error(error);
        }
}



async function loadExam () {
    var baiThi = await fetchExam();
    display(baiThi);
    var filter = document.getElementById("filter-op");

    filter.addEventListener("change",()=>{
        var filval = filter.value;
        if(filval=="all"){
            display(baiThi);
        }
        else if(filval=="tudo"){
            let a=[];
            for (i of baiThi){
                if(!i.startTime){
                    a.push(i);
                }
            }
            display(a);
        }
        else if(filval=="gh"){
            let a=[];
            for (i of baiThi){
                if(i.startTime){
                    a.push(i);
                }
            }
            display(a);
        }
    })



    const searchInput = document.querySelector("[data-search]")
    searchInput.addEventListener("input", e => {
        const value = e.target.value;
        let a=[]
        baiThi.forEach(user => {
            const isVisible =
              user.examTitle.toLowerCase().includes(value.toLowerCase())
            if(isVisible){
                a.push(user);
            }
          })
        console.log(a)
        display(a);
    })
}

loadExam()

function display(baiThi){
        let placeholder = document.querySelector("#user-exam-output");
        let out = "";
        var user_id = localStorage.getItem("user_id");
        for (let baithi of baiThi){
            if(!baithi.startTime){
                    var moTa="";
                    if (baithi.examDescription)
                        moTa=baithi.examDescription;
                        out+=
                    `
                        <div class="box">
                            <div class="TenBaiThi">${baithi.examTitle}</div>
                            <div class="Content">
                                <span>${moTa}</span> <br>
                                <span>- Thời gian: Tự do</span><br>
                                <span>&nbsp</span>
                            </div>
                            <div class="do-exam">
                                <a href="startExam?exam_id=${baithi.id}&user_id=${user_id}" id="do-exam-btn">Bắt đầu</a>
                            </div>
                        </div>
                    `;
                    }
            else{
            start = timeFormat(baithi.startTime);
            end = timeFormat(baithi.endTime);
            var moTa="";
            if (baithi.examDescription)
                moTa=baithi.examDescription;
            out+=
            `   <div class="box">
                    <div class="TenBaiThi">${baithi.examTitle}</div>
                    <div class="Content">
                        <span>${moTa}</span> <br>
                        <span>- Thời gian bắt đầu: ${start}</span><br>
                        <span>- Thời gian kết thúc: ${end}</span>
                    </div>
                    <div class="do-exam">
                        <a href="startExam?exam_id=${baithi.id}&user_id=${user_id}" id="do-exam-btn">Bắt đầu</a>
                    </div>

                </div>
            `;
            }

        }

        placeholder.innerHTML=out;
}

function timeFormat(time){
    var d = new Date(time);
    let a = d.toTimeString().substring(0,8)+" " + d.getDate().toString()+ "/" +(d.getMonth()+1).toString()+"/" + d.getFullYear().toString();
    return a;
}

function DangXuat(){
    localStorage.clear();
}


//document.getElementById('do-exam-btn').addEventListener('click', ()=>{
//    window.location.href="index001.html"
//})