//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------

var express = require('express.io');
var routes = require('./server/routes');
var schedule = require('./server/routes/schedule');
var user = require('./server/routes/user');
var http = require('http');
var path = require('path');
var redis = require('redis')
redisClient = redis.createClient();
var app = express();

//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'dist')));

//----------------------------------------------------------------------------------------------
// Development only
//----------------------------------------------------------------------------------------------

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------------------------------------------------------------------------------------------
// Error handling if we are unable to connect to redis
//----------------------------------------------------------------------------------------------

redisClient.on("error", function (err) {
	res.send("Redis server cannot be reached.");
	});

//----------------------------------------------------------------------------------------------
// Create server and listen to port
//----------------------------------------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
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
// Display a schedule
//##############################################################################################
app.post('/submit', schedule.submit);

//##############################################################################################
// Display results of a schedule
//##############################################################################################
app.get('/:schedule/r', schedule.resultset);