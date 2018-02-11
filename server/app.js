var express = require('express');
var fs = require('fs');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');


//starting express server
var app = express();
module.exports = app;

var port = 3000;

app.set('port', port);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// If we are being run directly, run the server.
if (!module.parent) {
    app.listen(app.get('port'));
    console.log('Listening on', app.get('port'));
}