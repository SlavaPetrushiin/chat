const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer  = require("multer");
const upload = multer({dest:"uploads"});

const app = express();

app.set("view engine", "pug");

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = express.json();

// Массив со всеми подключениями
const  connections =  [];
let count = 0;

const server = app.listen(3001, function(){
    console.log('listening for requests on port 3001,');
})

// Static files
app.use(express.static(__dirname + '/public'));

const io = socket(server);

app.post("/", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    connections.push({name: request.body.name,  nik: request.body.nik});
    
    const userName = request.body.name;
    const userNik = request.body.nik;
    const  authorization = request.body.authorization;
    console.log(userName, userNik, authorization)
    
    if (authorization === false){
        var userInfo = {name: userName, nik: userNik};
        var data = fs.readFileSync("users.json", "utf8");
        var users = JSON.parse(data);
        // находим максимальный id
        var id = Math.max.apply(Math,users.map(function(o){return o.id;}))
        // увеличиваем его на единицу
        userInfo.id = id+1;
        // добавляем пользователя в массив
        users.push(userInfo);
        var data = JSON.stringify(users);
        // перезаписываем файл с новыми данными
        fs.writeFileSync("users.json", data);  
        
        //response.json(request.body)
    }

    
    response.render("chat", {
        name: request.body.name,
        nik: request.body.nik
    })
});
  
app.get("/", function(request, response){
    response.render("layout");
});

//Отправка users.json файла
app.get("/users.json", function(request, response){
    var data = fs.readFileSync("users.json", "utf8");
    response.send(data)
});


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

app.use(multer({storage:storageConfig}).single("filedata"));
app.post("/upload", upload.single("filedata"), function (req, res, next) {
   
    let filedata = req.file;
 
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send(filedata.path);
});








io.on('connection', function(socket){
//    const id = socket.id;
    console.log("Успешное соединение");
//    connections[count].id = id;
//    count++;
    io.emit('connectionUser', connections);
    
	socket.on('disconnect', function(data) {
		// Удаления пользователя из массива
//        const indexOf = disconnectUser(connections, id);
//		connections.splice(indexOf, 1);
		console.log("Отключились");
//        count--;
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






