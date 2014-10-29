/// <reference path="../definitions/browserify.d.ts" />
var $ = require('jquery'),
	moment = require('moment');

// Shim jQuery
interface Window {$: any; jQuery: any};
window.$ = window.jQuery = $;

require('jquery-ui');
require('jquery-ui-touch-punch');
require('bootstrap');

initializeUtilityFunctions();

// Global variables
var startDay = moment(),
	_mode = { // Refers to the selectionMode
		byTime: 0,
		byDate: 1,
	},
	currentMode = _mode.byTime,
	weekdayHeader;  // Header of calendar

// Time
var MAX_WEEKS = 26,
	DAYS_IN_WEEK = 7,
	UNITS_IN_DAY = 24,
	startWeekIndex = startDay.week(),
	currentWeekIndex = startWeekIndex,
	timeArray = [];

// Date
var MAX_MONTHS = 6,
	startMonthIndex = startDay.month(), // Set start month of calendar to this month
	currentMonthIndex = startMonthIndex, // Set current month to this month
	dateArray = new Array(); // Array of dates selected

// Event length
var MAX_LENGTH = 14;
var currentEventLength = 1;

// Default functions for selectables
var selectableDefaults = {
	selected: function (event, ui) {
	    if ($(ui.selected).hasClass('chosenfilter')) {
	        $(ui.selected).removeClass('chosenfilter').removeClass('ui-selected');
	    } else {
	        $(ui.selected).addClass('chosenfilter').addClass('ui-selected');
	    }
	},
	selecting: function (event, ui) {
		if ($(ui.selecting).hasClass('chosenfilter')) {
			$(ui.selecting).addClass('ui-unselecting');
			$(ui.selecting).removeClass('ui-selected');
	    }
	},
	unselecting: function (event, ui) {
		if ($(ui.unselecting).hasClass('chosenfilter')) {
			$(ui.unselecting).removeClass('ui-unselecting');
			$(ui.unselecting).addClass('ui-selected');
	    }
	}
};

// Initialization
$(function() {
	$('#anonymous').prop('checked', true);
	$('#previous').attr('disabled', true); // Disable previous button

	eventList.initialize();

	if (currentMode == _mode.byTime) {
		$.initializeTimeCalendar();
	}
	else if (currentMode == _mode.byDate) {
		$.initializeDateCalendar();
	}
});

// EventList Code
var eventList = {
	initialize: function(){
		this.create(currentMode);
		this.listenForEvents();
	},

	create: function(currMode: number) : void{
		var $eventLengthSection = $('#currentEventLength');;

		setTitle($eventLengthSection, currMode);
		createDurationSelector($eventLengthSection);

		function setTitle($section, currMode: number){
			var template = '<h3> {0} {1}</h3>';
			// Set Event Length Title
			if(currMode == _mode.byDate){
				$section.html(template.format(currentEventLength, 'day(s)'));
			}
			else if(currMode == _mode.byTime){
				$section.html(template.format(currentEventLength, 'hour(s)'));
			}
		}

		function createDurationSelector($eventLengthSection){
			var $eventLengthList = $('<ol id="eventLengthList"></ol>'),
				$eventItems = "";

			for (var i = 1; i <= 14; i++) {
				$eventItems += '<li class="ui-state-default" length ="{0}">{0}</li>'.format(i);
			}

			$eventLengthSection.append($eventLengthList.append($eventItems));
		}
	},

	listenForEvents: function(): void{
		//Enable selection + drag and drop of duration
		$('#eventLengthList').bind('mousedown', function (e){
		    e.metaKey = true;
		})
		.selectable({
			selected: function (event, ui) {
				selectableDefaults.selected(event, ui);
				currentEventLength = parseInt($(ui.selected).attr('length')); // Copies temporary length to event length
			},
			selecting: function (event, ui) {
				selectableDefaults.selecting(event, ui);
			},
			unselecting: function (event, ui) {
				selectableDefaults.unselecting(event, ui);
			}
		});

		// Change mode on mouse up
		$('#eventLength').on('mouseup', '.mode', function(event) {
			currentMode = $(this).attr('mode');
			if (currentMode == _mode.byTime) {
				$.initializeTimeCalendar();
			}
			else if (currentMode == _mode.byDate) {
				$.initializeDateCalendar();
			}
		})
	}
}

// Initialize date calendar on page
$.initializeDateCalendar = function(){
	// Month title
	$('#title').html(moment.months(currentMonthIndex));
	// Header of table
	weekdayHeader = $('<tr></tr>');
	for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
		var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
		weekdayHeader.append('<td class="date header">' + weekdayName + '</td>');
	}

	var startDateIndex =  $.getStartDateIndex(currentMonthIndex); // Get start date index of current month
	var currentDateIndex = 1; // Set current date index to 1
	var daysInMonth = moment(startDay).month(currentMonthIndex).daysInMonth(); // Get number of days in the month
	var daysToSkip = moment(startDay).month(currentMonthIndex).date(1).day(); // Skips the days of the first week that are not part of the month

	var dateList = $('<ol id="datelist"></ol>'); // Selectable list
	// Populate list
	for (var i=0;i<daysToSkip;i++){
		var dateListItem = $('<li class="ui-state-disabled"></li>');
		dateList.append(dateListItem);
	}
	for (i=0;i<daysInMonth;i++) {
		var date = startDateIndex+currentDateIndex;
		var dateListItem = $('<li class="ui-state-default">'+currentDateIndex+'</li>');
		if ($.inArray(date, dateArray) != -1) {
			dateListItem.addClass('ui-selected');
			dateListItem.addClass('chosenfilter');
		}
		dateListItem.attr('date', date);
		dateList.append(dateListItem);
		currentDateIndex++;
	}

	var calendarHead = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>'); // calendarTable - calendar of the month
	calendarHead.append(weekdayHeader); // Put header and body into calendar
	$('#calendar').html(calendarHead); // Place table into div
	$('#calendar').append(dateList);
}

// Set options of dateList
$(function() {
	$('#datelist').bind('mousedown', function (e){
	    e.metaKey = true;
	})
	.selectable({
		selected: function (event, ui) {
			selectableDefaults.selected(event, ui);
			var date = parseInt($(ui.selected).attr('date'));
			// Add date to dateArray
			if ($(ui.selected).hasClass('chosenfilter')) {
				if ($.inArray(date, dateArray) == -1) {
					// Adds date
					dateArray.push(date);
				}
			}
			// Else remove date from dateArray
			else {
				var index = dateArray.indexOf(date);
				if (index > -1) {
					dateArray.splice(index, 1);
				}
			}
		},
		selecting: function (event, ui) {
			selectableDefaults.selecting(event, ui);
		},
		unselecting: function (event, ui) {
			selectableDefaults.unselecting(event, ui);
		},
		filter: ".ui-state-default"
	});
});

// Initialize time calendar on page
$.initializeTimeCalendar = function() {
	// Month title
	var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
	var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
	$('#title').html(startDayOfWeek.date()+' - '+endDayOfWeek.date()+' '+moment.months(endDayOfWeek.month()));
	// Header of table
	weekdayHeader = $('<tr></tr>');
	weekdayHeader.append('<td class="time header">Time</td>');
	for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
		var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
		weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date()+weekdayIndex) + '</td>');
	}

	var currentTime = moment(startDay).hour(0).minute(0); // Track and display time on each timeRow

	var timeList = $('<ol id="timelist"></ol>'); // Selectable list
	// Populate list
	for (var timeIndex=1; timeIndex<=UNITS_IN_DAY; timeIndex++) {
		// Add vertical headers
		var timeListItem = $('<li class="ui-state-disabled">'+currentTime.format('HH:mm')+'</li>');
		currentTime.add('hours', 1); // Increment hour
		timeList.append(timeListItem);

		for (var weekdayIndex=0; weekdayIndex<DAYS_IN_WEEK; weekdayIndex++) {
			var timeListItem = $('<li class="ui-state-default"></li>');
			timeListItem.attr('time', weekdayIndex*UNITS_IN_DAY+timeIndex);
			timeList.append(timeListItem);
		}
	}

	var weekCalendar = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>'); // calendarTable - calendar of the month
	weekCalendar.append(weekdayHeader); // Put header into calendar
	$('#calendar').html(weekCalendar); // Place table into div
	$('#calendar').append(timeList);
}

// Set options of timeList
$(function() {
	$('#timelist').bind('mousedown', function (e){
	    e.metaKey = true;
	})
	.selectable({
		selected: function (event, ui) {
			selectableDefaults.selected(event, ui);
			var startTimeIndex =  (currentWeekIndex-startWeekIndex)*DAYS_IN_WEEK*UNITS_IN_DAY; // Get start time index of current week
			var time = parseInt($(ui.selected).attr('time'))+startTimeIndex;
			// Add time to timeArray
			if ($(ui.selected).hasClass('chosenfilter')) {
				if ($.inArray(time, timeArray) == -1) {
					// Adds time
					timeArray.push(time);
				}
			}
			// Else remove time from dateArray
			else {
				var index = timeArray.indexOf(time);
				if (index > -1) {
					timeArray.splice(index, 1);
				}
			}
		},
		selecting: function (event, ui) {
			selectableDefaults.selecting(event, ui);
		},
		unselecting: function (event, ui) {
			selectableDefaults.unselecting(event, ui);
		},
		filter: ".ui-state-default"
	});
});

// Get start date index of month
$.getStartDateIndex = function(monthIndex) {
	var dateIndex = 0;
	// Adds all dates of previous month
	for (var i=startMonthIndex;i<monthIndex;i++) {
		dateIndex += moment(startDay).month(i).daysInMonth();
	}
	return dateIndex;
}

//On previous button clicked, change month to previous month
$('#previous').click(function() {
	if (currentMode == _mode.byDate) {
		currentMonthIndex--; // Change current month to previous month
		$.initializeDateCalendar();
		// Enables next button
		$('#next').attr('disabled', false);
		// Disable this button if limit reached
		if (currentMonthIndex <= startMonthIndex) {
			$(this).attr('disabled', true);
		}
	}
	else if (currentMode == _mode.byTime) {
		currentWeekIndex--; // Change current month to previous month
		// Change title of calendar and header
		var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
		var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
		$('#title').html(startDayOfWeek.date()+' - '+endDayOfWeek.date()+' '+moment.months(endDayOfWeek.month()));
		weekdayHeader.html('<tr></tr>');
		weekdayHeader.append('<td class="time header">Time</td>');
		for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
			var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
			weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date()+weekdayIndex) + '</td>');
		}
		// Enables next button
		$('#next').attr('disabled', false);
		// Disable this button if limit reached
		if (currentWeekIndex <= startWeekIndex) {
			$(this).attr('disabled', true);
		}
		$.resetTimeCalendar();
	}
});

//On next button clicked, change month to previous month
$('#next').click(function() {
	if (currentMode == _mode.byDate) {
		currentMonthIndex++; // Change current month to next month
		$.initializeDateCalendar();
		// Enables previous button
		$('#previous').attr('disabled', false);
		// Disable this button if limit reached
		if (currentMonthIndex >= startMonthIndex+MAX_MONTHS) {
			$(this).attr('disabled', true);
		}
	}
	else if (currentMode == _mode.byTime) {
		currentWeekIndex++; // Change current month to next month
		// Change title of calendar and header
		var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
		var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
		$('#title').html(startDayOfWeek.date()+' - '+endDayOfWeek.date()+' '+moment.months(endDayOfWeek.month()));
		weekdayHeader.html('<tr></tr>');
		weekdayHeader.append('<td class="time header">Time</td>');
		for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
			var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
			weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date()+weekdayIndex) + '</td>');
		}
		// Enables previous button
		$('#previous').attr('disabled', false);
		// Disable this button if limit reached
		if (currentWeekIndex >= startWeekIndex+MAX_WEEKS) {
			$(this).attr('disabled', true);
		}
		$.resetTimeCalendar();
	}
});

// Resets time calendar
$.resetTimeCalendar  = function() {
	var startTimeIndex=(currentWeekIndex-startWeekIndex)*DAYS_IN_WEEK*UNITS_IN_DAY;
	for (var i=1; i<=UNITS_IN_DAY;i++) {
		for (var j=0;j<DAYS_IN_WEEK;j++) {
			var time = j*UNITS_IN_DAY+i;
			if ($.inArray(startTimeIndex+time, timeArray) == -1) {
				// If time is not in timeArray
				$('li[time='+time+']').removeClass('ui-selected');
				$('li[time='+time+']').removeClass('chosenfilter');
			}
			else {
				// If time is in timeArray
				$('li[time='+time+']').addClass('ui-selected');
				$('li[time='+time+']').addClass('chosenfilter');
			}
		}
	}
}

// Create schedule
// Shows overlay with success/failure message
$('#create').click(function() {
	// Check that dates or time are selected, if not, warn user
	if ((currentMode == _mode.byDate && dateArray.length==0) || (currentMode == _mode.byTime && timeArray.length==0)) {
		$('#overlay').height($(document).height());
		$('#overlay').css('visibility', 'visible');
		$('#alert').html('</br></br> Please select range</br>of available dates/time');
		$('#alert').css('margin-top', $(document).scrollTop()+200);
		$('#alert').css('visibility', 'visible');
	}
	// If selected, create schedule
	else {
		if (currentMode == _mode.byDate) {
			var selectedArray = dateArray;
		}
		else if (currentMode == _mode.byTime) {
			var selectedArray = timeArray;
		}
		$.ajax({
			type: 'POST',
			url: '/create',
			data: {
				name: $('#name').val(),
				details: $('#details').val(),
				anonymous: $('#anonymous').is(':checked') ? 1 : 0,
				multiple: $('#multiple').is(':checked') ? 1 : 0,
				length: currentEventLength,
				startday: startDay.format(),
				mode: currentMode,
				daterange: JSON.stringify(selectedArray)
				},
			success: function(reply) {
				$('#overlay').height($(document).height());
				$('#overlay').css('visibility', 'visible');
				$('#alert').html('</br>Your schedule has been created at</br></br>' +
						'<a href="' + $(location).attr('href') + reply.reply + '">' +
						$(location).attr('href') + reply.reply + '</a>');
				$('#alert').css('margin-top', $(document).scrollTop()+200);
				$('#alert').css('visibility', 'visible');
			 }
			});
	}
});

// Removes overlay when clicked
$('#overlay').mouseup(function() {
	$(this).css('visibility', 'hidden');
	$('#alert').css('visibility', 'hidden');
});

interface String {
    format(...replacements: any[]): string;
}

function initializeUtilityFunctions()
{
	if (!String.prototype.format) {
		String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number){
			return typeof args[number] != 'undefined'
				? args[number]
				: match;
			});
		};
	}
}