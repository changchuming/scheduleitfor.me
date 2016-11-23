//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
// Express
var app = require('express')();
var http = require('http').Server(app);

var path = require('path');
var fs = require('fs');
var util = require("util");

// Middleware
var favicon = require('serve-favicon'); 
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var static = require('serve-static');
var errorHandler = require('errorhandler');

// Socket.io
var io = require('socket.io')(http);
app.set('socketio', io); // Pass to routes

// Redis
var redis = require('redis')
redisClient = redis.createClient();

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var routes = require('./server/routes');
var schedule = require('./server/routes/schedule');
var result = require('./server/routes/result');
var user = require('./server/routes/user');

//----------------------------------------------------------------------------------------------
// Sockets
//----------------------------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {
	socket.on('join', function(room) {
	    socket.join(room);
	    result.broadcastSchedule(io, room);
	})

	// Leaves a room
	socket.on('leave', function(room) {
	    socket.leave(room);
	})
});

// Joins a room


//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
var port = process.env.PORT || 5000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.use(static(__dirname + '/public'))

//----------------------------------------------------------------------------------------------
// Development only
//----------------------------------------------------------------------------------------------

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//----------------------------------------------------------------------------------------------
// Error handling if we are unable to connect to redis
//----------------------------------------------------------------------------------------------

redisClient.on("error", function (err) {
	console.log("Redis server cannot be reached.");
	});

//----------------------------------------------------------------------------------------------
// Create server and listen to port
//----------------------------------------------------------------------------------------------

http.listen(port, function(){
  console.log('listening on: ' + port);
});

//##############################################################################################
// Display home page
//##############################################################################################
app.get('/', routes.index);

//##############################################################################################
// Create schedule
//##############################################################################################
app.post('/create', routes.create);

//##############################################################################################
// Display a schedule
//##############################################################################################
app.get('/:schedule', schedule.display);

//##############################################################################################
// Submit response to a schedule
//##############################################################################################
app.post('/submit', schedule.submit);

//##############################################################################################
// Display results of a schedule
//##############################################################################################
app.get('/:schedule/r', result.display);

//##############################################################################################
// Display availibility of a schedule
//##############################################################################################
app.post('/availability', result.availability);
