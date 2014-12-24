/// <reference path="./knockout.d.ts" />

interface KnockoutBindingHandlers {
    selectable: KnockoutBindingHandler;
    selectableItem: KnockoutBindingHandler;
}

interface ICalendarDay {
    Status: KnockoutComputed<string>;
    IsSelected: KnockoutObservable<boolean>;
    DateText: string;
}

interface ICalendar {
    Days: KnockoutObservableArray<ICalendarDay>;
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