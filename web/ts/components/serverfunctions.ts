/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/jqueryui.d.ts" />

export function createSchedule(data, showSuccess, showMessage) {
	$.ajax({
		type: 'POST',
		url: '/create',
		data: data,
		success: function(reply) {
			showSuccess(reply.reply);
		 },
		error: function(jqXHR, textStatus, errorThrown) {
			showMessage('Error', jqXHR.responseText.split('\n')[0]);
		}
	});
}

export function submitResults(data, showMessage) {
	$.ajax({
		type: 'POST',
		url: '/submit',
		data: data,
		success: function(reply) {
			if (reply == "") {
				window.location.href = $(location).attr('href')+'/r';
			} else {
				showMessage('Error', reply);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			showMessage('Error', jqXHR.responseText.split('\n')[0]);
		}
	});
}

export function getAvailability(data, showAvailability, showMessage) {
	$.ajax({
		type: 'POST',
		url: '/availability',
		data: data,
		success: function(reply) {
			if (reply.userlist != '[]') {
				showAvailability(reply);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			showMessage('Error', jqXHR.responseText.split('\n')[0]);
		}
	});
}