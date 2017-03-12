function Enemy(id) {
  this.id = id;
  this.bodyX = [];
  this.bodyY = [];
  this.show = function() {
    fill(0);
    ellipse(this.bodyX[0] + scl / 2, this.bodyY[0] + scl / 2, scl + 5, scl + 5);
    fill(255,255,0);
    for (var i = 1; i < this.bodyX.length; i++) {
      rect(this.bodyX[i], this.bodyY[i], scl, scl);
    }
  }
  this.get = function(data) {
    for(var i=0;i<data.x.length;i++){
      this.bodyX[i] = data.x[i];
      this.bodyY[i] = data.y[i];
    }
    var diff = body.length - data.x.length;
    this.bodyX.splice(i,diff);
    this.bodyY.splice(i,diff);

  }
}