
var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);
var scl = 20;
var width = 800;
var height = 400;

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection',

  function (socket) {
  
    console.log("New client: " + socket.id); 

    socket.on('new',
      function(data) {
    // console.log('received new : ' + data );

        socket.broadcast.emit('new', data);        
    });
    socket.on('move',
      function(data){
        // // console.log('received move: ' + data.sid );
      socket.broadcast.emit('move', data); 
      // // console.log('Sending move: ' + data.sid );       
    });
    socket.on('cut',
      function(data) {
        socket.broadcast.emit('cut', data);        
    });

    socket.on('eat',
      function(data){
        var food = { 
          fx : data.x,
          fy : data.y
        };
      io.sockets.emit('newfood', food);
    });
    
    socket.on('disconnect', 
      function() {
        socket.broadcast.emit('quit',socket.id);
        console.log(socket.id + " : Client has disconnected");
    });
  }
);