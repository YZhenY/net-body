


var instanceGame = require('./initializeServer');

module.exports = {
    newMass: function(data) {
        console.log('New Mass of ' + data);
        
        instanceGame.addNewMass(
            data.mass,
            data.x,
            data.y,
            data.direction,
            data.velocity
        )
        
        //masses.push(data);
    },
    setSun: function(data) {
        console.log('Setting Sun');
        return masses[0];
    },
    initializeView: function (socket) {
        // to initialize clients to the current state of the app
        activeSockets.push(socket);
    },
    //called/initialized in controller for organisation reasons
    emitUpdatePositions: function(callback) {
        instanceGame.initializeGameInstance(callback);
    }
}
