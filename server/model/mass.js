module.exports = function () {
    Mass = function Mass(mass, x, y, direction, velocity, collisionOn, gravExp, socket) {
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.velocity = velocity;
        this.dtime = 50;
        this.collisionOn = collisionOn;
        this.gravityExponent = gravExp;
        this.size = Mass.prototype.setSize.call(this);
    };

    Mass.prototype.setSize = function () {
        var size = 25 * Math.log(this.mass / 1000);
        if (size < 3) {
            size = 3;
        } 
        return size;
    }

    Mass.prototype.emit = function (event, socket) {
        socket.emit(event, {
            mass: this.mass,
            x: this.x,
            y: this.y,
            direction: this.direction,
            velocity: this.velocity,
            collisionOn: this.collisionOn,
            gravExp: this.gravityExponent
        });
    }

    Mass.prototype.getDistanceTo = function (otherMass) {
        
        return Math.sqrt(Math.pow(this.x - otherMass.x, 2) + Math.pow(this.y - otherMass.y, 2));
    };

    Mass.prototype.getAngleTo = function (otherMass) {
        
        return Math.atan2((otherMass.y - this.y), (otherMass.x - this.x));
    };

    Mass.prototype.updatePosition = function (massesInGalaxy) {
        //fetches from widow
        
        // stores tuples of [mass,distance,angle, gravForce]
        var resultCalculations = [];
        var collisionArr = []
        for (var i = 0; i < massesInGalaxy.length; i++) {
            var distanceTo = this.getDistanceTo(massesInGalaxy[i]);
            var tempTuple = [massesInGalaxy[i].mass, distanceTo, this.getAngleTo(massesInGalaxy[i]), (this.mass + massesInGalaxy[i].mass) / Math.pow(distanceTo, this.gravityExponent)];
            // check for collisions here
            if (distanceTo > 0) {
                if ((distanceTo - this.size / 2 - massesInGalaxy[i].size / 2) < 10) {
                    collisionArr.push([massesInGalaxy[i], distanceTo, this.getAngleTo(massesInGalaxy[i])]);
                }
                resultCalculations.push(tempTuple);
            }
        }

        var currTrajec = this.inertia();
        
        //calculating force due to gravity
        var gravForce = this.calGravForce(resultCalculations);

        //calculating how force affects velocity
        var newTrajec = this.calAccel(gravForce, currTrajec);
        
        //checking collision
        if (this.collisionOn && collisionArr.length > 0) {
            newTrajec = this.calcCollision(collisionArr[0], newTrajec);
        }
        
        //console.log("Old Velocity: ", this.velocity);
        //console.log("new Trajec: ", newTrajec);
        //move mass 
        this.x += newTrajec[0];
        this.y += newTrajec[1];
        this.velocity = this.pythag(newTrajec[0], newTrajec[1]) / (this.dtime / 1000);
        this.direction = Math.atan2(newTrajec[1], newTrajec[0]);
        //console.log("New Velocity: " , this.velocity); 
        //console.log(resultCalculations);
        //console.log("Grav force: ", gravForce);
        //debugger;
        return resultCalculations;
    };

    //check for collisions, collision details if so
    // otherObjTuple [Obj, distanceTo, angleTo] 
    Mass.prototype.calcCollision = function (otherObjTuple, newTrajec) {
        var phi = otherObjTuple[2];
        var tempOtherMass = otherObjTuple[0];
        var num = (this.velocity * Math.cos(this.direction - phi) * (this.mass - tempOtherMass.mass) + 2 * (tempOtherMass.mass * tempOtherMass.velocity) * Math.cos(tempOtherMass.direction - phi));
        var denom = this.mass + tempOtherMass.mass;
        var vx = (num / denom) * Math.cos(phi) - this.velocity * Math.sin(this.direction - phi) * Math.sin(phi);
        
        var vy = (num / denom) * Math.sin(phi) - this.velocity * Math.sin(this.direction - phi) * Math.cos(phi);
        return [vx * this.dtime / 1000, vy * this.dtime / 1000];
    };

    //given current location and velocity and direction where is it going to be next
    Mass.prototype.inertia = function () {
        
        var dx = Math.cos(this.direction) * this.velocity * this.dtime / 1000;
        var dy = Math.sin(this.direction) * this.velocity * this.dtime / 1000;
        return [dx, dy];
    };

    Mass.prototype.calGravForce = function (resultArr) {
        var dx = 0;
        var dy = 0;
        for (var i = 0; i < resultArr.length; i++) {
            dx += resultArr[i][3] * Math.cos(resultArr[i][2]);
            dy += resultArr[i][3] * Math.sin(resultArr[i][2]);
        }
        return [dx, dy];
    };

    Mass.prototype.calAccel = function (gravity, currentTraj) {
        var dvx = (gravity[0] / this.mass) * this.dtime / 1000 + currentTraj[0];
        var dvy = (gravity[1] / this.mass) * this.dtime / 1000 + currentTraj[1];
        return [dvx, dvy];
    };

    Mass.prototype.pythag = function (x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };

}