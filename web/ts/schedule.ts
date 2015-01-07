/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
/// <reference path="../definitions/touchpunch.d.ts" />
/// <reference path="../definitions/knockout.d.ts" />
/// <reference path="../definitions/browserify.d.ts" />
/// <reference path="../definitions/moment.d.ts" />
/// <reference path="../definitions/scheduleit.d.ts" />

// Shim JQuery
import $ = require("jquery");
export interface MyWindow extends Window { $: any; jQuery: any; }
declare var window: MyWindow;
window.$ = window.jQuery = $;

//Load External Dependencies
import ko = require('knockout');
import moment = require('moment');
require('jquery-ui');
require('jquery-ui-touch-punch');
require('bootstrap');

// Load Internal Dependencies
var cal = require('./web/js/components/calendar');
var touchEvents = require('./web/js/components/touchevents');
var server = require('./web/js/components/serverfunctions');
var details = require('./web/js/components/details');
var popup = require('./web/js/components/popup');
var navbar = require('./web/js/components/navbar');

//  Code starts Here
var calVm;
declare var schedule;
declare var data;

//Mode definitions
var MODE_DAY = 1;
var MODE_HOUR = 0;

//Initialization
$(function () {
	// Show calendar
	var selectedrange = JSON.parse(data.selectedrange);
	if (data.mode == MODE_DAY) {
		calVm = new cal.CalendarMonthVm(moment(data.startmoment), selectedrange, data.length);
	    touchEvents.InitializeSelection(ko, $);
		ko.applyBindings(calVm, $('#calendarmonth')[0]);
		$('#calendarmonth').show();
	} else {
		calVm = new cal.CalendarWeekVm(moment(data.startmoment), selectedrange, data.length);
	    touchEvents.InitializeSelection(ko, $);
		ko.applyBindings(calVm, $('#calendarweek')[0]);
		$('#calendarweek').show();
	}
    
    initDetails();
});

function initDetails() {
    // Show details
    var detailsVm = new details.Details(data.title, data.details, data.length, data.mode);
    ko.applyBindings(detailsVm, $('#details')[0]);
    // Show name field
	if (data.anonymous == 1) {
		$('#usernamegroup').hide();
	}
	// Prevent go in name field
	$('.inputfield').bind('keydown', function(e) {
	    if (e.keyCode == 13) {
	        e.preventDefault();
	    }
	});
}

$('#submit').click(function(){
	var selectedDates = calVm.exportSelectedDates(data.length);
	if (selectedDates == null) {
		popup.showMessage('Error', 'Please select time slots<br/>Time slots must be as long as event length');
	}
	else if (data.anonymous == 0 && $('#username').val() == "") {
		popup.showMessage('Error', 'Please enter your name');
	}
	else {
		var data2 = {
				schedule: schedule,
				username: $('#username').val(),
				anonymous: data.anonymous,
				duplicate: data.duplicate,
				selectedrange: JSON.stringify(selectedDates.selectedRange)
				};
		server.submitResults(data2, popup.showMessage);
	}
});

$('#results').click(function(){
	window.location.href = $(location).attr('href')+'/r';
});