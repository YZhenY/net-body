var LaunchLine = function LaunchLine(x, y, style) {
  this.downX = x;
  this.downY = y;
  this.$node = $('<svg height="100%" width="100%"><line stroke="white" stroke-width="2" /></svg>');

  //lineNode attributes
  this.$node[0].children[0].setAttribute('x1', this.downX);
  this.$node[0].children[0].setAttribute('y1', this.downY);
  this.$node[0].children[0].setAttribute('x2', this.downX);
  this.$node[0].children[0].setAttribute('y2', this.downY);
  
  
  
};

LaunchLine.prototype.redraw = function(x, y) {
  this.$node[0].children[0].setAttribute('x2', x);
  this.$node[0].children[0].setAttribute('y2', y);
};