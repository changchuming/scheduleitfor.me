/// <reference path="../definitions/knockout.d.ts" />
/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/browserify.d.ts" />

//Load Dependencies
var $ = require('jquery'),
    moment = require('moment'),
    knockout = require('knockout'),
    slider = require("seiyria-bootstrap-slider");
// Shim jQuery and Load Plugins
interface Window {$: any; jQuery: any};
window.$ = window.jQuery = $;
require('bootstrap');

//  Code starts Here
$(function() {
    init_slider();
});

interface CalendarDate {
    currentDate: Date;
    constructor(d: number, m: number, y: number);
};


function init_slider(){
    $("#EventDurationSlider").slider();
}