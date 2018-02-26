var express = require('express');
var fs = require('fs');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');


//starting express server
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io').listen(server);

var port = 8080;

app.set('port', port);
// If we are being run directly, run the server.
server.listen(app.get('port'));
console.log('Listening on', app.get('port'));


// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Serve the client files
app.use(express.static(__dirname + '/../client'));

require('./routes')(app, io);
