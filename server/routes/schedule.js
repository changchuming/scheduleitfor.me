/*
 * GET a schedule.
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var result = require('./result');

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
    // Get user ip
    var ip = req.headers['x-forwarded-for'] 
        || req.connection.remoteAddress 
        || req.socket.remoteAddress 
        || req.connection.socket.remoteAddress;
    if (ip.indexOf(',') != -1) {
        ip = ip.substring(0, ip.indexOf(','));
    }
    // Check if ip already exists
    redisClient.lrange('schedule:'+req.body.schedule+':iplist', 0, -1, function(err, reply) {
        if (reply.indexOf(ip) != -1 && req.body.duplicate == 0) {
            res.send('You have already indicated your response');
        } else {
            var selectedrange = JSON.parse(req.body.selectedrange);
            // Increment each available date of recordset
            for (i=0;i<selectedrange.length;i++) {
                redisClient.zincrby('schedule:'+req.body.schedule+':selectedrange', 1, selectedrange[i]); 
            }
            // Increment usercount
            redisClient.incr('schedule:'+req.body.schedule+':usercount', function(err,reply) {
                res.send(); // Reply to callback success
            });
            // Adds user to userlist and userlist:day if not anonymous
            if (req.body.anonymous == '0') {
                redisClient.rpush('schedule:'+req.body.schedule+':userlist', req.body.username, function(err, reply) {
                    for (i=0;i<selectedrange.length;i++) {
                        redisClient.rpush('schedule:'+req.body.schedule+':userlist:'+selectedrange[i], reply-1);
                    }
                });
                result.broadcastAvailability(req.body.schedule, req.body.username, selectedrange);
            }
            // Adds user ip to iplist
            redisClient.rpush('schedule:'+req.body.schedule+':iplist', ip);
        }
	});
}