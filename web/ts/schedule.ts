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
declare var schedule;
declare var data;

//Initialization
$(function () {
	var selectedrange = JSON.parse(data.selectedrange);
    calVm = new cal.CalendarVm(moment(data.startmoment), selectedrange);
	
	init_details();
    init_calendar(calVm);
});

function init_details() {
	if (data.title != "") {
		$('#title').val(data.title);
	} else {
		$('#titlegroup').hide();
	}
	if (data.details != "") {
		$('#details').val(data.details);
		$("#details").height( $("#details")[0].scrollHeight-10);
	} else {
		$('#detailsgroup').hide();
	}
	var mode = (data.mode==MODE_DAYS) ? ' day(s)' : ' hour(s)'
	$('#length').val(data.length+mode);
	if (data.anonymous == 1) {
		$('#usernamegroup').hide();
	}
} 

$('#submit').click(function(){
	var selectedDates = calVm.exportSelectedDates();
	if (selectedDates.daysAsInt.length == 0) {
		showError('Please select dates');
	}
	else if (data.anonymous == 0 && $('#username').val() == "") {
		showError('Please enter your name');
	}
	else {
		var data2 = {
				schedule: schedule,
				username: $('#username').val(),
				anonymous: data.anonymous,
				duplicate: data.duplicate,
				selectedrange: JSON.stringify(selectedDates.daysAsInt)
				};
		server.submitResults(data2, showError);
	}
});

$('#results').click(function(){
	window.location.href = $(location).attr('href')+'/r';
});

function init_calendar(viewModel) {
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