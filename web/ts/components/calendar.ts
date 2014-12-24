/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />


import moment = require('moment');
import ko = require('knockout');

export class CalendarDay implements ICalendarDay {
    constructor(private calDate : Moment,
        	private monthStatus : string,
            public DateText : string = "",
            public IsSelected: KnockoutObservable<boolean> = ko.observable(false)) {
            //Initialization
            this.DateText = this._getDateText();
        }

    public Status: KnockoutComputed<string> = ko.computed((): string => {
        var status = "";
        status += this.monthStatus;
        status += this._getSelectedStatus();
        return status; 
    }, this);

    // Returns the text that will be displayed on the calendar
    // based on the current date
    private _getDateText(): string {
        return this.calDate.date().toString();
    }

    private _getSelectedStatus(): string {
        return this.IsSelected() ? "selectedfilter" : "";
    }
    
    public toggleSelectionStatus() {
    	if (this.monthStatus == "") {
    		this.IsSelected(!this.IsSelected());
    	}
    }
}

export class CalendarVm implements ICalendar {
    constructor(private _StartOfCalendar: Moment,
        private _months: ICalendarDay[][]= [],
        private _currentMonth : number = 0,
        public Days: KnockoutObservableArray<ICalendarDay> = ko.observableArray([])) {
        // Initialize Variables
        this._months.push(this.createCalendarDays(this._StartOfCalendar));
        this.Days = ko.observableArray(this._months[this._currentMonth]);
    }
    
    public SelectableOptions: JQueryUI.SelectableEvents = {
    		selected: function (event, ui) {
    			// Custom events
    		},
			selecting: function (event, ui) {
				// Custom events
			},
    		unselecting: function (event, ui) {
    			// Custom events
    		}
    }

    private _daysInWeek = 7;
    
    // Switches calendar to next month; Create if not exists
    public nextMonth() {
    	this._currentMonth++;
    	if (this._currentMonth >= this._months.length) {
    		console.log('pushed');
    		var StartOfNextMonth = moment(this._StartOfCalendar).add(this._currentMonth, 'months');
    		this._months.push(this.createCalendarDays(StartOfNextMonth));
    	}
    	this.Days(this._months[this._currentMonth]);
    	console.log(this.Days());
    }
    
    // Switches calendar to previous month;
    public prevMonth() {
    	if (this._currentMonth > 0) {
    		this._currentMonth--;
    	}
    	this.Days(this._months[this._currentMonth]);
    	console.log(this.Days());
    }

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
    private createCalendarDays(StartOfMonth: Moment): ICalendarDay[] {
        var startDay = moment(StartOfMonth).startOf('month'),
            endDay = moment(StartOfMonth).endOf('month'),
            currMonth = moment(StartOfMonth).month(),
            days: ICalendarDay[] = [];

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

        // Create CalendarDay objects for each date
        while (!moment(startDay).isAfter(endDay, "day")) {
        	console.log(startDay);
        	var monthStatus = (startDay.month()==StartOfMonth.month()) ? "" : "other_month";
            var calDay = new CalendarDay(moment(startDay), monthStatus);
            days.push(calDay);
            startDay.add(1, 'day');
        }

        return days;
    }
}