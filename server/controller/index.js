
var model = require('../model');

var activeSockets = [];

module.exports = {
    connection: function (socket) {
        console.log('a user connected');
        socket.on('newMass', model.newMass);
        socket.on('setSun', function (data) {
            socket.emit('setSun', model.setSun());
        });
        activeSockets.push(socket);
        socket.emit('initialization', { hello: 'world' });
    },
    disconnect: function (reason) {
        console.log('A user disconnected');
    }
}


//callback is called every interval to emit updated data
model.emitUpdatePositions(function (masses) {
    for (var i = 0; i < activeSockets.length; i++) {
        console.log('Emitting to: ' + i);
        activeSockets[i].emit('updatePositions', { update: masses });
    }
})