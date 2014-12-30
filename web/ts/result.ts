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
var touchEvents = require('./web/js/components/touchevents');
var server = require('./web/js/components/serverfunctions');
var list = require('./web/js/components/list');
var details = require('./web/js/components/details');
var popup = require('./web/js/components/popup');

// Load variables
declare var io;
declare var schedule;
declare var data;

//  Code starts Here
var listVm;
var topten : number[] = [];
var usercount = 0;
var MODE_DAYS = 1;
var MODE_HOURS = 0;
var available:string = '';
var unavailable:string = '';
var dayAsInt:number = 0;

//Initialization
$(function () {
	// Show results list
	listVm = new list.ResultSet(moment(data.startmoment), data.length);
    ko.applyBindings(listVm, $('#resultlist')[0]);
    // Show details
    var detailsVm = new details.Details(data.title, data.details, data.length, data.mode);
    ko.applyBindings(detailsVm, $('#details')[0]);
	
	connect();
	join(schedule);
	listen('topten', displayTopTen);
    listen('availability', updateAvailability);
});

// Show availability
$(document).on('click','.availability',function(){
	popup.showMessage('No details available', 'No details available');
    
    // Get availability details
    var viewmodel : IResultEntry = ko.dataFor(this);
    dayAsInt = parseInt(viewmodel.DayAsInt);
    var data = {schedule: schedule, day: dayAsInt};
    server.getAvailability(data, showAvailability, popup.showMessage);
    });

// Show availability callback
function showAvailability(data) {
	var userList = JSON.parse(data.userlist);
	var availableArray = $.map(JSON.parse(data.availablearray), Number);
	available = '';
	unavailable = '';
	for (var count=0;count<userList.length;count++) {
		if (availableArray.indexOf(count) != -1) {
			available += userList[count] + '<br/>';
		} else {
			unavailable += userList[count] + '<br/>';
		}
	}
	var availableText = '<b>Available</b><br/>' + available + '<br/><b>Unavailable</b><br/>' + unavailable;
	popup.showMessage('Details', availableText);
}

function updateAvailability(data) {
	var selectedRange = $.map(JSON.parse(data.selectedrange), Number);
	if (selectedRange.indexOf(dayAsInt) == -1) {
		unavailable += data.username + '<br/>';
	} else {
		available += data.username + '<br/>';
	}
	var availableText = '<b>Available</b><br/>' + available + '<br/><b>Unavailable</b><br/>' + unavailable;
	popup.showMessage('Details', availableText);
}

function displayTopTen(data) {
	var topTen = JSON.parse(data.topten);
	if (data.topten.length != 0) {
		listVm.updateSet(topTen, data.usercount);
	} else {
		$('#resultlist').html('No results found!');
	}
}

function connect() {
	io = io.connect();
}

// Join room
function join(room) {
	io.emit('join', room);
}

// Leave room
function leave(room) {
	io.emit('leave', room);
} 

// Listen for event and provides callback
function listen(event, callback) {
	io.on(event, function(data) {
	    callback(data);
	})
}

// Stop listening for event
function stop(event, callback) {
	io.removeListener(event, callback);
}