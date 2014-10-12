/*
 * GET a schedule.
 */

//##############################################################################################
// Display a schedule
//##############################################################################################
exports.display = function(req, res){
	// Get schedule
	redisClient.hgetall('schedule:'+req.params.schedule, function(err, reply){
		// If schedule invalid
		if (reply == null) {
			res.send('Invalid link.');
		}
		// Else display schedule
		else {
			res.render('schedule', { 
				title: 'Scheduler', 
				schedule: req.params.schedule, 
				data: JSON.stringify(reply)
				});
		}
	});
};

//##############################################################################################
// Submit results of a schedule
//##############################################################################################
exports.submit = function(req, res) {
	var daterange = JSON.parse(req.body.daterange);
	// Increment each available date of recordset
	for (i=0;i<daterange.length;i++) {
		redisClient.zincrby('schedule:'+req.body.schedule+':resultset', 1, daterange[i]); 
	}
	// Increment usercount
	redisClient.incr('schedule:'+req.body.schedule+':usercount', function(err,reply) {
		res.send(); // Reply to callback success
	});
	// Adds user to userlist and userlist:day if not anonymous
	if (req.body.anonymous == '0') {
		redisClient.rpush('schedule:'+req.body.schedule+':userlist', req.body.name, function(err, reply) {
			for (i=0;i<daterange.length;i++) {
				redisClient.rpush('schedule:'+req.body.schedule+':userlist:'+i, reply-1); 
			}
		});
	}
}

//##############################################################################################
//Display results of a schedule
//##############################################################################################
exports.resultset = function(req, res){
	// Get schedule
	redisClient.hgetall('schedule:'+req.params.schedule, function(err, reply){
		// If schedule invalid
		if (reply == null) {
			res.send('Invalid link.');
		}
		// Else display results
		else {
			// Get first 10 available dates of result set
			redisClient.zrevrange('schedule:'+req.params.schedule+':resultset', 0, 9, 'withscores', function(err, resultset) {
				redisClient.get('schedule:'+req.params.schedule+':usercount', function(err, usercount) {
					res.render('resultset', { 
						title: 'Scheduler', 
						schedule: req.params.schedule,  
						data: JSON.stringify(reply),
						resultset: JSON.stringify(resultset),
						usercount: JSON.stringify(usercount)
						});
				});
			});
		}
	});
};