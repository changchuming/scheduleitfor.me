/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/jqueryui.d.ts" />
/// <reference path="../../../definitions/touchpunch.d.ts" />
/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />

export function createSchedule(data, showSuccess, showError) {
	$.ajax({
		type: 'POST',
		url: '/create',
		data: data,
		success: function(reply) {
			showSuccess(reply.reply);
		 },
		error: function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR.responseText.split('\n')[0]);
		}
	});
}

export function submitResults(data, showError) {
	$.ajax({
		type: 'POST',
		url: '/submit',
		data: data,
		success: function(reply) {
			if (reply == "") {
				window.location.href = $(location).attr('href')+'/r';
			} else {
				showError(reply);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR.responseText.split('\n')[0]);
		}
	});
}