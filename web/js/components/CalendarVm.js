/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
var moment = require('moment');
var ko = require('knockout');
var CalendarVm = (function () {
    function CalendarVm(_aroundThisDate, _days, Days) {
        if (_aroundThisDate === void 0) { _aroundThisDate = moment().toDate(); }
        if (_days === void 0) { _days = []; }
        if (Days === void 0) { Days = ko.observableArray([]); }
        this._aroundThisDate = _aroundThisDate;
        this._days = _days;
        this.Days = Days;
        this._daysInWeek = 7;
        this._days = this.createCalendarDays(this._aroundThisDate);
        this.Days = ko.observableArray(this._days);
    }
    CalendarVm.prototype.getSelectedDates = function () {
        var selectedDates = [];
        this._days.forEach(function (day) {
            if (day.IsSelected) {
                selectedDates.push(day.Day);
            }
        });
        return selectedDates;
    };
    // Fills out a 5 x 7 (35) element array of days showing the
    // days in the month and a few from the prev month and next month
    CalendarVm.prototype.createCalendarDays = function (AroundThisDate) {
        var startDay = moment(AroundThisDate).startOf('month'), endDay = moment(AroundThisDate).endOf('month'), days = [];
        //Check if the start of the month coincides with a Monday.
        // If not, add days starting from the prev month.
        if (startDay.day() != 1) {
            startDay.add(-startDay.day() + 1);
        }
        // Do the same to check if the end of the month conincides with
        // the number of days in the week for the calendar. If not add next
        // month's days
        if (endDay.day() != this._daysInWeek) {
            endDay.add(this._daysInWeek - endDay.day());
        }
        while (!moment(startDay).isSame(endDay, "day")) {
            days.push(new CalendarDay(startDay.toDate()));
            startDay.add(1, 'day');
        }
        return days;
    };
    return CalendarVm;
})();
exports.CalendarVm = CalendarVm;
