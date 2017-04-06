'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions',
	'./catalogs-controller'
	], function(appCache, h, 
		DiscountsView, PromotionsView, catalogsController){
	var LandingController = Mn.Object.extend({
		start: function() {
			var discountsView = new DiscountsView();
			this.listenTo(discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			var promotionsView = new PromotionsView();
			this.listenTo(promotionsView, 'onPromotion', this.onPromotionSelected.bind(this));
		},
		onDiscountSelected: function(options) {
			console.log(options);
			appCache.fetch('promoCode', options.promoCode);
		},
		onPromotionSelected: function(options) {
			console.log(options);
			catalogsController.onPromotionSelected(options);
		}
	});
	return new LandingController();
});