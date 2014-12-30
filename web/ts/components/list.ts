/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/browserify.d.ts" />
/// <reference path="../../../definitions/moment.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />


import moment = require('moment');
import ko = require('knockout');

export class ResultEntry implements IResultEntry {
	constructor(private eventLength : number,
			public CalMoment : Moment = moment(),
			public DayAsInt = 0,
			public Response : KnockoutObservable<number> = ko.observable(0),
			public TotalResponse : KnockoutObservable<number> = ko.observable(0),
			public DateText : KnockoutObservable<string> = ko.observable('')
			) {}
	
	public Percent : KnockoutComputed<number> = ko.computed((): number => {
		return this.Response()/this.TotalResponse()*100;
    }, this);
	
	public updateEntry(newMoment, dayAsInt, response, totalresponse) {
		this.CalMoment = newMoment;
		this.DayAsInt = dayAsInt;
		this.Response(response);
		this.TotalResponse(totalresponse);
		if (this.eventLength>1) {
			var endMoment = moment(this.CalMoment).add(this.eventLength-1, 'days');
			this.DateText(this.CalMoment.format("Do MMMM YYYY, dddd")+' to '+endMoment.format("Do MMMM YYYY, dddd"));
		} else {
			this.DateText(this.CalMoment.format("Do MMMM YYYY, dddd"));
		}
	}
}

export class ResultSet implements IResultSet {
	constructor(private _startOfCalendar: Moment,
			private eventLength,
			public TotalResponse: KnockoutObservable<number> = ko.observable(0),
			public Set: KnockoutObservableArray<IResultEntry> = ko.observableArray([])) {
            //Initialization
        }
	
	
	public updateSet(map : number[], usercount: number) {
		this.TotalResponse(usercount);
		for (var count = 0; count<map.length; count+=2) {
			var date : Moment = moment(this._startOfCalendar).add(map[count], 'days');
			var response : number = map[count+1];
			var totalResponse : number = this.TotalResponse();
			if (this.Set()[count/2] == undefined) {
				this.Set.push(new ResultEntry(this.eventLength));
			}
			this.Set()[count/2].updateEntry(date, map[count], response, totalResponse);
		}
		this.Set.sort(function(a, b){
			if (a.Response()!=b.Response()) {
				return b.Response()-a.Response();
			} else {
				return a.CalMoment.unix()-b.CalMoment.unix();
			}
			});
	}
}