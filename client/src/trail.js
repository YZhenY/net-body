var MassWithTrail = function createTrail(mass, x, y, direction, velocity, collisionOn, gravExp, interval, trailLen) {
  Mass.call(this, mass, x, y, direction, velocity, collisionOn, gravExp);
  this.trailInterval = interval || 1000;
  this.trailArray = [];
  this.trailLength = trailLen || 5;
  
  MassWithTrail.prototype.dropTrail.call(this);
};

MassWithTrail.prototype = Object.create(Mass.prototype);
MassWithTrail.prototype.constructor = MassWithTrail;

MassWithTrail.prototype.dropTrail = function() {
  setTimeout(this.dropTrail.bind(this), this.trailInterval);
  
  //remove and delete trailDots if above certain number
  if (this.trailArray.length > this.trailLength) {
    
    this.trailArray.shift().remove();
  }
  
  //create and drop new dot
  var $trailDot = $('<span class="trailDot"></span>');
    
  $trailDot.css({
    top: this.y,
    left: this.x
  });
  
  this.trailArray.push($trailDot);
  $('body').append($trailDot);
};

