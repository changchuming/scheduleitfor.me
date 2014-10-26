
/*
 * GET home page.
 */

//##############################################################################################
// Display home page
//##############################################################################################
exports.index = function(req, res){
  res.render('index', { title: 'Scheduler'});
};

//##############################################################################################
//Create schedule
//##############################################################################################
exports.create = function(req, res) {
	redisClient.incr('lastindex', function(err, reply) {
		redisClient.hmset('schedule:'+reply, req.body, function(err, reply2) {
			res.send({reply: reply});
		});
		console.log(req.body);
	 	console.log(reply + ' is the last index');
	});
}