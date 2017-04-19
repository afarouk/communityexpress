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
			layout.ui.customize.attr('disabled', true);
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
	        })
		},
		renderCustomize: function(layout, collection) {
			var customizationItems = new Backbone.Collection(collection),
				customizationView = new CustomizationLayoutView({
					collection: customizationItems
				});
			this.listenTo(customizationView, 'custom:cancel', this.onCustomCancel.bind(this, layout));
			layout.showChildView('customization', customizationView);
			layout.getRegion('customization').$el.slideToggle('slow');
		},

		onCustomCancel: function(layout) {
			layout.getRegion('customization').$el.slideToggle('slow');
			layout.ui.customize.attr('disabled', false);
		}
	});
	return CustomizeController;
});