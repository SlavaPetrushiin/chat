const socket = io.connect('http://localhost:3000');
const messages = document.querySelector('#messages');

  $(function () {
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
        console.log(msg)
      //$('#messages').append($('<li>').text(msg));
        creatMessage(msg);
    });
  });






function creatMessage(msg){
    
    const li = document.createElement('li');
    const div = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');
    
    p.innerText= msg;
    
    li.classList.add('user__message');
    div.classList.add('user__photo');
    p.classList.add('user__text');
    
    li.appendChild(div);
    li.appendChild(p);
    messages.appendChild(li);
}