var controller = require('./controller');
var router = require('express').Router();

module.exports = function(app, io) {
    io.on('connection', controller.connection);
    io.on('disconnect', controller.disconnect);
};