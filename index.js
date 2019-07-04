const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

const server = app.listen(3000, function(){
    console.log('listening for requests on port 3000,');
})

// Static files
app.use(express.static(__dirname + '/public'));

const io = socket(server);

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.sendFile(__dirname + "/public/chat.html", request.body);
});
  
app.get("/", function(request, response){
    response.sendFile(__dirname + "/register.html");
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

