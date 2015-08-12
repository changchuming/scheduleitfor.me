/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../../definitions/scheduleit.d.ts" />


import moment = require('moment');
import ko = require('knockout');

var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;

// #############################################################################
// Each day of a CalendarMonth view model
// #############################################################################
export class CalendarDay implements ICalendarUnit {
    constructor(public CalMoment : Moment,
        	public IsEnabled : KnockoutObservable<boolean> = ko.observable(true),
            public DateText : string = "",
            public IsSelected : KnockoutObservable<boolean> = ko.observable(false)) {
            //Initialization
            this.DateText = this.getDateText();
        }

    public Status: KnockoutComputed<string> = ko.computed((): string => {
        var status = "";
        status += this.IsEnabled();
        status += " ";
        status += this.getSelectedStatus();
        return status; 
    }, this);
    
    // Returns the text that will be displayed on the calendar
    // based on the current date
    protected getDateText(): string {
        return this.CalMoment.date().toString();
    }

    protected getSelectedStatus(): string {
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

// #############################################################################
// CalendarMonth view model
// #############################################################################
export class CalendarMonthVm implements ICalendar {
    constructor(protected startOfCalendar: Moment,
    	protected availableArray : number[],
    	protected eventLength : number,
        protected collections: ICalendarUnit[][]= [],
        protected currentIndex : number = 0,
        public Header : KnockoutObservable<string> = ko.observable('Header'),
        public Collection: KnockoutObservableArray<ICalendarUnit> = ko.observableArray([])) {
        // Initialize Variables
        this.collections.push(this.createCollection(moment(this.startOfCalendar)));
        this.Collection = ko.observableArray(this.collections[this.currentIndex]);
        this.updateHeader();
    } 
    
	public Day : KnockoutObservableArray<string> = ko.observableArray([]);
    
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
    
    public updateHeader() {
        this.Header(moment(this.startOfCalendar).add(this.currentIndex, 'months').format('MMMM YYYY'));
    }
    
    // Switches calendar to next month; Create if not exists
    public next() {
    	this.currentIndex++;
    	if (this.currentIndex >= this.collections.length) {
    		var startOfNextMonth = moment(this.startOfCalendar).add(this.currentIndex, 'months');
    		this.collections.push(this.createCollection(startOfNextMonth));
    	}
    	this.Collection(this.collections[this.currentIndex]);
        this.updateHeader();
    }
    
    // Switches calendar to previous month;
    public prev() {
    	if (this.currentIndex > 0) {
    		this.currentIndex--;
    	}
    	this.Collection(this.collections[this.currentIndex]);
    	this.updateHeader();
    }
    
    // Exports selected dates as start day and a number array
    public exportSelectedDates(eventLength:number) {
    	var days = [].concat.apply([], this.collections); // Flatten array
    	// Find the first selected day
    	var rawDaysAsInt = [];
    	var daysAsInt = [];
    	var startMoment;
    	if (this.availableArray != undefined) {
    		startMoment = this.startOfCalendar;
    	} else {
    		for (var count = 0; count<days.length; count++) {
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
    		for (var count = 1;count<eventLength;count++) {
    			if (rawDaysAsInt.indexOf(day+count) == -1) {
    				daysAsInt.pop();
    				break;
    			}
    		}
    	});
    	// Return days
    	if (daysAsInt.length == 0) {
    		return null;
    	} else {
    		return { startMoment : startMoment, selectedRange : daysAsInt };
    	}
    }

    // Fills out an array of days in a month
    protected createCollection(StartOfMonth: Moment): ICalendarUnit[] {
        var startDay = moment(StartOfMonth).startOf('month'),
            endDay = moment(StartOfMonth).endOf('month'),
            days: ICalendarUnit[] = [];

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
        	if (startDay.month()!=StartOfMonth.month()
        			|| (startDay.isBefore(this.startOfCalendar))) {
        		calDay.setEnabledStatus(false);
        	}
        	// Check if day is available
        	else if (this.availableArray != undefined) {
        		var dayAsInt : number = startDay.diff(this.startOfCalendar, 'days');
				calDay.setEnabledStatus(false);
        		for (var count = 0;count < this.eventLength; count++) {
        			if (this.availableArray.indexOf(dayAsInt-count) != -1) {
        				calDay.setEnabledStatus(true);
        			}
        		}
        	}
            days.push(calDay);
            startDay.add(1, 'day');
        }

        return days;
    }
}

// #############################################################################
// Dummy unit displaying hour in CalendarWeek view model
// #############################################################################
export class DummyHour implements ICalendarUnit {
	constructor (public DateText,
	public Status = ko.computed(function() {return 'hour header false'}),
	public CalMoment = null,
	public IsSelected = ko.observable(false)) {
		// Initialization
	}
    public toggleSelectedStatus() {} // Empty function
}

// #############################################################################
// Each hour of a CalendarWeek view model
// #############################################################################
export class CalendarHour extends CalendarDay {
    public Status: KnockoutComputed<string> = ko.computed((): string => {
        var status = "hour ";
        status += this.IsEnabled();
        status += " ";
        status += this.getSelectedStatus();
        return status; 
    }, this);
	
    // Returns the text that will be displayed on the calendar
    // based on the current hour
    protected getDateText(): string {
        return '';
    }
}

// #############################################################################
// CalendarWeek view model
// #############################################################################
export class CalendarWeekVm extends CalendarMonthVm {	
    public updateHeader() {
    	this.Day.removeAll();
    	var startDay = moment(this.startOfCalendar).add(this.currentIndex, 'weeks').startOf('week').add(1, 'days');
    	var headerText = startDay.format('Do');
    	for (var day=0;day<DAYS_IN_WEEK;day++) {
    		this.Day.push(startDay.format('Do'));
    		startDay.add(1, 'days');
    	}
    	headerText += ' to '
    	headerText += startDay.subtract(1, 'days').format('Do, MMMM YYYY');
        this.Header(headerText);
    }
    
    // Switches calendar to next week; Create if not exists
    public next() {
    	this.currentIndex++;
    	if (this.currentIndex >= this.collections.length) {
    		var startOfNextWeek = moment(this.startOfCalendar).add(this.currentIndex, 'weeks');
    		this.collections.push(this.createCollection(startOfNextWeek));
    	}
    	this.Collection(this.collections[this.currentIndex]);
        this.updateHeader();
    }
    
    // Exports selected dates as start day and a number array
    public exportSelectedDates(eventLength:number) {
    	var hours = [].concat.apply([], this.collections); // Flatten array
    	// Find the first selected day
    	var rawHoursAsInt = [];
    	var hoursAsInt = [];
    	var startMoment;
    	if (this.availableArray != undefined) {
    		startMoment = this.startOfCalendar;
    	} else {
    		for (var count = 0; count<hours.length; count++) {
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
    		for (var count = 1;count<eventLength;count++) {
    			if (rawHoursAsInt.indexOf(hour+count) == -1) {
    				hoursAsInt.pop();
    				break;
    			}
    		}
    	});
    	// Return days
    	if (hoursAsInt.length == 0) {
    		return null;
    	} else {
    		return { startMoment : startMoment, selectedRange : hoursAsInt };
    	}
    }
    
    // Fills out an array of hours in a week
    protected createCollection(StartOfWeek: Moment): ICalendarUnit[] {
        var startDay = moment(StartOfWeek.subtract(1, 'days')).startOf('week').add(1, 'days'),
            hours: ICalendarUnit[] = [];
        
        // Create CalendarHour objects for each hour
    	for (var hour=0;hour<HOURS_IN_DAY;hour++) {
    		var hourHeader = new DummyHour(moment(startDay).add(hour, 'hour').format('ha'));
    		hours.push(hourHeader);
    		for (var day=0;day<DAYS_IN_WEEK;day++) {
        		var calMoment = moment(startDay).add(hour, 'hour').add(day, 'days');
        		var calHour = new CalendarHour(calMoment);
            	if (calMoment.isBefore(this.startOfCalendar)) {
            		calHour.setEnabledStatus(false);
            	} else if (this.availableArray != undefined) {
            		var hourAsInt : number = calMoment.diff(this.startOfCalendar, 'hours');
    				calHour.setEnabledStatus(false);
            		for (var count = 0;count < this.eventLength; count++) {
            			if (this.availableArray.indexOf(hourAsInt-count) != -1) {
            				calHour.setEnabledStatus(true);
            			}
            		}
            	}
                hours.push(calHour);
        	}
        }
        return hours;
    }
}