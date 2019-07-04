//const socket = io();
//const authorization = document.querySelector('.authorization__form');
//const buttonAuthorization = document.querySelector('.authorization__btn');
//
//buttonAuthorization.addEventListener('click', (e) => {
//    e.preventDefault();
//    socket.emit('send message', {
//        user: authorization.name.value, 
//        nik:authorization.nik.value
//    });
//    authorization.nik.value = '';
//    authorization.nik.value = '';
//    return false;
//})

  var socket = io.connect('http://localhost:3000');
//  socket.on('news', function (data) {
//    console.log(data);
//    socket.emit('my other event', { my: 'data' });
//  });