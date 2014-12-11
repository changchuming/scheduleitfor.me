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

//  Code starts Here

//Initialization
$(function () {
    var calVm = new cal.CalendarVm(moment().toDate());

    init_slider();
    init_calendar(calVm);
});

function init_slider() {
    $("#EventDurationSlider").slider();
}

function init_calendar(viewModel) {
    touchEvents.InitializeSelection(ko, $);
    ko.applyBindings(viewModel);
}