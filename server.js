/**
 * Main app entry point
 */
var express         = require('express');
var errorhandler    = require('errorhandler');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
// setup express
var app             = express();


// log all requests with morgan
app.use(logger('dev'));
// use middleware to parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
//fixme this is ugly
app.use('/fonts',  express.static(__dirname + '/public/styles'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Cross-origin resource sharing (CORS) headers
app.all('/*', function (req, res, next) {
    // allow any origin
    res.header("Access-Control-Allow-Origin", "*");
    // allow only these methods
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// load app routing
app.use('/', require('./app/routing/route'));
// if no route matched so far reply with 404
app.use(function (req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// setup error handler
app.use(errorhandler({ dumpExceptions: true, showStack: true }));

process.env.PORT = process.env.PORT || 1337;
process.env.IP = process.env.IP || 'localhost';

// start server
var server = app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Magic happens on port " + process.env.PORT + "...");
});

// hook socket.io into express
var io = require('socket.io').listen(server);
// setup socket.io
var socketHandler = require('./app/sockets/socket')(io);
io.sockets.on('connection', socketHandler);