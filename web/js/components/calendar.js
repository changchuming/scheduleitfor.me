/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />
var moment = require('moment');
var ko = require('knockout');
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
            status += _this._getSelectedStatus();
            return status;
        }, this);
        //Initialization
        this.DateText = this._getDateText();
    }
    CalendarDay.prototype.getDate = function () {
        return this.CalMoment;
    };
    // Returns the text that will be displayed on the calendar
    // based on the current date
    CalendarDay.prototype._getDateText = function () {
        return this.CalMoment.date().toString();
    };
    CalendarDay.prototype._getSelectedStatus = function () {
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
})();
exports.CalendarDay = CalendarDay;
var CalendarVm = (function () {
    function CalendarVm(_startOfCalendar, availableArray, eventLength, _months, _currentMonth, Header, Days) {
        if (_months === void 0) { _months = []; }
        if (_currentMonth === void 0) { _currentMonth = 0; }
        if (Header === void 0) { Header = ko.observable('Header'); }
        if (Days === void 0) { Days = ko.observableArray([]); }
        this._startOfCalendar = _startOfCalendar;
        this.availableArray = availableArray;
        this.eventLength = eventLength;
        this._months = _months;
        this._currentMonth = _currentMonth;
        this.Header = Header;
        this.Days = Days;
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
        this._daysInWeek = 7;
        // Initialize Variables
        this._months.push(this.createCalendarDays(this._startOfCalendar));
        this.Days = ko.observableArray(this._months[this._currentMonth]);
        this.updateHeader();
    }
    CalendarVm.prototype.updateHeader = function () {
        this.Header(moment(this._startOfCalendar).add(this._currentMonth, 'months').format('MMMM YYYY'));
    };
    // Switches calendar to next month; Create if not exists
    CalendarVm.prototype.nextMonth = function () {
        this._currentMonth++;
        if (this._currentMonth >= this._months.length) {
            var startOfNextMonth = moment(this._startOfCalendar).add(this._currentMonth, 'months');
            this._months.push(this.createCalendarDays(startOfNextMonth));
        }
        this.Days(this._months[this._currentMonth]);
        this.updateHeader();
    };
    // Switches calendar to previous month;
    CalendarVm.prototype.prevMonth = function () {
        if (this._currentMonth > 0) {
            this._currentMonth--;
        }
        this.Days(this._months[this._currentMonth]);
        this.updateHeader();
    };
    // Exports selected dates as start day and a number array
    CalendarVm.prototype.exportSelectedDates = function (eventLength) {
        var days = [].concat.apply([], this._months); // Flatten array
        // Find the first selected day
        var rawDaysAsInt = [];
        var daysAsInt = [];
        var startMoment;
        if (this.availableArray != undefined) {
            startMoment = this._startOfCalendar;
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
            return { startMoment: startMoment, daysAsInt: daysAsInt };
        }
    };
    // Fills out a 5 x 7 (35) element array of days showing the
    // days in the month and a few from the prev month and next month
    CalendarVm.prototype.createCalendarDays = function (StartOfMonth) {
        var startDay = moment(StartOfMonth).startOf('month'), endDay = moment(StartOfMonth).endOf('month'), currMonth = moment(StartOfMonth).month(), days = [];
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
            endDay.add(this._daysInWeek - endDay.day(), 'days');
        }
        while (!moment(startDay).isAfter(endDay, "day")) {
            var calDay = new CalendarDay(moment(startDay));
            if (startDay.month() != StartOfMonth.month() || (startDay.isBefore(this._startOfCalendar))) {
                calDay.setEnabledStatus(false);
            }
            else if (this.availableArray != undefined) {
                var dayAsInt = startDay.diff(this._startOfCalendar, 'days');
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
    return CalendarVm;
})();
exports.CalendarVm = CalendarVm;
