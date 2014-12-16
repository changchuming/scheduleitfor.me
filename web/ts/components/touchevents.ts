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
                    customEvents.selected;
                },
                selecting: function (e, ui) {                    
                    customEvents.selected;
                },
                unselecting: function (e, ui) {
                    customEvents.selected;
                }
            }

            selectableElement.bind('mousedown', function (e){
        	    e.metaKey = true;
        	})
        	.selectable(options);
        }
    };

//    // Initializes Selection Handlers on Each Selectable Item
//    ko.bindingHandlers.selectableItem = {
//        init: function (element, valueAccessor, allBindingsAccessor) {
//            var selectable = $(element).parent();
//
//            selectable.bind('selectableselected', function (event, ui) {
//                if (ui.selected === element) {
//                    var value = valueAccessor();
//                    value(true);
//                }
//            });
//
//            selectable.bind('selectableunselected', function (event, ui) {
//                if (ui.unselected === element) {
//                    var value = valueAccessor();
//                    value(false);
//                }
//            });
//        }
//    };
}

//var selectableDefaults = {
//    selected: function (event, ui) {
//        if ($(ui.selected).hasClass('chosenfilter')) {
//            $(ui.selected).removeClass('chosenfilter').removeClass('ui-selected');
//        } else {
//            $(ui.selected).addClass('chosenfilter').addClass('ui-selected');
//        }
//    },
//    selecting: function (event, ui) {
//        if ($(ui.selecting).hasClass('chosenfilter')) {
//            $(ui.selecting).addClass('ui-unselecting');
//            $(ui.selecting).removeClass('ui-selected');
//        }
//    },
//    unselecting: function (event, ui) {
//        if ($(ui.unselecting).hasClass('chosenfilter')) {
//            $(ui.unselecting).removeClass('ui-unselecting');
//            $(ui.unselecting).addClass('ui-selected');
//        }
//    }
//};