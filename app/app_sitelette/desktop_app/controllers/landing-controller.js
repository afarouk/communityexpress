'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts'
	], function(appCache, h, 
		DiscountView){
	var LandingController = Mn.Object.extend({
		start: function() {
			var discountView = new DiscountView();
			this.listenTo(discountView, 'onDiscount', this.onDiscountSelected.bind(this));
		},
		onDiscountSelected: function(options) {
			console.log(options);
			appCache.fetch('promoCode', options.promoCode);
		}
	});
	return new LandingController();
});