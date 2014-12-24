/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />
var moment = require('moment');
var ko = require('knockout');
var CalendarDay = (function () {
    function CalendarDay(calDate, monthStatus, DateText, IsSelected) {
        var _this = this;
        if (DateText === void 0) { DateText = ""; }
        if (IsSelected === void 0) { IsSelected = ko.observable(false); }
        this.calDate = calDate;
        this.monthStatus = monthStatus;
        this.DateText = DateText;
        this.IsSelected = IsSelected;
        this.Status = ko.computed(function () {
            var status = "";
            status += _this.monthStatus;
            status += _this._getSelectedStatus();
            return status;
        }, this);
        //Initialization
        this.DateText = this._getDateText();
    }
    // Returns the text that will be displayed on the calendar
    // based on the current date
    CalendarDay.prototype._getDateText = function () {
        return this.calDate.date().toString();
    };
    CalendarDay.prototype._getSelectedStatus = function () {
        return this.IsSelected() ? "selectedfilter" : "";
    };
    CalendarDay.prototype.toggleSelectionStatus = function () {
        if (this.monthStatus == "") {
            this.IsSelected(!this.IsSelected());
        }
    };
    return CalendarDay;
})();
exports.CalendarDay = CalendarDay;
var CalendarVm = (function () {
    function CalendarVm(_StartOfCalendar, _months, _currentMonth, Days) {
        if (_months === void 0) { _months = []; }
        if (_currentMonth === void 0) { _currentMonth = 0; }
        if (Days === void 0) { Days = ko.observableArray([]); }
        this._StartOfCalendar = _StartOfCalendar;
        this._months = _months;
        this._currentMonth = _currentMonth;
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
        this._months.push(this.createCalendarDays(this._StartOfCalendar));
        this.Days = ko.observableArray(this._months[this._currentMonth]);
    }
    // Switches calendar to next month; Create if not exists
    CalendarVm.prototype.nextMonth = function () {
        this._currentMonth++;
        if (this._currentMonth >= this._months.length) {
            console.log('pushed');
            var StartOfNextMonth = moment(this._StartOfCalendar).add(this._currentMonth, 'months');
            this._months.push(this.createCalendarDays(StartOfNextMonth));
        }
        this.Days(this._months[this._currentMonth]);
        console.log(this.Days());
    };
    // Switches calendar to previous month;
    CalendarVm.prototype.prevMonth = function () {
        if (this._currentMonth > 0) {
            this._currentMonth--;
        }
        this.Days(this._months[this._currentMonth]);
        console.log(this.Days());
    };
    //    // Gets the Dates that are Selected Within this Calendar
    //    private getSelectedDates(): Date[] {
    //        var selectedDates: Date[] = [];
    //        this._months[0].forEach((day) => { //edit
    //            if (day.IsSelected) { selectedDates.push(day.calDate); }
    //        });
    //
    //        return selectedDates;
    //    }
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
            console.log(startDay);
            var monthStatus = (startDay.month() == StartOfMonth.month()) ? "" : "other_month";
            var calDay = new CalendarDay(moment(startDay), monthStatus);
            days.push(calDay);
            startDay.add(1, 'day');
        }
        return days;
    };
    return CalendarVm;
})();
exports.CalendarVm = CalendarVm;
