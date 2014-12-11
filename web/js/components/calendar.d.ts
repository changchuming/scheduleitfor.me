/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../../definitions/scheduleit.d.ts" />
export declare class CalendarDay implements ICalendarDay {
    DayText: string;
    IsSelected: KnockoutObservable<boolean>;
    CalDate: KnockoutObservable<Date>;
    Status: KnockoutComputed<string>;
    onSelect: (isSelected: boolean) => void;
    onClick(): void;
    constructor(calDate: Date, DayText?: string, IsSelected?: KnockoutObservable<boolean>, CalDate?: KnockoutObservable<Date>);
    private _getDayText();
    private _getMonthStatus();
    private _getSelectedStatus();
}
export declare class CalendarVm implements ICalendar {
    private _aroundThisDate;
    private _days;
    Days: KnockoutObservableArray<ICalendarDay>;
    SelectableOptions: JQueryUI.SelectableEvents;
    constructor(_aroundThisDate?: Date, _days?: ICalendarDay[], Days?: KnockoutObservableArray<ICalendarDay>);
    private _daysInWeek;
    private getSelectedDates();
    private createCalendarDays(AroundThisDate);
}
