/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/jqueryui.d.ts" />
/// <reference path="../../../definitions/touchpunch.d.ts" />
/// <reference path="../../../definitions/knockout.d.ts" />
/// <reference path="../../../definitions/scheduleit.d.ts" />

export function InitializeSelection(ko: KnockoutStatic, $: JQueryStatic) {
    // Initializes JQueryUI Selectable on an Item
    ko.bindingHandlers.selectable = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var selectableElement = $(element);
            var customEvents: JQueryUI.SelectableEvents = valueAccessor();

            var options: JQueryUI.SelectableEvents = {
                selected: function (e, ui) {
                	var viewmodel = ko.dataFor(ui.selected);
        		    $(ui.selected).removeClass('ui-selected');
                	viewmodel.toggleSelectedStatus();
                    customEvents.selected(e, ui);
                },
                selecting: function (e, ui) {
                	var viewmodel = ko.dataFor(ui.selecting);
        		    if (viewmodel.IsSelected()) {
        				$(ui.selecting).addClass('ui-unselecting');
        		    }
                    customEvents.selected(e, ui);
                },
                unselecting: function (e, ui) {
                	var viewmodel = ko.dataFor(ui.unselecting);
        		    if (viewmodel.IsSelected()) {
        				$(ui.unselecting).removeClass('ui-unselecting');
        		    }
                    customEvents.selected(e, ui);
                }
            }

            selectableElement.bind('mousedown', function (e){
        	    e.metaKey = true;
        	})
        	.selectable(options);
        }
    };
}