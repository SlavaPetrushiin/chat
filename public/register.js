const form = document.querySelector('.authorization__form');
const enter = document.querySelector('.authorization__btn');
let authorization = false;
let userJS;
let flag = false;

enter.addEventListener('click', (e) => {
    e.preventDefault();
    const userName = form.name.value;
    const userNik = form.nik.value;    
    
    fetch("/users.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            const obj = JSON.stringify(myJson);
            if (!userName || !userNik){
                alert('Заполните все поля!')
                return;
            }

            const arrayUsers = JSON.parse(obj);
            arrayUsers.forEach(item => {
                if (item.nik === userNik){
                    if (item.name === userName){
                        userJS = {
                            name: userName,
                            nik: userNik,
                            authorization: true
                        };
                        ajax("/", "POST", f1, requestData(userJS));
                        flag = true;
                        userJS = '';
                    } else {
                        alert('Пользователь с таким ником уже существует! Введите новый ник!');
                        userJS = '';
                    }
                }
            });
        
            if (!flag){
                userJS = {
                    name: userName,
                    nik: userNik,
                    authorization: false
                };
                ajax("/", "POST", f1, requestData(userJS));        
            }

            document.querySelectorAll(".input").forEach(item => {
                item.value = '';
            });
            userJS = '';

            flag = false;        
        })
        .catch(console.log.bind(console));    
});


function ajax(url, method, functionName, dataArray){
    let xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type",'application/json');
    xhttp.send(dataArray);

    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            functionName(this.response);
            }
        }            
}
        
function requestData(dataArray){
    let out = JSON.stringify(dataArray);
    console.log(out);
    return out;
}
    
function f1(data){
    const body = document.body;
    body.innerHTML = data;
}
        

        

