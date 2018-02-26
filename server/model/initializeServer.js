require('./mass.js')();

class GameInstance{
    constructor () {
        this.masses = [];
        this.collisionOn = true;
        this.gravExp = 1.2;
        this.dtime = 1000;
        this.emitter;
    }

    initializeGameInstance (cb) {
        var SUN = new Mass(
            1e7,
            400,
            400,
            0,
            0,
            this.collisionOn,
            this.gravExp
        );
        this.masses.push(SUN);
        for (var i = 0; i < 2; i ++) {
            var tempMass = new Mass(
                100000,
                100*i,
                100*i,
                0,
                0,
                this.collisionOn,
                this.gravExp
            );
            this.masses.push(tempMass);
        }
        //initialize heart
        this.emitter = cb;
        setInterval(this.updatePositions.bind(this), this.dtime);
    }

    addNewMass (mass, x, y, direction, velocity) {
        var newMass = new Mass(
           mass,
           x,
           y,
           direction,
           velocity,
            this.collisionOn,
            this.gravExp
        );
        this.masses.push(newMass);
    }
    
    updatePositions () {
        var massesInGalaxy = this.masses;
        // stores tuples of [mass,distance,angle, gravForce]

        for (var i = 0; i < this.masses.length; i ++) {
            this.masses[i].updatePosition(this.masses);
        }
        this.emitter(this.masses);
        console.log('Calculating... ' + this.masses.length);
    }

    
}


module.exports = new GameInstance();;