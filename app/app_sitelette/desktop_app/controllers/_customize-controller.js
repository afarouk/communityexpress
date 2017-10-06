'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    '../views/partials/customizationLayout'
	], function(appCache, saslActions, catalogActions, sessionActions, CustomizationLayoutView){
	var CustomizeController = Mn.Object.extend({
		onCustomizeItem: function(layout, subItems) {
			this.renderCustomize(layout, subItems);
		},

		renderCustomize: function(layout, collection) {
			if (collection.length === 0) {
				//temporary solution for hide customize button
				layout.ui.customize.hide();
				return;
			}

			var selectedItems = {},
				customizationItems = new Backbone.Collection(collection),
				customizationView = new CustomizationLayoutView({
					collection: customizationItems,
					itemModel: layout.model,
					selectedItems: selectedItems
				});
				
			layout.customized = true;
			layout.off('custom:confirmed')
				  .on('custom:confirmed', this.onCustomConfirmed.bind(this, layout, customizationView, selectedItems));
			layout.showChildView('customization', customizationView);
			layout.listenTo(customizationView, 'selection:changed', this.onSelectionChanged.bind(this, layout));
			layout.getRegion('customization').$el.slideToggle('slow');
			layout.ui.customize.addClass('opened');
		},

		onSelectionChanged: function(layout, allSelected) {
			if (allSelected) {
				layout.ui.customMark.addClass('visible');
			} else {
				layout.ui.customMark.removeClass('visible');	
			}
		},
		
		onCustomConfirmed: function(layout, customizationView, selectedItems, def, model) {
			if (customizationView.allSelected) {
				var customizationNote = model.get('itemName'),
					customCollection = customizationView.collection,
					adjustedPrice = model.get('price');

				customizationNote += '[';
				_.each(selectedItems, function(subItem, sId) {
					var selected = subItem.selected,
						displayText = subItem.displayText;
					customizationNote += displayText + ':';
					customizationNote += _.reduce(selected, function(first, second){
						var first = first || '';
						return first + '+ ' + second.displayText + '(' + second.priceAdjustment.toFixed(2) + '),'; 
					}, 0);
					customizationNote = customizationNote.slice(0, -1);
					customizationNote += '; ';
					adjustedPrice += _.reduce(_.pluck(selected, 'priceAdjustment'), function(a, b) {return a+b;});
				});
				customizationNote = customizationNote.slice(0, -2);
				customizationNote += ']';
				var customizesModel = model.clone();
				customizesModel.set('customizationNote', customizationNote);
				customizesModel.set('wasCustomized', true);
				customizesModel.set('price', adjustedPrice);
				customizesModel.set('subItems', selectedItems);

				return this.resolver(def, customizesModel);
			} else {
				return this.resolver(def, model);
			}
		},
		checkCustomization: function(layout, model) {
			var def = $.Deferred(),
				hasSubItems = layout.model.get('hasSubItems');

			if (!hasSubItems) return this.resolver(def, model);
			if (layout.customized) {
				layout.trigger('custom:confirmed', def, model);
				return def;
			} else {
				return this.resolver(def, model);
			}
		}
	});
	return CustomizeController;
});