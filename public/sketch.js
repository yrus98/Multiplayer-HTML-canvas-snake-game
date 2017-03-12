var body = [];
var fx , fy;
var n = 5;
var scl = 20;
var enemies = [];
var id;
var socket;

function setup() {
  createCanvas(800, 400);
  frameRate(20);
  fx=width/2;
  fy=height/2;
  socket = io.connect('https://yrus-snake.herokuapp.com/');

  var x, y;
  x = scl * floor(random(width / scl));
  y = scl * floor(random(height / scl));
  for (var k = 0; k <= n - 1; k++) {
    body[k] = new Body(x - k * scl, y, 1, 0);
  }
  showFood();
  id = socket.id;
  sendData();

  socket.on('loc', 
    function(data) {
      for(var i=0;i<enemies.length;i++){
        if(data.id == enemies[i].id){
          enemies[i].get(data);
          return;
        }
      }
      enemies.push(new Enemy(data.id));
      enemies[enemies.length-1].get(data);
  });
  socket.on('newfood',function(data){
    fx = data.fx;
    fy = data.fy;
  });
  setInterval(sendData, 200);
}

function draw() {
  background(180);
  fill(255);
  text("length : " + body.length, 500, 20);
  showFood();
  fill(0);
  body[0].show2();
  body[0].move();
  fill(0, 255, 0);
  for (var i = body.length - 1; i > 0; i--) {
    body[i].show();
    body[i].move();
    body[i].xSpeed = body[i - 1].xSpeed;
    body[i].ySpeed = body[i - 1].ySpeed;
  }
  for (i = 0; i < enemies.length; i++) {
    enemies[i].show();
  }
  check();
  eat();
}

function keyPressed() {
  if (keyCode === UP_ARROW) move(0, -1);
  else if (keyCode === DOWN_ARROW) move(0, 1);
  else if (keyCode === LEFT_ARROW) move(-1, 0);
  else if (keyCode === RIGHT_ARROW) move(1, 0);
}

function touchMoved(){
  if (ptouchX - touchX < -10) move(1,0);
  else if (ptouchX - touchX > 10) move(-1,0);
  else if (ptouchY - touchY < -10) move(0,1);
  else if (ptouchY - touchY > 10) move(0,-1);
}

function move(i, j) {
  if (body[0].xSpeed + i) {
    body[0].xSpeed = i;
    body[0].ySpeed = j;
  }
}

function showFood() {
  // noStroke();
  fill(255, 0, 0);
  rect(fx, fy, scl, scl);
}

function eat() {
  var d = dist(body[0].x, body[0].y, fx, fy);
  if (d < scl) {
    var last = body[body.length - 1];
    body.push(new Body(last.x - (scl * last.xSpeed), last.y - (scl * last.ySpeed), last.xSpeed, last.ySpeed));
    var data = {
      x : scl * floor(random(width) / scl),
      y : scl * floor(random(height) / scl)
    };
    socket.emit('eat',data);
  }
}

function check() {
  for (var i = 1; i < body.length; i++) {
    var d = dist(body[0].x, body[0].y, body[i].x, body[i].y);
    if (d < 10) {
      body.splice(i, body.length - i);
      break;
    }
    for(var j=0; j < enemies.length; j++) {
       var d2 = dist(enemies[j].bodyX[0], enemies[j].bodyY[0], body[i].x, body[i].y);
       if (d2 < 10) {
        body.splice(i, body.length - i);
        break;
        }
    }

  }
}

function sendData() {
  var data = {
    x : [],
    y : [],
    id
  };
  data.id = id;
  for (var i = 0; i < body.length; i++) {
    data.x[i] = body[i].x;
    data.y[i] = body[i].y;
  }
  socket.emit('loc', data);
}