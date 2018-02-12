var model = require('../model');

module.exports = {
    connection: function (socket) {
        console.log('a user connected');
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
        socket.on('newMass', model.newMass);

        socket.on('setSun', function (data) {
            socket.emit('setSun', model.setSun());
        });
    }
}