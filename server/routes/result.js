/*
 * GET the result of a schedule.
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------

//##############################################################################################
//Display results of a schedule
//##############################################################################################
exports.display = function(req, res){
	// Get schedule
	redisClient.hgetall('schedule:'+req.params.schedule, function(err, reply){
		// If schedule invalid
		if (reply == null) {
			res.send('Invalid link.');
		}
		// Else display results
		else {
            console.log(reply);
            res.render('result', { 
                title: 'Scheduler', 
                schedule: req.params.schedule,  
                data: JSON.stringify(reply),
            });
        }
	});
};

//##############################################################################################
//Display availability of a schedule
//##############################################################################################
exports.availability = function(req, res) {
    redisClient.lrange('schedule:'+req.body.schedule+':userlist', 0, -1, function(err, userlist) {
        redisClient.lrange('schedule:'+req.body.schedule+':userlist:'+req.body.sequenceindex, 0, -1, function(err, availablearray) {
            var data = {userlist: JSON.stringify(userlist), availablearray: JSON.stringify(availablearray)};
            res.send(data);
        })
    });
}

//##############################################################################################
// Broadcast schedule of most available dates
//##############################################################################################
exports.broadcastSchedule = function(io, schedule) {
    // Get first 10 available dates of result set
    redisClient.zrevrange('schedule:'+schedule+':selectedrange', 0, 29, 'withscores', function(err, top) {
        redisClient.get('schedule:'+schedule+':usercount', function(err, usercount) {
            var data = {top: JSON.stringify(top), usercount: usercount};
            io.to(schedule).emit('top', data);
        });
    });
}

//##############################################################################################
// Broadcast availability of specified date
//##############################################################################################
exports.broadcastAvailability = function(io, schedule, username, selectedrange) {
    var data = {username: username, selectedrange: JSON.stringify(selectedrange)};
    io.to(schedule).emit('availability', data);
}