'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions'
	], function(appCache, h, 
		DiscountsView, PromotionsView){
	var LandingController = Mn.Object.extend({
		start: function() {
			var discountsView = new DiscountsView();
			this.listenTo(discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			var promotionsView = new PromotionsView();
			this.listenTo(promotionsView, 'onDiscount', this.onPromotionSelected.bind(this));
		},
		onDiscountSelected: function(options) {
			console.log(options);
			appCache.fetch('promoCode', options.promoCode);
		},
		onPromotionSelected: function() {

		}
	});
	return new LandingController();
});