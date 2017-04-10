'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions',
	'../views/landing/loyaltyCard',
	'./catalogs-controller',
	'../../scripts/actions/contactActions',
	'../../scripts/actions/loyaltyActions'
	], function(appCache, h, 
		DiscountsView, PromotionsView, LoyaltyCardView, catalogsController, contactActions, loyaltyActions){
	var LandingController = Mn.Object.extend({
		setPopupsController: function(popupsController) {
			this.popupsController = popupsController;
		},
		start: function() {
			var discountsView = new DiscountsView();
			this.listenTo(discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			this.listenTo(discountsView, 'onSendSMS', this.onSendSMS.bind(this));

			var promotionsView = new PromotionsView();
			this.listenTo(promotionsView, 'onPromotion', this.onPromotionSelected.bind(this));
			this.listenTo(promotionsView, 'onSendSMS', this.onSendSMS.bind(this));

			var loyaltyProgram = saslData.loyaltyProgram || {};
			this.loyaltyCardView = new LoyaltyCardView();
			this.loyaltyCardView.render(loyaltyProgram);
		},
		onLoginStatusChanged: function() {
			var user = appCache.get('user'),
				uuid = user ? user.getUID() : null;
			if (uuid) this.retrieveLoyaltyStatus(uuid);
		},
		retrieveLoyaltyStatus: function(uuid) {
			loyaltyActions.updateLoyaltyStatus(uuid)
				.then(function(resp) {
	          		if (resp.hasLoyaltyProgram) {
	          			this.loyaltyCardView.renderQrCode(resp);
	          		}
	          	}.bind(this));
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
			this.popupsController.showMessage({
				message: 'Sending message to... ' + phone,
				loader: true,
				infinite: true
			});
			contactActions.shareURLviaSMS('DISCOUNT', window.saslData.serviceAccommodatorId,
                window.saslData.serviceLocationId, phone, uuid, shareUrl)
                .then(function(res){
                	if (res.success) {
                		this.popupsController.showMessage({
							message: 'Sending message success.',
							loader: true
						});
                	} else {
                		this.popupsController.showMessage({
							message: res.explanation,
							loader: true
						});
                	}
                }.bind(this))
                .fail(function(res){
                  if (res.responseJSON && res.responseJSON.error) {
                    this.popupsController.showMessage({
							message: res.responseJSON.error.message,
							loader: true
						});
                  }
                }.bind(this));
		}
	});
	return new LandingController();
});