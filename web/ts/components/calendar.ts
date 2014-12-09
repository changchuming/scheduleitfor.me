﻿/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />


import moment = require('moment');
import ko = require('knockout');

export interface ICalendarDay {    
    MonthStatus: KnockoutComputed<string>;
    IsSelected: boolean;
    CalDate: Date;
    DayText: string;
}

export interface ICalendar {
    Days: KnockoutObservableArray<ICalendarDay>;
};

export class CalendarDay implements ICalendarDay {
    public MonthStatus : KnockoutComputed<string>;

    public onSelect() {
        this.IsSelected = this.IsSelected ? true : false;
    }

    public OnTap(bindingContext : KnockoutBindingContext) {
        console.log("hi");
    }

    constructor(public CalDate: Date,
        public DayText : string = "",
        public IsSelected: boolean = false) {
        //Initialization
        this.DayText = this._getDayText();
        this.MonthStatus = ko.pureComputed(() => {
            return this._monthStatus();
        });
    }

    private _monthStatus(): string {
        var status: string = "";
        var today = moment();

        if (moment(today).isAfter(this.CalDate, "month")) {
            status = "prev_month";
        }
        else if (moment(today).isBefore(this.CalDate, "month")) {
            status = "next_month";
        }

        return status;
    }

    // Returns the text that will be displayed on the calendar
    // based on the current date
    private _getDayText(): string {
        var startOfNextMonth = moment(new Date())
            .add(1, "month")
            .startOf("month");        
        var result = "";

        // If the date is either at the start of the month,
        // add the month's name before it
        if (moment(this.CalDate).isSame(startOfNextMonth)) {
            result += moment(this.CalDate).format("MMM") + " ";
        }

        result += this.CalDate.getDate();
        return result;
    }
}

export class CalendarVm implements ICalendar {
    private _daysInWeek = 7;

    private getSelectedDates(): Date[] {
        var selectedDates: Date[] = [];
        this._days.forEach((day) => {
            if (day.IsSelected) { selectedDates.push(day.CalDate); }
        });

        return selectedDates;
    }

    constructor(private _aroundThisDate: Date = new Date(),
        private _days: ICalendarDay[]= [],
        public Days: KnockoutObservableArray<ICalendarDay> = ko.observableArray([])) {
        // Initialize Variables
        this._days = this.createCalendarDays(this._aroundThisDate);
        this.Days = ko.observableArray(this._days);
    }

    // Fills out a 5 x 7 (35) element array of days showing the
    // days in the month and a few from the prev month and next month
    private createCalendarDays(AroundThisDate: Date): ICalendarDay[] {
        var startDay = moment(AroundThisDate).startOf('month'),
            endDay = moment(AroundThisDate).endOf('month'),
            currMonth = moment(AroundThisDate).month(),
            days: ICalendarDay[] = [];

        //Check if the start of the month coincides with a Monday.
        // If not, add days starting from the prev month.
        if (startDay.day() != 1) {
            startDay.add(-startDay.day() + 1)
        }

        // Do the same to check if the end of the month conincides with
        // the number of days in the week for the calendar. If not add next
        // month's days
        if (endDay.day() != this._daysInWeek) {
            endDay.add(this._daysInWeek - endDay.day(),'day');
        }

        // Create CalendarDay objects for each date
        while (!moment(startDay).isAfter(endDay, "day")) {         
            var calDay = new CalendarDay(moment(startDay).toDate());
            days.push(calDay);
            startDay.add(1, 'day');
        }

        return days;
    }
}