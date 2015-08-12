/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/jqueryui.d.ts" />
/// <reference path="../../definitions/knockout.d.ts" />

$('#help').click(function(){
	(<any>$('#popuphelp')).modal('show');
});

$('#about').click(function(){
	(<any>$('#popupabout')).modal('show');
});