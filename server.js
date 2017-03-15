
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

var io = require('socket.io')(server);

io.sockets.on('connection',

  function (socket) {
  
    console.log("New client: " + socket.id); 

    socket.on('loc',
      function(data) {
        socket.broadcast.emit('loc', data);        
    });

    socket.on('eat',
      function(data){
        var food = { 
          fx : data.x,
          fy : data.y
        };
      io.sockets.emit('newfood', food);
    });
    
    socket.on('disconnect', function() {
      socket.broadcast.emit('left',socket.id);
      console.log(socket.id + " : Client has disconnected");
    });
  }
);