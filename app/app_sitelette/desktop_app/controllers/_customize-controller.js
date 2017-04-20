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
				
			this.listenTo(customizationView, 'custom:cancel', this.onCustomCancel.bind(this, layout));
			this.listenTo(customizationView, 'custom:confirmed', this.onCustomConfirmed.bind(this, layout, selectedItems));
			layout.showChildView('customization', customizationView);
			layout.getRegion('customization').$el.slideToggle('slow');
			if(layout.ui.customize.hasClass('opened')) {
				layout.ui.customize.removeClass('opened')
			}
			else {
				layout.ui.customize.addClass('opened');
			}
		},

		onCustomCancel: function(layout) {
			layout.getRegion('customization').$el.slideToggle('slow');
			layout.ui.customize.attr('disabled', false);
		},
		onCustomConfirmed: function(layout, selectedItems) {
			layout.getRegion('customization').$el.slideToggle('slow');
			layout.ui.customize.attr('disabled', false);
			//TODO use selectedItems for basket item preparation
			debugger;
		}
	});
	return CustomizeController;
});