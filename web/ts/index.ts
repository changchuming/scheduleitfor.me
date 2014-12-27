/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
/// <reference path="../definitions/touchpunch.d.ts" />
/// <reference path="../definitions/knockout.d.ts" />
/// <reference path="../definitions/browserify.d.ts" />
/// <reference path="../definitions/moment.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
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

//  Code starts Here
var MODE_DAYS = 1;
var MODE_HOURS = 0;
var calVm;

//Initialization
$(function () {
    calVm = new cal.CalendarVm(moment().startOf('day'));
    
    initSlider();
    initDetails();
    initCalendar(calVm);
});

$('#submit').click(function(){
	var selectedDates = calVm.exportSelectedDates();
	if (selectedDates == null) {
		showError('Please select dates');
	} else {
		var data = {
				title: $('#title').val(),
				details: $('#details').val(),
				anonymous: $('#anonymous').hasClass('active') ? 1 : 0,
				duplicate: $('#duplicate').hasClass('active') ? 1 : 0,
				length: $("#EventDurationSlider").slider("value"),
				startmoment: selectedDates.startMoment.format(),
				mode: $('#days').hasClass('active') ? 1 : 0,
				selectedrange: JSON.stringify(selectedDates.daysAsInt)
				};
		server.createSchedule(data, showSuccess, showError);
	}
});

function initSlider() {
    $("#EventDurationSlider").slider({
    	range: "max",
    	min: 1,
    	max: 14,
    	value: 1,
    	slide: function(event, ui) {
    	  $("#length").val(ui.value);
    	}
    });
    $("#length").val('1');
}

function initDetails() {
	$('#title').bind('keydown', function(e) {
	    if (e.keyCode == 13) {
	        e.preventDefault();
	    }
	});
}

function initCalendar(viewModel) {
    touchEvents.InitializeSelection(ko, $);
    ko.applyBindings(viewModel);
}

function showError(string) {
	$('#popupheader').text('Error');
	$('#popupbody').text(string);
	$('#popupaddress').hide();
	$('#popuphighlight').hide();
	$('#popupgoto').hide();
    (<any>$('#popup')).modal('show');
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