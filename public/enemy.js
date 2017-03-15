function Enemy(id, sid) {
  this.id = id;
  this.sid = sid;
  this.bodyX = [];
  this.bodyY = [];
  this.show = function() {
    fill(0);
    ellipse(this.bodyX[0] + scl / 2, this.bodyY[0] + scl / 2, scl + 5, scl + 5);
    fill(255,255,0);
    for (var i = 1; i < this.bodyX.length; i++) {
      rect(this.bodyX[i], this.bodyY[i], scl, scl);
    }
    fill(0);
    text(this.id, this.bodyX[0]-10, this.bodyY[0] + scl + 10);
  }
  this.get = function(data) {
    for(var i=0;i<data.x.length;i++){
      this.bodyX[i] = data.x[i];
      this.bodyY[i] = data.y[i];
    }
    var diff = this.bodyX.length - data.x.length;
    if(diff > 0){
      this.bodyX.splice(i,diff);
      this.bodyY.splice(i,diff);
    }
  }
}