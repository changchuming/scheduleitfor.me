/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/knockout.d.ts" />
/// <reference path="../definitions/bootstrap-slider.d.ts" />
/// <reference path="../definitions/browserify.d.ts" />
/// <reference path="../definitions/moment.d.ts" />
/// <reference path="../definitions/jqueryui.d.ts" />
/// <reference path="./components/calendar.ts" />
/// <reference path="./components/touch_events.ts" />
// Shim JQuery
var $ = require("jquery");
window.$ = window.jQuery = $;
//Load External Dependencies
var ko = require('knockout');
var moment = require('moment');
// Load Plugins without Type Definitions
var slider = require("seiyria-bootstrap-slider");
var bootstrap = require('bootstrap');
var cal = require('./web/js/components/calendar');
var touchevents = require('./web/js/components/touch_events');
//  Code starts Here
var calVm = new cal.CalendarVm(moment().toDate());
$(function () {
    init_slider();
    init_calendar();
});
function init_slider() {
    $("#EventDurationSlider").slider();
}
function init_calendar() {
    touchevents.InitHammerForKnockout(ko);
    ko.applyBindings(calVm);
}
