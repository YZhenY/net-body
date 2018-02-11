var PreMass = function PreMass(x, y, style) {
  this.style = style;
  
  this.mass = 1000;
  this.$node = $('<span class="mass"></span>');
  this.keepGrowing = true;
  
  PreMass.prototype.setPosition.call(this, x, y);
  
  this.$visualCoverNode = $('<span class="cover"></span>');
  this.$visualCoverNode.css(this.style);
  this.$resultNode = this.$node.append(this.$visualCoverNode);
  
  PreMass.prototype.grow.call(this, this.mass);
};

PreMass.prototype.grow = function() {
  if (this.keepGrowing) {
    setTimeout(this.grow.bind(this), 50);  
  }
  
  var size = 25 * Math.log(this.mass / 1000);
  if (size < 3) {
    size = 3;
  } 
  
  // console.log(size);
  this.$visualCoverNode.css({ 'width': size, 'height': size, 'border-radius': size, 'top': -size * 0.5 });
  // console.log(this.$visualCoverNode.css());
  this.mass *= 1.08;
};

PreMass.prototype.setPosition = function(x, y) {
  var styleSettings = {
    top: y,
    left: x
  };
  this.$node.css(styleSettings);
};