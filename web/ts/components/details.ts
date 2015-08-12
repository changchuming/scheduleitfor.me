/// <reference path="../../definitions/knockout.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/browserify.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../../definitions/scheduleit.d.ts" />


import moment = require('moment');
import ko = require('knockout');

// Mode definitions
var MODE_DAY = 1;
var MODE_HOUR = 0;

export class Details implements IDetails {
	constructor(public Title,
			public Details,
			public Length,
			private _mode,
			public Mode = '') {
		//Initialization
		this.Mode = (this._mode==MODE_DAY) ? ' day(s)' : ' hour(s)';
	}
}