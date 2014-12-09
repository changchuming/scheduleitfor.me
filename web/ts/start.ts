/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
/// <reference path="../definitions/touchpunch.d.ts" />
/// <reference path="../definitions/knockout.d.ts" />
/// <reference path="../definitions/bootstrap-slider.d.ts" />
/// <reference path="../definitions/browserify.d.ts" />
/// <reference path="../definitions/moment.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
/// <reference path="./components/calendar.ts" />

// Shim JQuery
import $ = require("jquery");
export interface MyWindow extends Window { $: any; jQuery: any; }
declare var window: MyWindow;
window.$ = window.jQuery = $;

//Load External Dependencies
import ko = require('knockout');
import moment = require('moment');

// Load Plugins without Type Definitions
jqueryui = require('jquery-ui');
touchpunch = require('jquery-ui-touch-punch');
var bootstrap = require('bootstrap');
var cal = require('./web/js/components/calendar');

//  Code starts Here
var calVm = new cal.CalendarVm(moment().toDate());

$(function() {
    init_slider();
    init_calendar();
});

function init_slider() {
    $("#EventDurationSlider").slider();
//    $('.capitalized-header').draggable();
}

function init_calendar() {
    ko.applyBindings(calVm);
}