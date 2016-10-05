/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../../definitions/scheduleit.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var moment = require('moment');
var ko = require('knockout');
var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;
// #############################################################################
// Each day of a CalendarMonth view model
// #############################################################################
var CalendarDay = (function () {
    function CalendarDay(CalMoment, IsEnabled, DateText, IsSelected) {
        var _this = this;
        if (IsEnabled === void 0) { IsEnabled = ko.observable(true); }
        if (DateText === void 0) { DateText = ""; }
        if (IsSelected === void 0) { IsSelected = ko.observable(false); }
        this.CalMoment = CalMoment;
        this.IsEnabled = IsEnabled;
        this.DateText = DateText;
        this.IsSelected = IsSelected;
        this.Status = ko.computed(function () {
            var status = "";
            status += _this.IsEnabled();
            status += " ";
            status += _this.getSelectedStatus();
            return status;
        }, this);
        //Initialization
        this.DateText = this.getDateText();
    }
    // Returns the text that will be displayed on the calendar
    // based on the current date
    CalendarDay.prototype.getDateText = function () {
        return this.CalMoment.date().toString();
    };
    CalendarDay.prototype.getSelectedStatus = function () {
        return this.IsSelected() ? "selectedfilter" : "";
    };
    CalendarDay.prototype.toggleSelectedStatus = function () {
        if (this.IsEnabled()) {
            this.IsSelected(!this.IsSelected());
        }
    };
    CalendarDay.prototype.setEnabledStatus = function (status) {
        this.IsSelected(false);
        this.IsEnabled(status);
    };
    return CalendarDay;
}());
exports.CalendarDay = CalendarDay;
// #############################################################################
// CalendarMonth view model
// #############################################################################
var CalendarMonthVm = (function () {
    function CalendarMonthVm(startOfCalendar, availableArray, eventLength, collections, currentIndex, Header, Collection) {
        if (collections === void 0) { collections = []; }
        if (currentIndex === void 0) { currentIndex = 0; }
        if (Header === void 0) { Header = ko.observable('Header'); }
        if (Collection === void 0) { Collection = ko.observableArray([]); }
        this.startOfCalendar = startOfCalendar;
        this.availableArray = availableArray;
        this.eventLength = eventLength;
        this.collections = collections;
        this.currentIndex = currentIndex;
        this.Header = Header;
        this.Collection = Collection;
        this.Day = ko.observableArray([]);
        this.SelectableOptions = {
            selected: function (event, ui) {
                // Custom events
            },
            selecting: function (event, ui) {
                // Custom events
            },
            unselecting: function (event, ui) {
                // Custom events
            }
        };
        // Initialize Variables
        this.collections.push(this.createCollection(moment(this.startOfCalendar)));
        this.Collection = ko.observableArray(this.collections[this.currentIndex]);
        this.updateHeader();
    }
    CalendarMonthVm.prototype.updateHeader = function () {
        this.Header(moment(this.startOfCalendar).add(this.currentIndex, 'months').format('MMMM YYYY'));
    };
    // Switches calendar to next month; Create if not exists
    CalendarMonthVm.prototype.next = function () {
        this.currentIndex++;
        if (this.currentIndex >= this.collections.length) {
            var startOfNextMonth = moment(this.startOfCalendar).add(this.currentIndex, 'months');
            this.collections.push(this.createCollection(startOfNextMonth));
        }
        this.Collection(this.collections[this.currentIndex]);
        this.updateHeader();
    };
    // Switches calendar to previous month;
    CalendarMonthVm.prototype.prev = function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        this.Collection(this.collections[this.currentIndex]);
        this.updateHeader();
    };
    // Exports selected dates as start day and a number array
    CalendarMonthVm.prototype.exportSelectedDates = function (eventLength) {
        var days = [].concat.apply([], this.collections); // Flatten array
        // Find the first selected day
        var rawDaysAsInt = [];
        var daysAsInt = [];
        var startMoment;
        if (this.availableArray != undefined) {
            startMoment = this.startOfCalendar;
        }
        else {
            for (var count = 0; count < days.length; count++) {
                if (days[count].IsSelected()) {
                    startMoment = days[count].CalMoment;
                    break;
                }
            }
        }
        // Convert selected CalendarDay array to integer array
        // Get only adjacent days that are as long as event length
        days.forEach(function (day) {
            if (day.IsSelected()) {
                rawDaysAsInt.push(day.CalMoment.diff(startMoment, 'days'));
            }
        });
        rawDaysAsInt.forEach(function (day) {
            daysAsInt.push(day);
            for (var count = 1; count < eventLength; count++) {
                if (rawDaysAsInt.indexOf(day + count) == -1) {
                    daysAsInt.pop();
                    break;
                }
            }
        });
        // Return days
        if (daysAsInt.length == 0) {
            return null;
        }
        else {
            return { startMoment: startMoment, selectedRange: daysAsInt };
        }
    };
    // Fills out an array of days in a month
    CalendarMonthVm.prototype.createCollection = function (StartOfMonth) {
        var startDay = moment(StartOfMonth).startOf('month'), endDay = moment(StartOfMonth).endOf('month'), days = [];
        //Check if the start of the month coincides with a Monday.
        // If not, add days starting from the prev month.
        if (startDay.day() == 0) {
            startDay.subtract(6, 'days');
        }
        else {
            startDay.subtract(startDay.day() - 1, 'days');
        }
        // Do the same to check if the end of the month coincides with
        // the number of days in the week for the calendar. If not add next
        // month's days
        if (endDay.day() != 0) {
            endDay.add(DAYS_IN_WEEK - endDay.day(), 'days');
        }
        // Create CalendarDay objects for each date
        while (!moment(startDay).isAfter(endDay, "day")) {
            var calDay = new CalendarDay(moment(startDay));
            if (startDay.month() != StartOfMonth.month()
                || (startDay.isBefore(this.startOfCalendar))) {
                calDay.setEnabledStatus(false);
            }
            else if (this.availableArray != undefined) {
                var dayAsInt = startDay.diff(this.startOfCalendar, 'days');
                calDay.setEnabledStatus(false);
                for (var count = 0; count < this.eventLength; count++) {
                    if (this.availableArray.indexOf(dayAsInt - count) != -1) {
                        calDay.setEnabledStatus(true);
                    }
                }
            }
            days.push(calDay);
            startDay.add(1, 'day');
        }
        return days;
    };
    return CalendarMonthVm;
}());
exports.CalendarMonthVm = CalendarMonthVm;
// #############################################################################
// Dummy unit displaying hour in CalendarWeek view model
// #############################################################################
var DummyHour = (function () {
    function DummyHour(DateText, Status, CalMoment, IsSelected) {
        if (Status === void 0) { Status = ko.computed(function () { return 'hour header false'; }); }
        if (CalMoment === void 0) { CalMoment = null; }
        if (IsSelected === void 0) { IsSelected = ko.observable(false); }
        this.DateText = DateText;
        this.Status = Status;
        this.CalMoment = CalMoment;
        this.IsSelected = IsSelected;
        // Initialization
    }
    DummyHour.prototype.toggleSelectedStatus = function () { }; // Empty function
    return DummyHour;
}());
exports.DummyHour = DummyHour;
// #############################################################################
// Each hour of a CalendarWeek view model
// #############################################################################
var CalendarHour = (function (_super) {
    __extends(CalendarHour, _super);
    function CalendarHour() {
        var _this = this;
        _super.apply(this, arguments);
        this.Status = ko.computed(function () {
            var status = "hour ";
            status += _this.IsEnabled();
            status += " ";
            status += _this.getSelectedStatus();
            return status;
        }, this);
    }
    // Returns the text that will be displayed on the calendar
    // based on the current hour
    CalendarHour.prototype.getDateText = function () {
        return '';
    };
    return CalendarHour;
}(CalendarDay));
exports.CalendarHour = CalendarHour;
// #############################################################################
// CalendarWeek view model
// #############################################################################
var CalendarWeekVm = (function (_super) {
    __extends(CalendarWeekVm, _super);
    function CalendarWeekVm() {
        _super.apply(this, arguments);
    }
    CalendarWeekVm.prototype.updateHeader = function () {
        this.Day.removeAll();
        var startDay = moment(this.startOfCalendar).add(this.currentIndex, 'weeks').startOf('week').add(1, 'days');
        var headerText = startDay.format('Do');
        for (var day = 0; day < DAYS_IN_WEEK; day++) {
            this.Day.push(startDay.format('Do'));
            startDay.add(1, 'days');
        }
        headerText += ' to ';
        headerText += startDay.subtract(1, 'days').format('Do, MMMM YYYY');
        this.Header(headerText);
    };
    // Switches calendar to next week; Create if not exists
    CalendarWeekVm.prototype.next = function () {
        this.currentIndex++;
        if (this.currentIndex >= this.collections.length) {
            var startOfNextWeek = moment(this.startOfCalendar).add(this.currentIndex, 'weeks');
            this.collections.push(this.createCollection(startOfNextWeek));
        }
        this.Collection(this.collections[this.currentIndex]);
        this.updateHeader();
    };
    // Exports selected dates as start day and a number array
    CalendarWeekVm.prototype.exportSelectedDates = function (eventLength) {
        var hours = [].concat.apply([], this.collections); // Flatten array
        // Find the first selected day
        var rawHoursAsInt = [];
        var hoursAsInt = [];
        var startMoment;
        if (this.availableArray != undefined) {
            startMoment = this.startOfCalendar;
        }
        else {
            for (var count = 0; count < hours.length; count++) {
                if (hours[count].IsSelected()) {
                    if (startMoment == undefined) {
                        startMoment = hours[count].CalMoment;
                    }
                    else if (hours[count].CalMoment.isBefore(startMoment)) {
                        startMoment = hours[count].CalMoment;
                    }
                }
            }
        }
        // Convert selected CalendarHour array to integer array
        // Get only adjacent hours that are as long as event length
        hours.forEach(function (hour) {
            if (hour.IsSelected()) {
                rawHoursAsInt.push(hour.CalMoment.diff(startMoment, 'hours'));
            }
        });
        rawHoursAsInt.forEach(function (hour) {
            hoursAsInt.push(hour);
            for (var count = 1; count < eventLength; count++) {
                if (rawHoursAsInt.indexOf(hour + count) == -1) {
                    hoursAsInt.pop();
                    break;
                }
            }
        });
        // Return days
        if (hoursAsInt.length == 0) {
            return null;
        }
        else {
            return { startMoment: startMoment, selectedRange: hoursAsInt };
        }
    };
    // Fills out an array of hours in a week
    CalendarWeekVm.prototype.createCollection = function (StartOfWeek) {
        var startDay = moment(StartOfWeek.subtract(1, 'days')).startOf('week').add(1, 'days'), hours = [];
        // Create CalendarHour objects for each hour
        for (var hour = 0; hour < HOURS_IN_DAY; hour++) {
            var hourHeader = new DummyHour(moment(startDay).add(hour, 'hour').format('ha'));
            hours.push(hourHeader);
            for (var day = 0; day < DAYS_IN_WEEK; day++) {
                var calMoment = moment(startDay).add(hour, 'hour').add(day, 'days');
                var calHour = new CalendarHour(calMoment);
                if (calMoment.isBefore(this.startOfCalendar)) {
                    calHour.setEnabledStatus(false);
                }
                else if (this.availableArray != undefined) {
                    var hourAsInt = calMoment.diff(this.startOfCalendar, 'hours');
                    calHour.setEnabledStatus(false);
                    for (var count = 0; count < this.eventLength; count++) {
                        if (this.availableArray.indexOf(hourAsInt - count) != -1) {
                            calHour.setEnabledStatus(true);
                        }
                    }
                }
                hours.push(calHour);
            }
        }
        return hours;
    };
    return CalendarWeekVm;
}(CalendarMonthVm));
exports.CalendarWeekVm = CalendarWeekVm;
