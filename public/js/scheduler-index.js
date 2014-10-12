/*!
* jQuery functions
* Dependencies:  jQuery 1.11.1+
* Author:  Chang Chu-Ming
* Email:  changchuming@gmail.com
* Function: Scheduler homepage
*/

(function($) {
	//-----------------------------------------------------------------------------------------------
	// Global variables
	// ----------------------------------------------------------------------------------------------
	
	var startDay = moment();
	var MODE_TIME = 0;
	var MODE_DATE = 1;
	var currentMode = MODE_DATE;
	var weekdayHeader; // Header of calendar
	
	// Time
	var MAX_WEEKS = 26;
	var DAYS_IN_WEEK = 7;
	var UNITS_IN_DAY = 24;
	var startWeekIndex = startDay.week();
	var currentWeekIndex = startWeekIndex;
	var timeArray = new Array();
	var dragStartColumn;
	var dragStartRow;
	var dragEndColumn;
	var dragEndRow;
	
	// Date
	var MAX_MONTHS = 6;
	var startMonthIndex = startDay.month(); // Set start month of calendar to this month
	var currentMonthIndex = startMonthIndex; // Set current month to this month
	var dateArray = new Array(); // Array of dates selected
	var dragIndexStart; // Index of date at drag start
	var dragIndexEnd; // Index of date at date end
	
	// Calendar
	var isCalendarMouseDown = false; // Boolean flag to check for calendar drag
	var isAdding; // If user is adding dates or hours, true, else is user is removing dates or hours, false
	
	// Event length
	var MAX_LENGTH = 14;
	var currentEventLength = 1;
	var isEventLengthMouseDown = false; // Boolean flag to check for event length drag
	var dragEventLength; // drag length of event
	
	//-----------------------------------------------------------------------------------------------
	// Default settings
	//-----------------------------------------------------------------------------------------------
	var cssDefaults = {
		background_default: 'url(css/images/day-bg-beige.png) bottom right no-repeat',
		background_selected: 'url(css/images/day-bg-darkblue.png) bottom right no-repeat',
		background_deselect: 'url(css/images/day-bg-grey.png) bottom right no-repeat',
		background_select: 'url(css/images/day-bg-lightblue.png) bottom right no-repeat',
		background_disabled: 'url(css/images/day-bg-inactive.png) bottom right no-repeat',
//		background_default: '',
//		background_selected: 'deepskyblue',
//		background_deselect: 'grey',
//		background_select: 'lightblue',
//		background_disabled: '',
	};

	//###############################################################################################
	// On document ready, initialize calendar
	//###############################################################################################
	$().ready(function() {
		$('#anonymous').prop('checked', true);
		$('#previous').attr('disabled', true); // Disable previous button
		$.initializeEventLength();
		if (currentMode == MODE_TIME) {
			$.initializeTimeCalendar();
		}
		else if (currentMode == MODE_DATE) {
			$.initializeDateCalendar();
		}
	});
	

	//###############################################################################################
	// Initialize length of event
	//###############################################################################################
	$.initializeEventLength = function() {
		if (currentMode==MODE_DATE) {
			$('#currenteventlength').html('<h3>'+currentEventLength+' day(s)</h3>'); // Display current event length
		}
		else if (currentMode==MODE_TIME) {
			$('#currenteventlength').html('<h3>'+currentEventLength+' hour(s)</h3>'); // Display current event length
		}
		
		// First row
		var eventLengthRow = $('<tr></tr>'); // Row in table of event length
		for (i=1;i<=7;i++) {
			var eventLengthUnit = $('<td class="length"></td>'); // Event length unit
			if (i<=currentEventLength) {
				eventLengthUnit.css('background', cssDefaults.background_selected);
			}
			else {
				eventLengthUnit.css('background', cssDefaults.background_default);
			}
			eventLengthUnit.attr('length', i);
			eventLengthRow.append(eventLengthUnit); // Add unit to row
		}
		// Add date unit
		var dateUnit = $('<td class="mode">Day(s)</td>'); 
		if (currentMode==MODE_DATE) {
			dateUnit.css('background', cssDefaults.background_selected);
		}
		else {
			dateUnit.css('background', cssDefaults.background_default);
		}
		dateUnit.attr('mode', MODE_DATE);
		eventLengthRow.append(dateUnit);
		// Second row
		var eventLengthRow2 = $('<tr></tr>'); // Row in table of event length
		for (i=8;i<=14;i++) {
			var eventLengthUnit = $('<td class="length"></td>'); // Event length unit
			if (i<=currentEventLength) {
				eventLengthUnit.css('background', cssDefaults.background_selected);
			}
			else {
				eventLengthUnit.css('background', cssDefaults.background_default);
			}
			eventLengthUnit.attr('length', i);
			eventLengthRow2.append(eventLengthUnit); // Add unit to row
		}
		// Add time unit
		var timeUnit = $('<td class="mode">Hour(s)</td>'); 
		if (currentMode==MODE_TIME) {
			timeUnit.css('background', cssDefaults.background_selected);
		}
		else {
			timeUnit.css('background', cssDefaults.background_default);
		}
		timeUnit.attr('mode', MODE_TIME);
		eventLengthRow2.append(timeUnit);
		var eventLengthTable = $('<table id="eventlengthtable" cellpadding="0" tablespacing="0"></table>'); // Table of length of event
		eventLengthTable.append(eventLengthRow); // Add row to table
		eventLengthTable.append(eventLengthRow2); // Add row2 to table
		$('#eventlength').html(eventLengthTable);
	}
	
	//###############################################################################################
	// Attach mouse events to event length boxes
	//###############################################################################################
	$('#eventlength').on('mousedown', '.length', function(event) {
		isEventLengthMouseDown = true;
		$(this).mouseover();
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseover', '.length', function(event) {
		if (isEventLengthMouseDown) {
			dragEventLength = parseInt($(this).attr('length')); // Sets temporary length to index of cell dragged
			for (j=1;j<=MAX_LENGTH;j++) {
				if (j<=dragEventLength) {
					$('td[length='+j+']').css('background', cssDefaults.background_select);
				}
				else {
					$('td[length='+j+']').css('background', cssDefaults.background_default);
				}
			}
		}
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseup', '.length', function(event) {
		if (isEventLengthMouseDown) {
			isEventLengthMouseDown = false;
			currentEventLength = dragEventLength; // Copies temporary length to event length
			$.initializeEventLength(); // Reset event length
			event.stopPropagation();
			event.preventDefault();
			return true;
		}
	});
	
	//###############################################################################################
	// Attach mouse events to mode selection boxes
	//###############################################################################################
	$('#eventlength').on('mouseup', '.mode', function(event) {
		currentMode = $(this).attr('mode');
		if (currentMode == MODE_TIME) {
			$.initializeTimeCalendar();
		}
		else if (currentMode == MODE_DATE) {
			$.initializeDateCalendar();
		}
	})
	
	//###############################################################################################
	// Initialize month calendar on page
	//###############################################################################################
	$.initializeDateCalendar = function(){
		// Month title
		$('#title').html(moment.months(currentMonthIndex));
		// Header of table
		var calendarHead = $('<thead></thead>');
		weekdayHeader = $('<tr></tr>');
		for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
			var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
			weekdayHeader.append('<td class="date header">' + weekdayName + '</td>');
		}
		calendarHead.append(weekdayHeader); // Place weekday headers into table header
		
		// Body of table
		var calendarBody =  $('<tbody></tbody>');

		var startDateIndex =  $.getStartDateIndex(currentMonthIndex); // Get start date index of current month
		var currentDateIndex = 1; // Set current date index to 1
		var daysInMonth = moment(startDay).month(currentMonthIndex).daysInMonth(); // Get number of days in the month
		var daysToSkip = moment(startDay).month(currentMonthIndex).date(1).day(); // Skips the days of the first week that are not part of the month

		// Create dateBoxes for the month
		for (var weekIndex=0; currentDateIndex<=daysInMonth; weekIndex++) {
			var weekRow = $('<tr></tr>'); // weekRow - each week of the month
			calendarBody.append(weekRow); // Place weekRow into table
			for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++) {
				// If day is not part of the month, show empty empty box
				if (daysToSkip>0 || currentDateIndex > daysInMonth){
					var dayBox = $('<td class="date disabled"></td>');
					weekRow.append(dayBox); // Place dayBox into weekRow
					daysToSkip--;
				}
				// Else show day of the month
				else {
					var dayBox = $('<td class="date enabled">' + currentDateIndex + '</td>'); // dayBox - each day of the week
					weekRow.append(dayBox); // Place dayBox into weekRow
					dayBox.attr('date', startDateIndex+currentDateIndex); // Set dayBox identifier
					currentDateIndex++; // Update currentDay
				}
			}
		}
		
		var monthCalendar = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>'); // calendarTable - calendar of the month
		monthCalendar.append(calendarHead, calendarBody); // Put header and body into calendar
		$('#calendar').html(monthCalendar); // Place table into div
	}
	
	//###############################################################################################
	// Attach mouse events for dayBoxes
	//###############################################################################################
	$('#calendar').on('mousedown', '.date.enabled', function(event) {
		// Starts drag
		isCalendarMouseDown = true;
		// Sets whether user is adding or removing dates
		if ($.inArray(parseInt($(this).attr('date')), dateArray) == -1) {
			isAdding = true;
		}
		else {
			isAdding = false;
		}
		dragIndexStart = parseInt($(this).attr('date'));
		dragIndexEnd = parseInt($(this).attr('date'));
		// Recolour cell
		if (isAdding) {
			$(this).css('background', cssDefaults.background_select); // If user is adding dates
		}
		else {
			$(this).css('background', cssDefaults.background_deselect); // If user is removing dates
		}
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseover', '.date.enabled', function(event) {
		// If user is currently dragging
		if (isCalendarMouseDown && parseInt($(this).attr('date')) >= dragIndexStart) {
			// Recolour selected cells
			for (i=dragIndexEnd+1;i<=parseInt($(this).attr('date'));i++) {
				if (isAdding) {
					$('td[date='+i+']').css('background', cssDefaults.background_select); // If user is adding dates
				}
				else {
					$('td[date='+i+']').css('background', cssDefaults.background_deselect); // If user is removing dates
				}
			}
			// Recolour deselected cells
			for (i=parseInt($(this).attr('date'))+1;i<=dragIndexEnd;i++) {
				// Remove colour if not originally selected
				if ($.inArray(i, dateArray) == -1) {
					$('td[date='+i+']').css('background', cssDefaults.background_default);
				}
				// Else change colour to originally selected colour
				else {
					$('td[date='+i+']').css('background', cssDefaults.background_selected);
				}
			}
			dragIndexEnd = parseInt($(this).attr('date'));
			
		}
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseup', '.date.enabled', function(event) {
		// Stops drag and add/remove dates
		if (isCalendarMouseDown){
			for (i=dragIndexStart;i<=dragIndexEnd;i++) {
				// If user is adding dates
				if (isAdding) {
					if ($.inArray(i, dateArray) == -1) {
						dateArray.push(i);
					}
				}
				// If user is removing dates
				else {
					var index = dateArray.indexOf(i);
					if (index > -1) {
						dateArray.splice(index, 1);
					}
				}
			}
		}
		// Sorts dates numerically
		dateArray.sort(function(a, b){return a-b});
		isCalendarMouseDown = false;
		$.reset(); // Reset calendar table colours
		event.stopPropagation();
		event.preventDefault();
		return true;
	});
	
	//###############################################################################################
	// Initialize time calendar on page
	//###############################################################################################
	$.initializeTimeCalendar = function() {
		// Month title
		startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
		endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
		$('#title').html(startDayOfWeek.date()+' - '+endDayOfWeek.date()+' '+moment.months(endDayOfWeek.month()));
		// Header of table
		var calendarHead = $('<thead></thead>');
		weekdayHeader = $('<tr></tr>');
		weekdayHeader.append('<td class="time header">Time</td>');
		for (var weekdayIndex=0; weekdayIndex<7; weekdayIndex++){
			var weekdayName=moment.weekdays(weekdayIndex).substring(0,3);
			weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date()+weekdayIndex) + '</td>');
		}
		calendarHead.append(weekdayHeader); // Place weekday headers into table header

		// Body of table
		var calendarBody =  $('<tbody></tbody>');

		var currentTime = moment(startDay).hour(0).minute(0); // Track and display time on each timeRow
		
		// Create timeBoxes for the week
		for (var timeIndex=1; timeIndex<=UNITS_IN_DAY; timeIndex++) {
			var timeRow = $('<tr></tr>'); // timeRow - each period of time
			calendarBody.append(timeRow); // Place timeRow into table
			timeRow.append('<td class="time">'+currentTime.format('HH:mm')+'</td>')
			currentTime.add('hours', 1);
			// Each weekday in row
			for (var weekdayIndex=0; weekdayIndex<DAYS_IN_WEEK; weekdayIndex++) {
				var timeBox = $('<td class="time enabled"></td>'); // timeBox - each time of the weekday
				timeRow.append(timeBox); // Add timebox to timeRow
				timeBox.attr('column', weekdayIndex); // Set timebox identifier
				timeBox.attr('row', timeIndex);
			}
		}
		
		var weekCalendar = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>'); // calendarTable - calendar of the month
		weekCalendar.append(calendarHead, calendarBody); // Put header and body into calendar
		$('#calendar').html(weekCalendar); // Place table into div
	}
	
	//###############################################################################################
	// Attach mouse events for timeBoxes
	//###############################################################################################
	$('#calendar').on('mousedown', '.time.enabled', function(event) {
		// Starts drag
		isCalendarMouseDown = true;
		// Set start and end index
		dragStartColumn = parseInt($(this).attr('column'));
		dragStartRow = parseInt($(this).attr('row'));
		dragEndColumn = parseInt($(this).attr('column'));
		dragEndRow = parseInt($(this).attr('row'));
		
		var startTimeIndex =  (currentWeekIndex-startWeekIndex)*DAYS_IN_WEEK*UNITS_IN_DAY; // Get start time index of current week
		// Sets whether user is adding or removing units
		if ($.inArray(startTimeIndex+dragStartColumn*UNITS_IN_DAY+dragStartRow, timeArray) == -1) {
			isAdding = true;
		}
		else {
			isAdding = false;
		}
		// Recolour cell
		if (isAdding) {
			$(this).css('background', cssDefaults.background_select); // If user is adding units
		}
		else {
			$(this).css('background', cssDefaults.background_deselect); // If user is removing units
		}
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseover', '.time.enabled', function(event) {
		// Temporary store new end index
		var dragNewEndColumn = parseInt($(this).attr('column'));
		var dragNewEndRow = parseInt($(this).attr('row'));
		// If user is currently dragging
		if (isCalendarMouseDown && dragNewEndRow>=dragStartRow && dragNewEndColumn>=dragStartColumn) {
			// Recolour selected cells
			for (j=dragEndColumn;j<=dragNewEndColumn;j++) {
				for (i=dragStartRow;i<=dragNewEndRow;i++) {
					if (isAdding) {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_select); // If user is adding units
					}
					else {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_deselect); // If user is removing units
					}
				}
			}
			for (i=dragEndRow;i<=dragNewEndRow;i++) {
				for (j=dragStartColumn;j<=dragNewEndColumn;j++) {
					if (isAdding) {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_select); // If user is adding units
					}
					else {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_deselect); // If user is removing units
					}
				}
			}
			// Recolour deselected cells
			for (j=dragNewEndColumn+1;j<=dragEndColumn;j++) {
				for (i=dragStartRow;i<=dragEndRow;i++) {
					// Remove colour if not originally selected
					if ($.inArray((i*UNITS_IN_DAY+j), timeArray) == -1) {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_default);
					}
					// Else change colour to originally selected colour
					else {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_selected);
					}
				}
			}
			for (i=dragNewEndRow+1;i<=dragEndRow;i++) {
				for (j=dragStartColumn;j<=dragEndColumn;j++) {
					// Remove colour if not originally selected
					if ($.inArray((j*UNITS_IN_DAY+i), timeArray) == -1) {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_default);
					}
					// Else change colour to originally selected colour
					else {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_selected);
					}
				}
			}
			// Set new end index
			dragEndColumn = parseInt($(this).attr('column'));
			dragEndRow = parseInt($(this).attr('row'));
		}
		event.stopPropagation();
		event.preventDefault();
		return true;
	})
	.on('mouseup', '.time.enabled', function(event) {
		// Stops drag and add/remove units
		if (isCalendarMouseDown){
			var startTimeIndex =  (currentWeekIndex-startWeekIndex)*DAYS_IN_WEEK*UNITS_IN_DAY; // Get start time index of current week
			for (i=dragStartColumn;i<=dragEndColumn;i++) {
				for (j=dragStartRow;j<=dragEndRow;j++) {
					// If user is adding units
					if (isAdding) {
						if ($.inArray(startTimeIndex+i*UNITS_IN_DAY+j, timeArray) == -1) {
							timeArray.push(startTimeIndex+i*UNITS_IN_DAY+j);
						}
					}
					// If user is removing units
					else {
						var index = timeArray.indexOf(startTimeIndex+i*UNITS_IN_DAY+j);
						if (index > -1) {
							timeArray.splice(index, 1);
						}
					}
				}
			}
		}
		// Sorts time units numerically
		timeArray.sort(function(a, b){return a-b});
		isCalendarMouseDown = false;
		$.reset(); // Reset calendar table colours
		event.stopPropagation();
		event.preventDefault();
		return true;
	});
	
	//###############################################################################################
	// Get start date index of month
	//###############################################################################################
	$.getStartDateIndex = function(monthIndex) {
		var dateIndex = 0;
		// Adds all dates of previous month
		for (i=startMonthIndex;i<monthIndex;i++) {
			dateIndex += moment(startDay).month(i).daysInMonth();
		}
		return dateIndex;
	}
	
	//###############################################################################################
	//On previous button clicked, change month to previous month
	//###############################################################################################
	$('#previous').click(function() {
		if (currentMode == MODE_DATE) {
			currentMonthIndex--; // Change current month to previous month
			$.initializeDateCalendar();
			// Enables next button
			$('#next').attr('disabled', false);
			// Disable this button if limit reached
			if (currentMonthIndex <= startMonthIndex) {
				$(this).attr('disabled', true);
			}
			$.reset();
		}
		else if (currentMode == MODE_TIME) {
			currentWeekIndex--; // Change current month to previous month
			// Change title of calendar and header
			startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
			endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
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
			$.reset();
		}
	});

	//###############################################################################################
	//On next button clicked, change month to previous month
	//###############################################################################################
	$('#next').click(function() {
		if (currentMode == MODE_DATE) {
			currentMonthIndex++; // Change current month to next month
			$.initializeDateCalendar();
			// Enables previous button
			$('#previous').attr('disabled', false);
			// Disable this button if limit reached
			if (currentMonthIndex >= startMonthIndex+MAX_MONTHS) {
				$(this).attr('disabled', true);
			}
			$.reset();
		}
		else if (currentMode == MODE_TIME) {
			currentWeekIndex++; // Change current month to next month
			// Change title of calendar and header
			startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
			endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
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
			$.reset();
		}
	});
	
	//###############################################################################################
	// Checks for when user stops dragging during mouseup
	//###############################################################################################
	$(document).mouseup(function() {
		isEventLengthMouseDown = false;
		isCalendarMouseDown = false;
		$.initializeEventLength(); // Reset event length
		$.reset(); // Reset calendar table colours
	});
	
	//###############################################################################################
	// Resets selected dates
	//###############################################################################################
	$.reset  = function() {
		if (currentMode == MODE_DATE) {
			var startDateIndex=$.getStartDateIndex(currentMonthIndex)
			for (var i=1; i<=moment(startDay).month(currentMonthIndex).daysInMonth();i++) {
				if ($.inArray(startDateIndex+i, dateArray) == -1) {
					$('td[date='+(startDateIndex+i)+']').css('background', cssDefaults.background_default);
				}
				else {
					$('td[date='+(startDateIndex+i)+']').css('background', cssDefaults.background_selected);
				}
			}
		}
		else if (currentMode == MODE_TIME){
			var startTimeIndex=(currentWeekIndex-startWeekIndex)*DAYS_IN_WEEK*UNITS_IN_DAY;
			for (var i=1; i<=UNITS_IN_DAY;i++) {
				for (var j=0;j<DAYS_IN_WEEK;j++) {
					if ($.inArray(startTimeIndex+j*UNITS_IN_DAY+i, timeArray) == -1) {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_default);
					}
					else {
						$('td[column='+j+'][row='+i+']').css('background', cssDefaults.background_selected);
					}
				}
			}
		}
	}
	
	//###############################################################################################
	// Create schedule
	// Shows overlay with success/failure message
	//###############################################################################################
	$('#create').click(function() {
		// Check that dates or time are selected, if not, warn user
		if ((currentMode==MODE_DATE && dateArray.length==0) || (currentMode==MODE_TIME && timeArray.length==0)) {
			$('#overlay').height($(document).height());
			$('#overlay').css('visibility', 'visible');
			$('#alert').html('</br></br> Please select range</br>of available dates/time');
			$('#alert').css('margin-top', $(document).scrollTop()+200);
			$('#alert').css('visibility', 'visible');
		}
		// If selected, create schedule
		else {
			if (currentMode==MODE_DATE) {
				var selectedArray = dateArray;
			}
			else if (currentMode==MODE_TIME) {
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
	
	//###############################################################################################
	// Removes overlay when clicked
	//###############################################################################################
	$('#overlay').mouseup(function() {
		$(this).css('visibility', 'hidden');
		$('#alert').css('visibility', 'hidden');
	});
})(jQuery);