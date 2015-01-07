/// <reference path="./moment.d.ts" />
/// <reference path="./knockout.d.ts" />

interface KnockoutBindingHandlers {
    selectable: KnockoutBindingHandler;
    selectableItem: KnockoutBindingHandler;
}

interface ICalendarUnit {
	CalMoment: Moment;
    Status: KnockoutComputed<string>;
    IsSelected: KnockoutObservable<boolean>;
    DateText: string;
}

interface ICalendar {
    Collection: KnockoutObservableArray<ICalendarUnit>;
}

interface IResultEntry {
	CalMoment: Moment;
	SequenceIndex; //Funny bug: will be considered string if casted to number
	Response: KnockoutObservable<number>;
	TotalResponse: KnockoutObservable<number>;
    DateText: KnockoutObservable<string>;
}

interface IResultSet {
	Set: KnockoutObservableArray<IResultEntry>;
}

interface IDetails {
	Title : string;
	Details:string;
	Length:string;
	Mode:string;
}

interface JQuery {
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param handler A function to execute each time the event is triggered.
     */
    bind(eventType: string, handler: (eventObject: JQueryEventObject, ui: JQueryUI.SelectableUIObject) => void): JQuery;
}

declare module JQueryUI {
    interface SelectableUIObject {
        selected: JQuery;
        unselected: JQuery;
    }
}