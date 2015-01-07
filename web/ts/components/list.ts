/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />

// Mode definitions
var MODE_DAY = 1;
var MODE_HOUR = 0;

import moment = require('moment');
import ko = require('knockout');

export class ResultEntry implements IResultEntry {
	constructor(protected eventLength : number,
			public CalMoment : Moment = moment(),
			public SequenceIndex = 0,
			public Response : KnockoutObservable<number> = ko.observable(0),
			public TotalResponse : KnockoutObservable<number> = ko.observable(0),
			public DateText : KnockoutObservable<string> = ko.observable('')
			) {}
	
	public Percent : KnockoutComputed<number> = ko.computed((): number => {
		return this.Response()/this.TotalResponse()*100;
    }, this);
	
	public updateEntry(newMoment, sequenceIndex, response, totalresponse, mode) {
		this.CalMoment = newMoment;
		this.SequenceIndex = sequenceIndex;
		this.Response(response);
		this.TotalResponse(totalresponse);
		if (mode == MODE_DAY) {
			this.setDayText();
		} else {
			this.setHourText();
		}
		
	}
	
	private setDayText() {
		if (this.eventLength>1) {
			var endMoment = moment(this.CalMoment).add(this.eventLength-1, 'days');
			this.DateText(this.CalMoment.format("Do MMMM YYYY, dddd")+' to '+endMoment.format("Do MMMM YYYY, dddd"));
		} else {
			this.DateText(this.CalMoment.format("Do MMMM YYYY, dddd"));
		}
	}
	
	private setHourText() {
		if (this.eventLength>1) {
			var endMoment = moment(this.CalMoment).add(this.eventLength, 'hours');
			this.DateText(this.CalMoment.format("ha, Do MMMM YYYY, dddd")+' to '+endMoment.format("ha, Do MMMM YYYY, dddd"));
		} else {
			this.DateText(this.CalMoment.format("ha, Do MMMM YYYY, dddd"));
		}
	}
}

export class ResultSet implements IResultSet {
	constructor(private _startOfCalendar: Moment,
			private eventLength,
			private mode,
			public TotalResponse: KnockoutObservable<number> = ko.observable(-1),
			public Set: KnockoutObservableArray<ResultEntry> = ko.observableArray([])) {
            //Initialization
        }
	
	
	public updateSet(map : number[], usercount: number) {
		this.TotalResponse(usercount || 0);
		var sequenceArray = [];
		for (var count = 0; count<map.length; count+=2) {
			sequenceArray.push({sequenceIndex: map[count], response: map[count+1]});
		}
		sequenceArray.sort(function(a, b) {
			if (a.response != b.response) {
				return b.response-a.response;
			} else {
				return a.sequenceIndex-b.sequenceIndex;
			}
		});
		for (var count = 0;count<5;count++) {
			if (sequenceArray[count] != undefined) {
				if (this.mode == MODE_DAY) {
					var date : Moment = moment(this._startOfCalendar).add(sequenceArray[count].sequenceIndex, 'days');
				} else {
					var date : Moment = moment(this._startOfCalendar).add(sequenceArray[count].sequenceIndex, 'hours');
				}
				var response : number = sequenceArray[count].response;
				var totalResponse : number = this.TotalResponse();
				if (this.Set()[count] == undefined) {
					this.Set.push(new ResultEntry(this.eventLength));
				}
				this.Set()[count].updateEntry(date, sequenceArray[count].sequenceIndex, response, totalResponse, this.mode);
			}
		}
	}
}