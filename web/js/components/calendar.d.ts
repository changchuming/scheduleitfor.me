/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
export interface ICalendarDay {
    MonthStatus: KnockoutComputed<string>;
    IsSelected: boolean;
    CalDate: Date;
    DayText: string;
}
export interface ICalendar {
    Days: KnockoutObservableArray<ICalendarDay>;
}
export declare class CalendarDay implements ICalendarDay {
    CalDate: Date;
    DayText: string;
    IsSelected: boolean;
    MonthStatus: KnockoutComputed<string>;
    onSelect(): void;
    OnTap(bindingContext: KnockoutBindingContext): void;
    constructor(CalDate: Date, DayText?: string, IsSelected?: boolean);
    private _monthStatus();
    private _getDayText();
}
export declare class CalendarVm implements ICalendar {
    private _aroundThisDate;
    private _days;
    Days: KnockoutObservableArray<ICalendarDay>;
    private _daysInWeek;
    private getSelectedDates();
    constructor(_aroundThisDate?: Date, _days?: ICalendarDay[], Days?: KnockoutObservableArray<ICalendarDay>);
    private createCalendarDays(AroundThisDate);
}
