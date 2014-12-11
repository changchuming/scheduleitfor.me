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
var $ = require("jquery");
window.$ = window.jQuery = $;
//Load External Dependencies
var ko = require('knockout');
var moment = require('moment');
// Load Plugins without Type Definitions
var jqueryui = require('jquery-ui');
var touchpunch = require('jquery-ui-touch-punch');
var bootstrap = require('bootstrap');
var cal = require('./web/js/components/calendar');
//  Code starts Here
var calVm = new cal.CalendarVm(moment().toDate());
$(function () {
    init_slider();
    init_calendar();
});
function init_slider() {
    $("#EventDurationSlider").slider();
    $(".calendar").selectable();
}
function init_calendar() {
    ko.applyBindings(calVm);
}
