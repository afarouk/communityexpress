'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    '../views/partials/customizationLayout'
	], function(appCache, saslActions, catalogActions, sessionActions, CustomizationLayoutView){
	var CustomizeController = Mn.Object.extend({
		onCustomizeItem: function(layout) {
			// layout.ui.customize.attr('disabled', true);
			this.getSubItems(layout.model)
				.then(this.renderCustomize.bind(this, layout));
		},

		getSubItems: function(model) {
			var params = {
				itemId: model.get('itemId'),
				itemVersion: model.get('itemVersion'),
				priceId: model.get('priceId') 
			};
			return saslActions.getSasl()
	        .then(function(sasl) {
	        	params.sa = sasl.sa();
	        	params.sl = sasl.sl();
	            return catalogActions.getSubItems(params);
	        });
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
			layout.getRegion('customization').$el.slideToggle('slow');
			if(layout.ui.customize.hasClass('opened')) {
				layout.ui.customize.removeClass('opened')
			}
			else {
				layout.ui.customize.addClass('opened');
			}
		},
		
		onCustomConfirmed: function(layout, customizationView, selectedItems, def, model) {
			if (customizationView.allSelected) {
				var customizationNote = '',
					adjustedPrice = model.get('price');
				_.each(selectedItems, function(subItem) {
					customizationNote += _.pluck(subItem, 'displayText').join(',') + ',';
					adjustedPrice += _.reduce(_.pluck(subItem, 'priceAdjustment'), function(a, b) {return a+b;});
				});
				customizationNote = customizationNote.slice(0, -1);
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