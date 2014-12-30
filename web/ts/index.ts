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

//  Code starts Here
var calVm;

//Initialization
$(function () {
	// Show calendar
    calVm = new cal.CalendarVm(moment().startOf('day'));
    touchEvents.InitializeSelection(ko, $);
    ko.applyBindings(calVm, $('#calendar')[0]);
    
    initSlider();
    initDetails();
});

$('#submit').click(function(){
	var selectedDates = calVm.exportSelectedDates($("#EventDurationSlider").slider("value"));
	if (selectedDates == null) {
		popup.showMessage('Error', 'Please select dates<br/>Dates must be as long as event length');
	} else {
		popup.showMessage('Working', 'Working...');
		var data = {
				title: $('#title').val(),
				details: $('#details').val(),
				anonymous: $('#anonymous').hasClass('active') ? 1 : 0,
				duplicate: $('#duplicate').hasClass('active') ? 0 : 1,
				length: $("#EventDurationSlider").slider("value"),
				startmoment: selectedDates.startMoment.format(),
				mode: $('#days').hasClass('active') ? 1 : 0,
				selectedrange: JSON.stringify(selectedDates.daysAsInt)
				};
		server.createSchedule(data, showSuccess, popup.showMessage);
	}
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
	$('#title').bind('keydown', function(e) {
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