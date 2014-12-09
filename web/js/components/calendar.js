/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
var moment = require('moment');
var ko = require('knockout');
;
var CalendarDay = (function () {
    function CalendarDay(CalDate, DayText, IsSelected) {
        var _this = this;
        if (DayText === void 0) { DayText = ""; }
        if (IsSelected === void 0) { IsSelected = false; }
        this.CalDate = CalDate;
        this.DayText = DayText;
        this.IsSelected = IsSelected;
        //Initialization
        this.DayText = this._getDayText();
        this.MonthStatus = ko.pureComputed(function () {
            return _this._monthStatus();
        });
    }
    CalendarDay.prototype.onSelect = function () {
        this.IsSelected = this.IsSelected ? true : false;
    };
    CalendarDay.prototype.OnTap = function (bindingContext) {
        console.log("hi");
    };
    CalendarDay.prototype._monthStatus = function () {
        var status = "";
        var today = moment();
        if (moment(today).isAfter(this.CalDate, "month")) {
            status = "prev_month";
        }
        else if (moment(today).isBefore(this.CalDate, "month")) {
            status = "next_month";
        }
        return status;
    };
    // Returns the text that will be displayed on the calendar
    // based on the current date
    CalendarDay.prototype._getDayText = function () {
        var startOfNextMonth = moment(new Date()).add(1, "month").startOf("month");
        var result = "";
        // If the date is either at the start of the month,
        // add the month's name before it
        if (moment(this.CalDate).isSame(startOfNextMonth)) {
            result += moment(this.CalDate).format("MMM") + " ";
        }
        result += this.CalDate.getDate();
        return result;
    };
    return CalendarDay;
})();
exports.CalendarDay = CalendarDay;
var CalendarVm = (function () {
    function CalendarVm(_aroundThisDate, _days, Days) {
        if (_aroundThisDate === void 0) { _aroundThisDate = new Date(); }
        if (_days === void 0) { _days = []; }
        if (Days === void 0) { Days = ko.observableArray([]); }
        this._aroundThisDate = _aroundThisDate;
        this._days = _days;
        this.Days = Days;
        this._daysInWeek = 7;
        // Initialize Variables
        this._days = this.createCalendarDays(this._aroundThisDate);
        this.Days = ko.observableArray(this._days);
    }
    CalendarVm.prototype.getSelectedDates = function () {
        var selectedDates = [];
        this._days.forEach(function (day) {
            if (day.IsSelected) {
                selectedDates.push(day.CalDate);
            }
        });
        return selectedDates;
    };
    // Fills out a 5 x 7 (35) element array of days showing the
    // days in the month and a few from the prev month and next month
    CalendarVm.prototype.createCalendarDays = function (AroundThisDate) {
        var startDay = moment(AroundThisDate).startOf('month'), endDay = moment(AroundThisDate).endOf('month'), currMonth = moment(AroundThisDate).month(), days = [];
        //Check if the start of the month coincides with a Monday.
        // If not, add days starting from the prev month.
        if (startDay.day() != 1) {
            startDay.add(-startDay.day() + 1);
        }
        // Do the same to check if the end of the month conincides with
        // the number of days in the week for the calendar. If not add next
        // month's days
        if (endDay.day() != this._daysInWeek) {
            endDay.add(this._daysInWeek - endDay.day(), 'day');
        }
        while (!moment(startDay).isAfter(endDay, "day")) {
            var calDay = new CalendarDay(moment(startDay).toDate());
            days.push(calDay);
            startDay.add(1, 'day');
        }
        return days;
    };
    return CalendarVm;
})();
exports.CalendarVm = CalendarVm;
