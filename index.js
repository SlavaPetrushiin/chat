const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.set("view engine", "pug");

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

// Массив со всеми подключениями
const  connections =  [];
let count = 0;

const server = app.listen(3001, function(){
    console.log('listening for requests on port 3001,');
})

// Static files
app.use(express.static(__dirname + '/public'));

const io = socket(server);

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    connections.push({name: request.body.name,  nik: request.body.nik});
    response.render("chat", {
        name: request.body.name,
        nik: request.body.nik
    });
});
  
app.get("/", function(request, response){
    response.render("register");
});


io.on('connection', function(socket){
    const id = socket.id;
    console.log("Успешное соединение");
    connections[count].id = id;
    count++;
    io.emit('connectionUser', connections);
    
	socket.on('disconnect', function(data) {
		// Удаления пользователя из массива
        const indexOf = disconnectUser(connections, id);
		connections.splice(indexOf, 1);
		console.log("Отключились");
        count--;
        io.emit('disconnectUser', connections);
	});    
    
    socket.on('chat message', function(data){
        console.log(data)
        io.emit('send message', data);
    });
});

function disconnectUser(connections, id){
	let indexOf;
	connections.forEach((item, i) =>{
		for (let key in item){
			if(item[key] === id){
				indexOf = i;
			};
		};
	});
	return indexOf;
}