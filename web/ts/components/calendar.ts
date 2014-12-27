/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />


import moment = require('moment');
import ko = require('knockout');

export class CalendarDay implements ICalendarDay {
    constructor(public CalMoment : Moment,
        	public IsEnabled : KnockoutObservable<boolean> = ko.observable(true),
            public DateText : string = "",
            public IsSelected : KnockoutObservable<boolean> = ko.observable(false)) {
            //Initialization
            this.DateText = this._getDateText();
        }

    public Status: KnockoutComputed<string> = ko.computed((): string => {
        var status = "";
        status += this.IsEnabled();
        status += " ";
        status += this._getSelectedStatus();
        return status; 
    }, this);

    public getDate() : Moment {
    	return this.CalMoment;
    }
    
    // Returns the text that will be displayed on the calendar
    // based on the current date
    private _getDateText(): string {
        return this.CalMoment.date().toString();
    }

    private _getSelectedStatus(): string {
        return this.IsSelected() ? "selectedfilter" : "";
    }
    
    public toggleSelectedStatus() {
    	if (this.IsEnabled()) {
    		this.IsSelected(!this.IsSelected());
    	}
    }
    
    public setEnabledStatus(status : boolean) {
    	this.IsSelected(false);
    	this.IsEnabled(status);
    }
}

export class CalendarVm implements ICalendar {
    constructor(private _startOfCalendar: Moment,
    	private availableArray : number[],
        private _months: ICalendarDay[][]= [],
        private _currentMonth : number = 0,
        public Days: KnockoutObservableArray<ICalendarDay> = ko.observableArray([])) {
        // Initialize Variables
        this._months.push(this.createCalendarDays(this._startOfCalendar));
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
    		var startOfNextMonth = moment(this._startOfCalendar).add(this._currentMonth, 'months');
    		this._months.push(this.createCalendarDays(startOfNextMonth));
    	}
    	this.Days(this._months[this._currentMonth]);
    }
    
    // Switches calendar to previous month;
    public prevMonth() {
    	if (this._currentMonth > 0) {
    		this._currentMonth--;
    	}
    	this.Days(this._months[this._currentMonth]);
    }
    
    // Exports selected dates as start day and a number array
    public exportSelectedDates() {
    	var days = [].concat.apply([], this._months); // Flatten array
    	// Find the first selected day
    	var daysAsInt = [];
    	var startDay;
    	if (this.availableArray != undefined) {
    		startDay = this._startOfCalendar;
    	} else {
    		for (var count = 0; count<days.length; count++) {
        		if (days[count].IsSelected()) {
        			startDay = days[count];
        			break;
        		}
        	}
    	}
    	// Convert selected CalendarDay array to integer array
    	days.forEach(function (day) {
    		if (day.IsSelected()) {
    			daysAsInt.push(day.CalMoment.diff(startDay.CalMoment, 'days'));
    		}
    	});
    	if (startDay == undefined) {
    		return null;
    	} else {
    		return { startMoment : startDay.CalMoment, daysAsInt : daysAsInt };
    	}
    }

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
            var calDay = new CalendarDay(moment(startDay));
        	if (startDay.month()!=StartOfMonth.month()
        			|| (startDay.isBefore(this._startOfCalendar))) {
        		calDay.setEnabledStatus(false);
        	}
        	else if (this.availableArray != undefined) {
        		var dayAsInt : number = startDay.diff(this._startOfCalendar, 'days'); 
    			if (this.availableArray.indexOf(dayAsInt) == -1) {
    				calDay.setEnabledStatus(false);
    			}
        	}
            days.push(calDay);
            startDay.add(1, 'day');
        }

        return days;
    }
}