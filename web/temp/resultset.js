/// <reference path="../definitions/browserify.d.ts" />
var $ = require('jquery'), moment = require('moment');
// Shim jQuery
window.$ = window.jQuery = $;
require('jquery-ui');
require('jquery-ui-touch-punch');
// Create Express JS Variables if they don't exist
var data = data || {}, resultset = resultset || {}, usercount = usercount || {}, reply = reply || {};
// Constants
var maxMonths = 6, startDay = moment(data.startday), MODE_TIME = 0, MODE_DATE = 1, currentMode = data.mode, currentEventLength = data.length;
// Listen for jQuery
$(function () {
    $('#previous').attr('disabled', true); // Disable previous button
    // Initialize Event Details
    initializeEventDetails();
    // Depending on the mode, initialize either the
    // DateResultSet() or the TimeResultSet()
    if (currentMode == MODE_DATE) {
        initializeDateResultSet();
    }
    else if (currentMode == MODE_TIME) {
        initializeTimeResultSet();
    }
    // Remove Overlay
    removeOverlay();
});
function initializeEventDetails() {
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
function initializeDateResultSet() {
    // Header
    $('#containercenter').append('<h2>Top 10 available dates</h2>');
    // Results
    var dateStoreArray = new Array();
    for (var i = 0; i < resultset.length; i += 2) {
        dateStoreArray.push(resultset[i]); // Add date number to date store array
        // If next date has different count, sort and display all dates in date store array
        if (resultset[i + 1] != resultset[i + 3]) {
            dateStoreArray.sort(function (a, b) {
                return a - b;
            }); // Sort dates in ascending order
            for (var j = 0; j < dateStoreArray.length; j++) {
                var percent = Math.round(resultset[i + 1] / parseInt(usercount) * 100); // Number of available users as a percent of all users
                $('#containercenter').append('<h3>' + (i / 2 - dateStoreArray.length + j + 2) + '. ' + moment(startDay).date(0).add('days', dateStoreArray[j]).format('dddd, MMMM Do') + '</h3>');
                var bartext = $('<div id="bartext">' + resultset[i + 1] + '/' + parseInt(usercount) + ' (' + percent + '%)' + '</div>'); // Text on bar
                bartext.css('width', percent + '%');
                var bar = $('<div id="bar"/>').progressbar({ value: percent }); // Bar
                bar.append(bartext);
                $('#containercenter').append(bar); // Add bar to container
            }
            dateStoreArray.length = 0; // Clear array
        }
    }
}
function initializeTimeResultSet() {
    // Header
    $('#containercenter').append('<h2>Top 10 available times</h2>');
    // Results
    var timeStoreArray = new Array();
    for (var i = 0; i < resultset.length; i += 2) {
        timeStoreArray.push(resultset[i]); // Add date number to date store array
        // If next date has different count, sort and display all dates in date store array
        if (resultset[i + 1] != resultset[i + 3]) {
            timeStoreArray.sort(function (a, b) {
                return a - b;
            }); // Sort dates in ascending order
            for (var j = 0; j < timeStoreArray.length; j++) {
                var percent = Math.round(resultset[i + 1] / parseInt(usercount) * 100); // Number of available users as a percent of all users
                $('#containercenter').append('<h3>' + (i / 2 - timeStoreArray.length + j + 2) + '. ' + moment(startDay).hour(0).minute(0).add('hours', timeStoreArray[j] - 1).format('ha, dddd, MMMM Do') + '</h3>');
                var bartext = $('<div id="bartext">' + resultset[i + 1] + '/' + parseInt(usercount) + ' (' + percent + '%)' + '</div>'); // Text on bar
                bartext.css('width', percent + '%');
                var bar = $('<div id="bar"/>').progressbar({ value: percent }); // Bar
                bar.append(bartext);
                $('#containercenter').append(bar); // Add bar to container
            }
            timeStoreArray.length = 0; // Clear array
        }
    }
}
// Create overlay
function createOverlay() {
    $('#overlay').height($(document).height());
    $('#overlay').css('visibility', 'visible');
    $('#alert').html('</br>Your schedule has been created at</br></br>' + '<a href="' + $(location).attr('href') + reply.reply + '">' + $(location).attr('href') + reply.reply + '</a>');
    $('#alert').css('margin-top', $(document).scrollTop() + 200);
    $('#alert').css('visibility', 'visible');
}
// Removes overlay when clicked
function removeOverlay() {
    $('#overlay').mouseup(function () {
        $(this).css('visibility', 'hidden');
        $('#alert').css('visibility', 'hidden');
    });
}
