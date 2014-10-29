/// <reference path="../definitions/browserify.d.ts" />
var $ = require('jquery'), moment = require('moment');

// Shim jQuery
window.$ = window.jQuery = $;

require('jquery-ui');
require('jquery-ui-touch-punch');

var schedule = schedule || {};

// Global variables
var startDay = moment(data.startday);
var MODE_TIME = 0;
var MODE_DATE = 1;
var currentMode = data.mode;
var currentEventLength = data.length;
var availableArray = JSON.parse(data.daterange);
var dateArray = new Array();
var timeArray = new Array();
var weekdayHeader;

// Date mode
var MAX_MONTHS = 6;
var startMonthIndex = startDay.month();
var currentMonthIndex = startMonthIndex;
var dragIndexStart;
var dragIndexEnd;

// Time Mode
var MAX_WEEKS = 23;
var DAYS_IN_WEEK = 7;
var UNITS_IN_DAY = 24;
var startWeekIndex = startDay.week();
var currentWeekIndex = startWeekIndex;
var dragStartColumn;
var dragStartRow;
var dragEndColumn;
var dragEndRow;

var isCalendarMouseDown = false;
var isAdding;

//-----------------------------------------------------------------------------------------------
// Default settings
//-----------------------------------------------------------------------------------------------
var cssDefaults = {
    background_default: 'url(../images/day-bg-beige.png) bottom right no-repeat',
    background_selected: 'url(../images/day-bg-darkblue.png) bottom right no-repeat',
    background_deselect: 'url(../images/day-bg-grey.png) bottom right no-repeat',
    background_select: 'url(../images/day-bg-lightblue.png) bottom right no-repeat',
    background_disabled: 'url(../images/day-bg-inactive.png) bottom right no-repeat'
};

//###############################################################################################
// On document ready, initialize calendar
//###############################################################################################
$(function () {
    $('#previous').attr('disabled', true); // Disable previous button
    $.initializeEventDetails();
    if (currentMode == MODE_TIME) {
        $.initializeTimeCalendar();
        $.reset();
    } else if (currentMode == MODE_DATE) {
        $.initializeDateCalendar();
    }
});

//###############################################################################################
// Initialize details of event
//###############################################################################################
$.initializeEventDetails = function () {
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
    } else if (currentMode == MODE_TIME) {
        var eventLength = $('<h3>Length of event: ' + data.length + ' hour(s)</h3>');
    }
    $('#containertop').append(eventLength);
    if (data.anonymous == '0') {
        var nameInput = $('<textarea id="name" placeholder="Your name"></textarea>');
        $('#containertop').append('</br>');
        $('#containertop').append(nameInput);
    }
};

//###############################################################################################
// Initialize month calendar on page
//###############################################################################################
$.initializeDateCalendar = function () {
    // Month title
    $('#title').html(moment.months(currentMonthIndex));

    // Header of table
    var calendarHead = $('<thead></thead>');
    weekdayHeader = $('<tr></tr>');
    for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
        var weekdayName = moment.weekdays(weekdayIndex).substring(0, 3);
        weekdayHeader.append('<td class="date header">' + weekdayName + '</td>');
    }
    calendarHead.append(weekdayHeader); // Place weekday headers into table header

    // Body of table
    var calendarBody = $('<tbody></tbody>');

    var startDateIndex = $.getStartDateIndex(currentMonthIndex);
    var currentDateIndex = 1;
    var daysInMonth = moment(startDay).month(currentMonthIndex).daysInMonth();
    var daysToSkip = moment(startDay).month(currentMonthIndex).date(1).day();

    for (var weekIndex = 0; currentDateIndex <= daysInMonth; weekIndex++) {
        var weekRow = $('<tr></tr>');
        calendarBody.append(weekRow); // Place weekRow into table
        for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
            // If day is not part of the month, show empty empty box
            if (daysToSkip > 0 || currentDateIndex > daysInMonth) {
                var dayBox = $('<td class="date disabled"></td>');
                weekRow.append(dayBox); // Place dayBox into weekRow
                daysToSkip--;
            } else if ($.inArray(startDateIndex + currentDateIndex, availableArray) == -1) {
                var dayBox = $('<td class="date disabled">' + currentDateIndex + '</td>');
                weekRow.append(dayBox); // Place dayBox into weekRow
                currentDateIndex++; // Update currentDay
            } else {
                var dayBox = $('<td class="date enabled">' + currentDateIndex + '</td>');
                weekRow.append(dayBox); // Place dayBox into weekRow
                dayBox.attr('date', startDateIndex + currentDateIndex); // Set dayBox identifier
                currentDateIndex++; // Update currentDay
            }
        }
    }

    var monthCalendar = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>');
    monthCalendar.append(calendarHead, calendarBody); // Put header and body into calendar
    $('#calendar').html(monthCalendar); // Place table into div
};

//###############################################################################################
// Attach mouse events for dayBoxes
//###############################################################################################
$('#calendar').on('mousedown', '.date.enabled', function (event) {
    // Starts drag
    isCalendarMouseDown = true;

    // Sets whether user is adding or removing dates
    if ($.inArray(parseInt($(this).attr('date')), dateArray) == -1) {
        isAdding = true;
    } else {
        isAdding = false;
    }
    dragIndexStart = parseInt($(this).attr('date'));
    dragIndexEnd = parseInt($(this).attr('date'));

    // Recolour cell
    if (isAdding) {
        $(this).css('background', cssDefaults.background_select); // If user is adding dates
    } else {
        $(this).css('background', cssDefaults.background_deselect); // If user is removing dates
    }
    event.stopPropagation();
    event.preventDefault();
    return true;
}).on('mouseover', '.date.enabled', function (event) {
    // If user is currently dragging
    if (isCalendarMouseDown && parseInt($(this).attr('date')) >= dragIndexStart) {
        for (var i = dragIndexEnd + 1; i <= parseInt($(this).attr('date')); i++) {
            if (isAdding) {
                $('td[date=' + i + ']').css('background', cssDefaults.background_select); // If user is adding dates
            } else {
                $('td[date=' + i + ']').css('background', cssDefaults.background_deselect); // If user is removing dates
            }
        }

        for (var i = parseInt($(this).attr('date')) + 1; i <= dragIndexEnd; i++) {
            // Remove colour if not originally selected
            if ($.inArray(i, dateArray) == -1) {
                $('td[date=' + i + ']').css('background', cssDefaults.background_default);
            } else {
                $('td[date=' + i + ']').css('background', cssDefaults.background_selected);
            }
        }
        dragIndexEnd = parseInt($(this).attr('date'));
    }
    event.stopPropagation();
    event.preventDefault();
    return true;
}).on('mouseup', '.date.enabled', function (event) {
    // Stops drag and add/remove dates
    if (isCalendarMouseDown) {
        for (var i = dragIndexStart; i <= dragIndexEnd; i++) {
            // If date is available
            if ($.inArray(i, availableArray) != -1) {
                // If user is adding dates
                if (isAdding) {
                    if ($.inArray(i, dateArray) == -1) {
                        dateArray.push(i);
                    }
                } else {
                    var index = dateArray.indexOf(i);
                    if (index > -1) {
                        dateArray.splice(index, 1);
                    }
                }
            }
        }
    }

    // Sorts dates numerically
    dateArray.sort(function (a, b) {
        return a - b;
    });
    isCalendarMouseDown = false;
    $.reset(); // Reset calendar table colours
    event.stopPropagation();
    event.preventDefault();
    return true;
});

//###############################################################################################
// Initialize time calendar on page
//###############################################################################################
$.initializeTimeCalendar = function () {
    // Month title
    var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
    var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
    $('#title').html(startDayOfWeek.date() + ' - ' + endDayOfWeek.date() + ' ' + moment.months(endDayOfWeek.month()));

    // Header of table
    var calendarHead = $('<thead></thead>');
    weekdayHeader = $('<tr></tr>');
    weekdayHeader.append('<td class="time header">Time</td>');
    for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
        var weekdayName = moment.weekdays(weekdayIndex).substring(0, 3);
        weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date() + weekdayIndex) + '</td>');
    }
    calendarHead.append(weekdayHeader); // Place weekday headers into table header

    // Body of table
    var calendarBody = $('<tbody></tbody>');

    var currentTime = moment(startDay).hour(0).minute(0);

    for (var timeIndex = 1; timeIndex <= UNITS_IN_DAY; timeIndex++) {
        var timeRow = $('<tr></tr>');
        calendarBody.append(timeRow); // Place timeRow into table
        timeRow.append('<td class="time">' + currentTime.format('HH:mm') + '</td>');
        currentTime.add('hours', 1);

        for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
            var timeBox = $('<td class="time enabled"></td>');
            timeRow.append(timeBox); // Add timebox to timeRow
            timeBox.attr('column', weekdayIndex); // Set timebox identifier
            timeBox.attr('row', timeIndex);
        }
    }

    var weekCalendar = $('<table id="calendartable" cellpadding="0" tablespacing="0"></table>');
    weekCalendar.append(calendarHead, calendarBody); // Put header and body into calendar
    $('#calendar').html(weekCalendar); // Place table into div
};

//###############################################################################################
// Attach mouse events for timeBoxes
//###############################################################################################
$('#calendar').on('mousedown', '.time.enabled', function (event) {
    // Set start and end index
    dragStartColumn = parseInt($(this).attr('column'));
    dragStartRow = parseInt($(this).attr('row'));
    dragEndColumn = parseInt($(this).attr('column'));
    dragEndRow = parseInt($(this).attr('row'));
    var startTimeIndex = (currentWeekIndex - startWeekIndex) * DAYS_IN_WEEK * UNITS_IN_DAY;

    if ($.inArray(startTimeIndex + dragStartColumn * UNITS_IN_DAY + dragStartRow, availableArray) != -1) {
        // Starts drag
        isCalendarMouseDown = true;

        // Sets whether user is adding or removing units
        if ($.inArray(startTimeIndex + dragStartColumn * UNITS_IN_DAY + dragStartRow, timeArray) == -1) {
            isAdding = true;
        } else {
            isAdding = false;
        }

        // Recolour cell
        if (isAdding) {
            $(this).css('background', cssDefaults.background_select); // If user is adding units
        } else {
            $(this).css('background', cssDefaults.background_deselect); // If user is removing units
        }
    }
    event.stopPropagation();
    event.preventDefault();
    return true;
}).on('mouseover', '.time.enabled', function (event) {
    // Temporary store new end index
    var dragNewEndColumn = parseInt($(this).attr('column'));
    var dragNewEndRow = parseInt($(this).attr('row'));
    var startTimeIndex = (currentWeekIndex - startWeekIndex) * DAYS_IN_WEEK * UNITS_IN_DAY;

    // If user is currently dragging
    if (isCalendarMouseDown && dragNewEndRow >= dragStartRow && dragNewEndColumn >= dragStartColumn) {
        for (var j = dragEndColumn; j <= dragNewEndColumn; j++) {
            for (var i = dragStartRow; i <= dragNewEndRow; i++) {
                if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) != -1) {
                    if (isAdding) {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_select); // If user is adding units
                    } else {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_deselect); // If user is removing units
                    }
                }
            }
        }
        for (var i = dragEndRow; i <= dragNewEndRow; i++) {
            for (var j = dragStartColumn; j <= dragNewEndColumn; j++) {
                if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) != -1) {
                    if (isAdding) {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_select); // If user is adding units
                    } else {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_deselect); // If user is removing units
                    }
                }
            }
        }

        for (var j = dragNewEndColumn + 1; j <= dragEndColumn; j++) {
            for (var i = dragStartRow; i <= dragEndRow; i++) {
                if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) != -1) {
                    // Remove colour if not originally selected
                    if ($.inArray((i * UNITS_IN_DAY + j), timeArray) == -1) {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_default);
                    } else {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_selected);
                    }
                }
            }
        }
        for (var i = dragNewEndRow + 1; i <= dragEndRow; i++) {
            for (var j = dragStartColumn; j <= dragEndColumn; j++) {
                if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) != -1) {
                    // Remove colour if not originally selected
                    if ($.inArray((j * UNITS_IN_DAY + i), timeArray) == -1) {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_default);
                    } else {
                        $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_selected);
                    }
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
}).on('mouseup', '.time.enabled', function (event) {
    // Stops drag and add/remove units
    if (isCalendarMouseDown) {
        var startTimeIndex = (currentWeekIndex - startWeekIndex) * DAYS_IN_WEEK * UNITS_IN_DAY;
        for (var j = dragStartColumn; j <= dragEndColumn; j++) {
            for (var i = dragStartRow; i <= dragEndRow; i++) {
                // If user is adding units
                if (isAdding) {
                    if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) != -1) {
                        if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, timeArray) == -1) {
                            timeArray.push(startTimeIndex + j * UNITS_IN_DAY + i);
                        }
                    }
                } else {
                    var index = timeArray.indexOf(startTimeIndex + j * UNITS_IN_DAY + i);
                    if (index > -1) {
                        timeArray.splice(index, 1);
                    }
                }
            }
        }
    }

    // Sorts time units numerically
    timeArray.sort(function (a, b) {
        return a - b;
    });
    isCalendarMouseDown = false;
    $.reset(); // Reset calendar table colours
    event.stopPropagation();
    event.preventDefault();
    return true;
});

//###############################################################################################
// Get start date index of month
//###############################################################################################
$.getStartDateIndex = function (monthIndex) {
    var dateIndex = 0;

    for (var i = startMonthIndex; i < monthIndex; i++) {
        dateIndex += moment(startDay).month(i).daysInMonth();
    }
    return dateIndex;
};

//###############################################################################################
//On previous button clicked, change month to previous month
//###############################################################################################
$('#previous').click(function () {
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
    } else if (currentMode == MODE_TIME) {
        currentWeekIndex--; // Change current month to previous month

        // Change title of calendar and header
        var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
        var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
        $('#title').html(startDayOfWeek.date() + ' - ' + endDayOfWeek.date() + ' ' + moment.months(endDayOfWeek.month()));
        weekdayHeader.html('<tr></tr>');
        weekdayHeader.append('<td class="time header">Time</td>');
        for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
            var weekdayName = moment.weekdays(weekdayIndex).substring(0, 3);
            weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date() + weekdayIndex) + '</td>');
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
$('#next').click(function () {
    if (currentMode == MODE_DATE) {
        currentMonthIndex++; // Change current month to next month
        $.initializeDateCalendar();

        // Enables previous button
        $('#previous').attr('disabled', false);

        // Disable this button if limit reached
        if (currentMonthIndex >= startMonthIndex + MAX_MONTHS) {
            $(this).attr('disabled', true);
        }
        $.reset();
    } else if (currentMode == MODE_TIME) {
        currentWeekIndex++; // Change current month to next month

        // Change title of calendar and header
        var startDayOfWeek = moment(startDay).week(currentWeekIndex).day(0);
        var endDayOfWeek = moment(startDay).week(currentWeekIndex).day(6);
        $('#title').html(startDayOfWeek.date() + ' - ' + endDayOfWeek.date() + ' ' + moment.months(endDayOfWeek.month()));
        weekdayHeader.html('<tr></tr>');
        weekdayHeader.append('<td class="time header">Time</td>');
        for (var weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
            var weekdayName = moment.weekdays(weekdayIndex).substring(0, 3);
            weekdayHeader.append('<td class="time header">' + weekdayName + '</br>' + (startDayOfWeek.date() + weekdayIndex) + '</td>');
        }

        // Enables previous button
        $('#previous').attr('disabled', false);

        // Disable this button if limit reached
        if (currentWeekIndex >= startWeekIndex + MAX_WEEKS) {
            $(this).attr('disabled', true);
        }
        $.reset();
    }
});

//###############################################################################################
// Checks for when user stops dragging during mouseup
//###############################################################################################
$(document).mouseup(function () {
    isCalendarMouseDown = false;
    $.reset(); // Reset calendar table colours
});

//###############################################################################################
// Resets selected dates
//###############################################################################################
$.reset = function () {
    if (currentMode == MODE_DATE) {
        var startDateIndex = $.getStartDateIndex(currentMonthIndex);
        for (var i = 1; i <= moment(startDay).month(currentMonthIndex).daysInMonth(); i++) {
            if ($.inArray(startDateIndex + i, dateArray) == -1) {
                $('td[date=' + (startDateIndex + i) + ']').css('background', cssDefaults.background_default);
            } else {
                $('td[date=' + (startDateIndex + i) + ']').css('background', cssDefaults.background_selected);
            }
        }
    } else if (currentMode == MODE_TIME) {
        var startTimeIndex = (currentWeekIndex - startWeekIndex) * DAYS_IN_WEEK * UNITS_IN_DAY;
        for (var i = 1; i <= UNITS_IN_DAY; i++) {
            for (var j = 0; j < DAYS_IN_WEEK; j++) {
                if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, availableArray) == -1) {
                    $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_disabled);
                } else if ($.inArray(startTimeIndex + j * UNITS_IN_DAY + i, timeArray) == -1) {
                    $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_default);
                } else {
                    $('td[column=' + j + '][row=' + i + ']').css('background', cssDefaults.background_selected);
                }
            }
        }
    }
};

//###############################################################################################
// Create schedule
// Shows overlay with success/failure message
//###############################################################################################
$('#create').click(function () {
    // Get response array based on mode
    var responseArray;
    if (currentMode == MODE_DATE) {
        responseArray = dateArray;
    } else if (currentMode == MODE_TIME) {
        responseArray = timeArray;
    }

    // Check that dates are selected, if not, warn user
    if (responseArray.length == 0) {
        $('#overlay').height($(document).height());
        $('#overlay').css('visibility', 'visible');
        $('#alert').html('</br></br> Please select range</br>of available dates');
        $('#alert').css('margin-top', $(document).scrollTop() + 200);
        $('#alert').css('visibility', 'visible');
    } else if (data.anonymous == '0' && $('#name').val() == '') {
        $('#overlay').height($(document).height());
        $('#overlay').css('visibility', 'visible');
        $('#alert').html('</br></br></br> Please enter your name');
        $('#alert').css('margin-top', $(document).scrollTop() + 200);
        $('#alert').css('visibility', 'visible');
    } else {
        // Calculate starting days of periods of availability
        var calculatedResponseArray = new Array();
        for (var i = 0; i < responseArray.length; i++) {
            var available = true;
            for (var j = 1; j < parseInt(data.length); j++) {
                if ($.inArray(responseArray[i] + j, responseArray) == -1) {
                    available = false;
                }
            }
            if (available) {
                calculatedResponseArray.push(responseArray[i]);
            }
        }

        // Send results to server
        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                schedule: schedule,
                name: $('#name').val(),
                anonymous: data.anonymous,
                daterange: JSON.stringify(calculatedResponseArray)
            },
            success: function (reply) {
                window.location.href = $(location).attr('href') + '/r';
            }
        });
    }
});

//###############################################################################################
// Redirects to results page
//###############################################################################################
$('#result').click(function () {
    window.location.href = $(location).attr('href') + '/r';
});

//###############################################################################################
// Removes overlay when clicked
//###############################################################################################
$('#overlay').mouseup(function () {
    $(this).css('visibility', 'hidden');
    $('#alert').css('visibility', 'hidden');
});
