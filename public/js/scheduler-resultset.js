/*!
* jQuery functions
* Dependencies:  jQuery 1.11.1+
* Author:  Chang Chu-Ming
* Email:  changchuming@gmail.com
* Project Homepage:  
*/

(function($) {
	//-----------------------------------------------------------------------------------------------
	// Global variables
	// ----------------------------------------------------------------------------------------------
	var maxMonths = 6;
	var startDay = moment(data.startday);;
	var MODE_TIME = 0;
	var MODE_DATE = 1;
	var currentMode = data.mode;
	var currentEventLength = data.length;
	
	//-----------------------------------------------------------------------------------------------
	// Default settings
	//-----------------------------------------------------------------------------------------------

	//###############################################################################################
	// On document ready, initialize calendar
	//###############################################################################################
	$().ready(function() {
		$('#previous').attr('disabled', true); // Disable previous button
		$.initializeEventDetails();
		if (currentMode == MODE_DATE) {
			$.initializeDateResultSet();
		}
		else if (currentMode == MODE_TIME) {
			$.initializeTimeResultSet();	
		}
	});
	
	//###############################################################################################
	// Initialize details of event
	//###############################################################################################
	$.initializeEventDetails = function() {
		if (data.name != "") {
			var eventName = $('<h3>Event: ' + data.name + '</h3>');
			$('#containertop').append(eventName);
		}
		if (data.details != "") {
			var eventDetails = $('<h3>Details: ' + data.details + '</h3>');
			$('#containertop').append(eventDetails);
		}
		if (currentMode == MODE_DATE) {
			var eventLength = $('<h3>Length of event: ' + data.length + ' day(s)</h3>');
		}
		else if (currentMode == MODE_TIME) {
			var eventLength = $('<h3>Length of event: ' + data.length + ' hour(s)</h3>');
		}
		$('#containertop').append(eventLength);
	}
	
	//###############################################################################################
	// Initialize date result set
	//###############################################################################################
	$.initializeDateResultSet = function() {
		// Header
		$('#containercenter').append('<h2>Top 10 available dates</h2>');
		// Results
		var dateStoreArray = new Array();
		for (var i = 0;i<resultset.length;i+=2) {
			dateStoreArray.push(resultset[i]); // Add date number to date store array
			// If next date has different count, sort and display all dates in date store array
			if (resultset[i+1] != resultset[i+3]) {
				dateStoreArray.sort(function(a, b){return a-b}); // Sort dates in ascending order
				// Display each date
				for (var j=0;j<dateStoreArray.length;j++) {
					var percent = Math.round(resultset[i+1]/parseInt(usercount)*100); // Number of available users as a percent of all users
					$('#containercenter').append('<h3>'+(i/2-dateStoreArray.length+j+2)+'. '+moment(startDay).date(0).add('days', dateStoreArray[j]).format('dddd, MMMM Do')+'</h3>');
					var bartext = $('<div id="bartext">' + resultset[i+1] + '/' + parseInt(usercount) + ' (' + percent + '%)' + '</div>'); // Text on bar
					bartext.css('width', percent + '%');
					var bar = $('<div id="bar"/>').progressbar({value: percent}); // Bar
					bar.append(bartext);
					$('#containercenter').append(bar); // Add bar to container
				}
				dateStoreArray.length = 0; // Clear array
			}
		}
	}
	
	//###############################################################################################
	// Initialize time result set
	//###############################################################################################
	$.initializeTimeResultSet = function() {
		// Header
		$('#containercenter').append('<h2>Top 10 available times</h2>');
		// Results
		var timeStoreArray = new Array();
		for (var i = 0;i<resultset.length;i+=2) {
			timeStoreArray.push(resultset[i]); // Add date number to date store array
			// If next date has different count, sort and display all dates in date store array
			if (resultset[i+1] != resultset[i+3]) {
				timeStoreArray.sort(function(a, b){return a-b}); // Sort dates in ascending order
				// Display each date
				for (var j=0;j<timeStoreArray.length;j++) {
					var percent = Math.round(resultset[i+1]/parseInt(usercount)*100); // Number of available users as a percent of all users
					$('#containercenter').append('<h3>'+(i/2-timeStoreArray.length+j+2)+'. '+moment(startDay).hour(0).minute(0).add('hours', timeStoreArray[j]-1).format('ha, dddd, MMMM Do')+'</h3>');
					var bartext = $('<div id="bartext">' + resultset[i+1] + '/' + parseInt(usercount) + ' (' + percent + '%)' + '</div>'); // Text on bar
					bartext.css('width', percent + '%');
					var bar = $('<div id="bar"/>').progressbar({value: percent}); // Bar
					bar.append(bartext);
					$('#containercenter').append(bar); // Add bar to container
				}
				timeStoreArray.length = 0; // Clear array
			}
		}
	}
	
	// Create overlay
	$.createOverlay = function() {
		$('#overlay').height($(document).height());
		$('#overlay').css('visibility', 'visible');
		$('#alert').html('</br>Your schedule has been created at</br></br>' + 
				'<a href="' + $(location).attr('href') + reply.reply + '">' + 
				$(location).attr('href') + reply.reply + '</a>');
		$('#alert').css('margin-top', $(document).scrollTop()+200);
		$('#alert').css('visibility', 'visible');
	}
	
	//###############################################################################################
	// Removes overlay when clicked
	//###############################################################################################
	$('#overlay').mouseup(function() {
		$(this).css('visibility', 'hidden');
		$('#alert').css('visibility', 'hidden');
	});
})(jQuery);