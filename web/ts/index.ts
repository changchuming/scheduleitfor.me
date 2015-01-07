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
var popup = require('./web/js/components/popup');
var navbar = require('./web/js/components/navbar');

//  Code starts Here
var calMonthVm,
	calWeekVm;

//Initialization
$(function () {
	// Show calendar
    calMonthVm = new cal.CalendarMonthVm(moment().startOf('day'));
    touchEvents.InitializeSelection(ko, $);
    ko.applyBindings(calMonthVm, $('#calendarmonth')[0]);
    
    initSlider();
    initDetails();
});

$('#create').click(function(){
	if ($('#days').hasClass('active')) {
		var selectedDates = calMonthVm.exportSelectedDates($("#EventDurationSlider").slider("value"));
	} else {
		var selectedDates = calWeekVm.exportSelectedDates($("#EventDurationSlider").slider("value"));
	}
	
	if (selectedDates == null) {
		popup.showMessage('Error', 'Please select time slots<br/>Time slots must be as long as event length');
	} else {
		popup.showMessage('Working', 'Working...');
		var data = {
				title: $('#title').val(),
				details: $('#description').val(),
				anonymous: $('#anonymous').hasClass('active') ? 1 : 0,
				duplicate: $('#duplicate').hasClass('active') ? 0 : 1,
				length: $("#EventDurationSlider").slider("value"),
				startmoment: selectedDates.startMoment.format(),
				mode: $('#days').hasClass('active') ? 1 : 0,
				selectedrange: JSON.stringify(selectedDates.selectedRange)
				};
		server.createSchedule(data, showSuccess, popup.showMessage);
	}
});

$('#hours').click(function(){
	if (calWeekVm == undefined) {
		// Show calendar
	    calWeekVm = new cal.CalendarWeekVm(moment().startOf('day'));
	    ko.applyBindings(calWeekVm, $('#calendarweek')[0]);
	}
	$('#calendarweek').show();
	$('#calendarmonth').hide();
});

$('#days').click(function(){
	$('#calendarweek').hide();
	$('#calendarmonth').show();
});

function initSlider() {
    $("#EventDurationSlider").slider({
    	range: "max",
    	min: 1,
    	max: 14,
    	value: 1,
    	slide: function(event, ui) {
    	  $("#length").html(ui.value);
    	}
    });
    $("#length").html('1');
}

function initDetails() {
	$('.inputfield').bind('keydown', function(e) {
	    if (e.keyCode == 13) {
	        e.preventDefault();
	    }
	});
}

function showSuccess(schedule) {
	$('#popupheader').text('Success');
	$('#popupbody').text('Your schedule has been created at');
	$('#popupaddress').val($(location).attr('href') + schedule);
	$('#popupaddress').show();
	$('#popuphighlight').click(function(){
		$('#popupaddress').select();
	});
	$('#popuphighlight').show();
	$('#popupgoto').click(function(){
		window.location.href = $(location).attr('href') + schedule;
	});
	$('#popupgoto').show();
    (<any>$('#popup')).modal('show');
}