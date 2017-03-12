function Body(x, y, i, j) {
  this.x = x;
  this.y = y;
  this.xSpeed = i;
  this.ySpeed = j;
  this.show = function() {
    rect(this.x, this.y, scl, scl);
  }
  this.show2 = function() {
    ellipseMode(CENTER);
    ellipse(this.x + scl / 2, this.y + scl / 2, scl + 5, scl + 5);
  }
  this.move = function() {
    this.x += this.xSpeed * scl;
    this.y += this.ySpeed * scl;
    if (this.x >= width) this.x = 0;
    else if (this.x < 0) this.x = width;
    if (this.y >= height) this.y = 0;
    else if (this.y < 0) this.y = height;
  }
}