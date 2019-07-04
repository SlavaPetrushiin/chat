var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

io.on('connection', function (socket) {
    console.log('made in connection')
});