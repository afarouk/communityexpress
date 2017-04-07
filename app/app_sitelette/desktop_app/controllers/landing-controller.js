'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions',
	'./catalogs-controller',
	'./popups-controller',
	'../../scripts/actions/contactActions'
	], function(appCache, h, 
		DiscountsView, PromotionsView, catalogsController, popupsController, contactActions){
	var LandingController = Mn.Object.extend({
		start: function() {
			var discountsView = new DiscountsView();
			this.listenTo(discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			this.listenTo(discountsView, 'onSendSMS', this.onSendSMS.bind(this));
			var promotionsView = new PromotionsView();
			this.listenTo(promotionsView, 'onPromotion', this.onPromotionSelected.bind(this));
			this.listenTo(promotionsView, 'onSendSMS', this.onSendSMS.bind(this));
		},
		onDiscountSelected: function(options) {
			console.log(options);
			appCache.fetch('promoCode', options.promoCode);
		},
		onPromotionSelected: function(options) {
			console.log(options);
			catalogsController.onPromotionSelected(options);
		},
		onSendSMS: function(type, phone, uuid, shareUrl) {
			popupsController.showMessage({
				message: 'Sending message to... ' + phone,
				loader: true,
				infinite: true
			});
			contactActions.shareURLviaSMS('DISCOUNT', window.saslData.serviceAccommodatorId,
                window.saslData.serviceLocationId, phone, uuid, shareUrl)
                .then(function(res){
                	if (res.success) {
                		popupsController.showMessage({
							message: 'Sending message success.',
							loader: true
						});
                	} else {
                		popupsController.showMessage({
							message: res.explanation,
							loader: true
						});
                	}
                }.bind(this))
                .fail(function(res){
                  if (res.responseJSON && res.responseJSON.error) {
                    popupsController.showMessage({
							message: res.responseJSON.error.message,
							loader: true
						});
                  }
                }.bind(this));
		}
	});
	return new LandingController();
});