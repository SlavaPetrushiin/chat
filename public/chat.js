const socket = io.connect('http://localhost:3001');
console.log(socket)

window.onload = function(){
    const messages = document.querySelector('#messages');
    const users = document.querySelector('.users');
    const usersPhoto = document.querySelector('.user__info-photo');
    const area = document.querySelector('.photo__block');
    const loadWindowPhoto = document.querySelector('.uploadPhoto');
    const closeloadWindowPhoto = document.querySelector('.btn__close');
    const loadBtn = document.querySelector('.btn__load');
    
    const btn = document.querySelector('.btn');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const userMess = document.querySelector('.mess');
        const name = document.querySelector('.name').innerText;
        socket.emit('chat message', {message: userMess.value, userName: name, id: socket.id});
        userMess.value = '';
    });
        
    socket.on('send message', function(msg){
        console.log(msg)
        creatMessage(msg);
    });
      
    socket.on('connectionUser', function(data){
        userConnectDiscon(data);
    });
      
    socket.on('disconnectUser', function(data){
        userConnectDiscon(data);
    });
    
    usersPhoto.addEventListener('click', function(){
        loadWindowPhoto.style.display = 'block';    
    });
    
    closeloadWindowPhoto.addEventListener('click', function(e){
        e.preventDefault();
        area.style.backgroundImage = '';
        loadWindowPhoto.style.display = 'none';
        area.style.borderColor = '#DCDCDC';
    })
    
    area.addEventListener('dragover', event => {
        event.preventDefault();
        area.style.borderColor = 'gold';

    });

    area.addEventListener('drop', event => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function(){
            area.style.backgroundImage = `url(${reader.result})`;
        };
        loadBtn.addEventListener('submit', function(e){
            e.preventDefault();
            sendPhoto(files[0]);
        })
    });

    area.addEventListener('dragleave', event => {
        event.preventDefault();
        area.style.borderColor = '#DCDCDC'; 
    });
    
    function sendPhoto(files){
        console.log(files);
        

        const form = new FormData();
        form.append(`${socket.id}`, files);
        
//        fetch('/upload', {
//            method: 'PUT',
//            headers: {
//                        'Content-Type': 'application/json',
//                    },            
//            body: form
//        })
//        .then(response => response.formData())
//        .catch(error => console.error('Ошибка:', error))
//        .then(response => console.log('Успех:', response));
    };
    
    function creatMessage(msg){
        const li = document.createElement('li');
        const div = document.createElement('div');
        const p = document.createElement('p');
        const span = document.createElement('span');
        p.innerHTML = `<strong> ${msg.userName} </strong> <br> ${msg.message}`;
        li.classList.add('user__message');
        li.setAttribute('data-userId', msg.id);
        div.classList.add('user__photo');
        p.classList.add('user__text');
        li.appendChild(div);
        li.appendChild(p);
        messages.appendChild(li);
    }

    function userConnectDiscon(data){
        users.textContent = `Участники (${data.length})`;
        data.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('user');
            li.textContent = item.name;
            users.appendChild(li);
        });    
    }    
    
}





