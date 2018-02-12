$(document).ready(function() {

  window.masses = [];

  //initalize socket connection
  var socket = io.connect();

  window.testController = {
    lineMasses: function() {
      socket.emit('setSun');
    }
  }

  //handle mass updates
  socket.on('setSun', function(data) {
    masses[0].remoteUpdatePosition(data.x, data.y, 0, 0);
  })
  
  var gravExp = 1.2;
  var collisionOn = true;
  
  $('.displayText').html('c: collision toggle<br>g: grav +<br>f: grav -');
  $('.gravDisplay').html('Fg~(m1+m2)/r^' + gravExp.toFixed(1));
  
  //Sun initiation
  var SUN = new Mass(
    1e7,
    $("body").width() * 0.5,
    $("body").height() * 0.5,
    0,
    0,
    collisionOn,
    gravExp 
  );
  $('body').append(SUN.$node);
  window.masses.push(SUN);
  SUN.emit('newMass', socket);

  // gaussian function for normal distribution
  var gaussian = function gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }

    return rand / 6;
  };
  
  // pythagorean theorem: return length of hypotenuse
  var pythag = function(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); 
  };
  
  //Add mass dependent on function
  $('.addMassButton').on('click', function(event) {

    var massMakerFunctionName = $(this).data('mass-maker-function-name');

    // get the maker function for the kind of planet we're supposed to make
    var massMakerFunction = window[massMakerFunctionName];
    
    var mass = new massMakerFunction(
      gaussian() * 40000,
      $("body").width() * Math.random(),
      $("body").height() * Math.random(),
      
      //direction
      ((Math.random() * 2) - 1) * Math.PI,
      //velocity
      gaussian() * 60
    );
    $('body').append(mass.$resultNode);
    
    window.masses.push(mass);
  });

  var downX, downY, ll, premass;
  //click on map to create planet with velocity
  $('body').on('mousedown', function() {
    downX = event.pageX;
    downY = event.pageY;
    ll = new LaunchLine(downX, downY - 123);
    $('body').append(ll.$node);
    
    premass = new PreMass(downX, downY, {'border-style': collisionOn ? 'solid' : 'dashed'});
    $('body').append(premass.$resultNode);
  });
  
  $('body').on('mousemove', function() {
    if (ll) {
    
      ll.redraw.call(ll, event.pageX, event.pageY - 123);
      //console.log(ll.$lineNode);
    }
  });
  
  
  $('body').keypress(function (event) {
    // toggle collision
    if (event.key === 'c') {
      collisionOn = !collisionOn;
      for (var i = 0; i < masses.length; i++) {
        masses[i].collisionOn = collisionOn;
        masses[i].$visualCoverNode.css('border-style', collisionOn ? 'solid' : 'dashed');
      }
    }
    
    // increase gravity
    if (event.key === 'g') {
      gravExp -= 0.1;
      // console.log('gravExp', gravExp);
      for (var i = 0; i < masses.length; i++) {
        masses[i].gravityExponent = gravExp;
        $('.gravDisplay').html('Fg~(m1+m2)/r^' + gravExp.toFixed(1));
      }
    }
    
    // decrease gravity
    if (event.key === 'f') {
      gravExp += 0.1;
      // console.log('gravExp', gravExp);
      for (var i = 0; i < masses.length; i++) {
        masses[i].gravityExponent = gravExp;
        $('.gravDisplay').html('Fg~(m1+m2)/r^' + gravExp.toFixed(1));
      }
    }
  });
  
  $('body').on('mouseup', function(event) {
    //remove premass
    var newMass = premass.mass;
    premass.$resultNode.remove();
    premass.keepGrowing = false;
    premass = undefined;
    
    //removes launch line
    
    ll.$node.remove();
    ll = undefined;
    
    //initiate velocity and direction for new mass
    var upX = event.pageX;
    var upY = event.pageY;
    var velocity = pythag(downX - upX, downY - upY);
    var direction = Math.atan2(downY - upY, downX - upX);


    var mass = new MassWithTrail(newMass,
    downX,
    downY,
    direction,
    velocity,
    collisionOn,
    gravExp);
    mass.emit('newMass', socket);
    
    $('body').append(mass.$resultNode);
    window.masses.push(mass);
  });
});

