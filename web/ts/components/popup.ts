/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/jqueryui.d.ts" />
/// <reference path="../../definitions/knockout.d.ts" />

// Shows message in popup
export function showMessage(title, message) {
	$('#popupheader').text(title);
	$('#popupbody').html(message);
	$('#popupaddress').hide();
	$('#popuphighlight').hide();
	$('#popupgoto').hide();
    (<any>$('#popup')).modal('show');
}