/// <reference path="ICalendarDay.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
var CalendarDay = (function () {
    function CalendarDay(Day, IsSelected) {
        if (IsSelected === void 0) { IsSelected = false; }
        this.Day = Day;
        this.IsSelected = IsSelected;
    }
    CalendarDay.prototype.monthStatus = function () {
        var status = "";
        if (moment().isAfter(this.Day, "month")) {
            status = "prev_month";
        }
        else if (moment().isBefore(this.Day, "month")) {
            status = "next_month";
        }
        return status;
    };
    CalendarDay.prototype.onSelect = function () {
        this.IsSelected = this.IsSelected ? true : false;
    };
    return CalendarDay;
})();
exports.CalendarDay = CalendarDay;
