var body = [];
var fx , fy;
var n = 5;
var scl = 20;
var enemies = [];
var uid;
var socket;
var input;
var button;
var p;
var connected = false;

function setup() {
  createCanvas(800, 400);
  frameRate(15);
  p = createP('Enter your Username :<br>');
  var name_list = ["Python", "Cobra", "Venom", "Mamba", "Fang"];
  var default_name = name_list[floor(random(0, name_list.length-0.01))];
  input = createInput(default_name);
  button = createButton("Play Multiplayer!!");
  button.mousePressed(function(){
    uid = input.value();
    button.hide();
    input.hide();
    p.html(uid);

    // socket = io.connect('http://localhost:3000/');
    socket = io.connect('https://yrus-snake.herokuapp.com/');  // <===

    socket.on('connect', function(){
    //initialize again
      body.splice(0, body.length);
      var ix = scl * floor(random(width / scl));
      var iy = scl * floor(random(height / scl));
      for (var k = 0; k <= n - 1; k++) {
        body[k] = new Body(ix - k * scl, iy, 1, 0);
      }
      connected = true;
      newData(ix,iy);
    });

    socket.on('new',
      function(data){
        // console.log('locha');
        move(body[0].xSpeed,body[0].ySpeed);
        enemies.push(new Enemy(data.x,data.y,data.id,data.sid));
    });

    socket.on('move',
      function(data){
        // console.log('got move data 1: ',data);
        for(var i = 0; i < enemies.length; i++){
          if(data.sid == enemies[i].sid){
            enemies[i].change(data.body);
            // enemies[i].move(data.i, data.j);
            // console.log('got move it : ' + data);
            return;
          }
        }
        enemies.push(new Enemy(0,0,data.id,data.sid));
        enemies[enemies.length-1].change(data.body);
    });

    socket.on('cut',
      function(data){
        for(var i = 0; i < enemies.length; i++){
          if(data.sid== enemies[i].sid){
            var diff = enemies[i].body.length - data.len;
            enemies[i].body.splice(data.len, diff);
            // console.log('rec cut : ' + data.len +' '+ diff);
            return;
          }
        }    
    });
    // console.log('3 :' + socket.id);
    socket.on('newfood',
      function(data){
        fx = data.fx;
        fy = data.fy;
    });

    socket.on('quit',
      function(data){
        for(var i = 0; i < enemies.length; i++){
          if(enemies[i].sid == data) enemies.splice(i, 1);
        }
    });
  });

  fx=width/2;
  fy=height/2;

  var ix, iy;
  ix = scl * floor(random(width / scl));
  iy = scl * floor(random(height / scl));
  for (var k = 0; k <= n - 1; k++) {
    body[k] = new Body(ix - k * scl, iy, 1, 0);
  }
  showFood();
}

function draw() {
  background(180);
  fill(255);
  text("Length : " + body.length, 500, 20);
  text("Online Players : " + enemies.length, 20, 20);

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
  //edit enemy-->
  for (i = 0; i < enemies.length; i++) {
    fill(0);
    enemies[i].body[0].show2();
    fill(0);
    noStroke();
    text(enemies[i].id, enemies[i].body[0].x, enemies[i].body[0].y + 30);
    enemies[i].body[0].move();
    stroke(0);
    fill(255, 0, 0);
    for (var j = enemies[i].body.length - 1; j > 0; j--) {
      enemies[i].body[j].show();
      enemies[i].body[j].move();
      enemies[i].body[j].xSpeed = enemies[i].body[j - 1].xSpeed;
      enemies[i].body[j].ySpeed = enemies[i].body[j - 1].ySpeed;
    }  
  }
  joystick();
  check();
  eat();
}

function newData(ix, iy) {
  if(connected) {
    var data = {
      x : ix,
      y : iy,
      id : 0,
      sid : 0
    };
    data.id = uid;
    data.sid = socket.id;
    // console.log('nd : ' + data + socket.id);
    socket.emit('new', data)
  }
}

function move(i_, j_) {
  if (body[0].xSpeed + i_) {
    body[0].xSpeed = i_;
    body[0].ySpeed = j_;
    if (connected) {
      var data = {
        body : [],
        id : 0,
        sid : 0
      };

      data.body = body;
      data.id = uid;
      data.sid = socket.id;
      socket.emit('move', data);// [[i,j], socket.id]);
      // console.log(data);//[[i,j], socket.id]);
    }
  }
}

function showFood() {
  // noStroke();
  fill(255, 255, 0);
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
    if(connected) socket.emit('eat',data);
    else {
      fx = data.x;
      fy = data.y;
    }
  }
}

function check() {
  for (var i = 1; i < body.length; i++) {
    var d = dist(body[0].x, body[0].y, body[i].x, body[i].y);
    if (d < scl) {
      body.splice(i, body.length - i);
      if (connected) {
        var data = {
          len : body.length,
          sid : socket.id
        };
        socket.emit('cut', data);
        // console.log('sent cut : ' + data.len);
        break;
      }
    }
    for(var j = 0; j < enemies.length; j++) {
      var d2 = dist(enemies[j].body[0].x, enemies[j].body[0].y, body[i].x, body[i].y);
      if (d2 < scl) {
        body.splice(i, body.length - i);
        if (connected) {
          var data = {
            len : body.length,
            sid : socket.id
          };
          socket.emit('cut', data);
          // console.log('sent cut : ' + data.len);
          break;
        }
      }
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) move(0, -1);
  else if (keyCode === DOWN_ARROW) move(0, 1);
  else if (keyCode === LEFT_ARROW) move(-1, 0);
  else if (keyCode === RIGHT_ARROW) move(1, 0);
}

function joystick(){
  noStroke();
  fill(120,70);
  ellipseMode(CENTER);
  ellipse(width-80,height-80,80);
  fill(100,70);
  ellipse(width-80,height-80, 30);
  stroke(0);
}

function mouseDragged(){
  var diffX,diffY;
  noStroke();
  diffX = mouseX - width+80;
  diffY = mouseY - height+80;
  if(abs(diffX) > abs(diffY)){
    if(diffX > 0) move(1, 0);
    else move(-1, 0);
    ellipse(constrain(mouseX,width-160,width+80), constrain(mouseY,height-160,height+80), 30);
  }
  else if(abs(diffX) < abs(diffY)){
    if(diffY > 0) move(0, 1);
    else move(0, -1);
    ellipse(constrain(mouseX,width-160,width+80), constrain(mouseY,height-160,height+80), 30);
  }
  stroke(0);
}

/*
function sendData() {
  var data = {
    x : [],
    y : [],
    id : 0,
    sid : 0
  };
  data.id = uid;
  data.sid = socket.id;
  for (var i = 0; i < body.length; i++) {
    data.x[i] = body[i].x;
    data.y[i] = body[i].y;
  }
  socket.emit('loc', data);
}*/
