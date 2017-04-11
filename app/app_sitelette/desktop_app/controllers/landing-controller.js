'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions',
	'../views/landing/loyaltyCard',
	'../views/landing/share',
	'../../scripts/actions/contactActions',
	'../../scripts/actions/loyaltyActions'
	], function(appCache, h,
		DiscountsView, PromotionsView, LoyaltyCardView, ShareView, contactActions, loyaltyActions){
	var LandingController = Mn.Object.extend({
		start: function() {
			var discountsView = new DiscountsView();
			this.listenTo(discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			this.listenTo(discountsView, 'onSendSMS', this.onSendSMS.bind(this));

			var promotionsView = new PromotionsView();
			this.listenTo(promotionsView, 'onPromotion', this.onPromotionSelected.bind(this));
			this.listenTo(promotionsView, 'onSendSMS', this.onSendSMS.bind(this));

			this.loyaltyProgram = saslData.loyaltyProgram || {};
			this.loyaltyCardView = new LoyaltyCardView();
			this.loyaltyCardView.render(this.loyaltyProgram);
			this.listenTo(this.loyaltyCardView, 'onRefresh', this.onLoyaltyRefresh.bind(this));

			var shareView = new ShareView();
			this.listenTo(shareView, 'onSendSMS', this.onSendSMS.bind(this));
		},
		onLoginStatusChanged: function() {
			var user = appCache.get('user'),
				uuid = user ? user.getUID() : null;
			this.loyaltyRender(uuid);
		},
		loyaltyRender: function(uuid) {
			if (!uuid && this.loyaltyCardView) {
				this.loyaltyCardView.render(this.loyaltyProgram);
			}
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
			this.dispatcher.getOrderController().onDiscountSelected();
		},
		onPromotionSelected: function(options) {
			console.log(options);
			this.dispatcher.getCatalogsController().onPromotionSelected(options);
		},
		onSendSMS: function(type, phone, uuid, shareUrl) {
			this.dispatcher.getPopupsController().showMessage({
				message: 'Sending message to... ' + phone,
				loader: true,
				infinite: true
			});
			contactActions.shareURLviaSMS('DISCOUNT', window.saslData.serviceAccommodatorId,
                window.saslData.serviceLocationId, phone, uuid, shareUrl)
                .then(function(res){
                	if (res.success) {
                		this.dispatcher.getPopupsController().showMessage({
							message: 'Sending message success.',
							loader: true
						});
                	} else {
                		this.dispatcher.getPopupsController().showMessage({
							message: res.explanation,
							loader: true
						});
                	}
                }.bind(this))
                .fail(function(res){
                  if (res.responseJSON && res.responseJSON.error) {
                    this.dispatcher.getPopupsController().showMessage({
							message: res.responseJSON.error.message,
							loader: true
						});
                  }
                }.bind(this));
		},

		onLoyaltyRefresh: function() {
			this.dispatcher.getPopupsController().onUserLogin();
		}
	});
	return LandingController;
});