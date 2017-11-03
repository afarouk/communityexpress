'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../views/landing/discounts',
	'../views/landing/promotions',
	'../views/landing/loyaltyCard',
	'../views/landing/appointments',
	'../views/landing/photoContest',
	'../views/landing/poll',
	'../views/landing/share',
	'../../scripts/actions/contactActions',
	'../../scripts/actions/loyaltyActions',
	'../../scripts/actions/contestActions',
	'../views/popups/sendsms',
	'../views/backBtnView',
	], function(appCache, h,
		DiscountsView, PromotionsView, LoyaltyCardView, AppointmentsView, PhotoContestView, PollView,
		ShareView, contactActions, loyaltyActions, contestActions, SendsmsView, BackBtnView){
	var LandingController = Mn.Object.extend({
		sa: community.serviceAccommodatorId,
        sl: community.serviceLocationId,
		start: function() {
			this.discountsView = new DiscountsView();
			this.listenTo(this.discountsView, 'onDiscount', this.onDiscountSelected.bind(this));
			this.listenTo(this.discountsView, 'onSendSMS', this.onSendSMS.bind(this));

			this.promotionsView = new PromotionsView();
			this.listenTo(this.promotionsView, 'onPromotion', this.onPromotionSelected.bind(this));
			this.listenTo(this.promotionsView, 'onSendSMS', this.onSendSMS.bind(this));

			this.loyaltyProgram = saslData.loyaltyProgram || {};
			this.loyaltyCardView = new LoyaltyCardView();
			this.loyaltyCardView.render(this.loyaltyProgram);

			this.listenTo(this.loyaltyCardView, 'onRefresh', this.onLoyaltyRefresh.bind(this));
			this.listenTo(this.loyaltyCardView, 'onSendSMS', this.onSendSMS.bind(this));

			//TODO get appointments data and render 
			//after calendar changed rerender
			this.appointmentsView = new AppointmentsView();

			//TODO photo contests view
			this.photoContestView = new PhotoContestView();

			this.pollView = new PollView();
			this.listenTo(this.pollView, 'onSendSMS', this.onSendSMS.bind(this));
			this.listenTo(this.pollView, 'onEnterPoll', this.onEnterPoll.bind(this));

			var shareView = new ShareView();
			this.listenTo(shareView, 'onSendSMS', this.onSendSMS.bind(this));

			var sendsmsView = new SendsmsView();
			this.listenTo(sendsmsView, 'onSendSMS', this.onSendSMS.bind(this));

			var backBtnView = new BackBtnView();
		},
		onLoginStatusChanged: function() {
			var user = appCache.get('user'),
				uuid = user ? user.getUID() : null;
			this.landingViewsRender(uuid);
		},
		landingViewsRender: function(uuid) {
			this.loyaltyRender(uuid);
			this.pollRender(uuid);
		},
		pollRender: function(uuid) {
			if (!uuid && this.pollView) {
				this.pollView.render();
			}
			if (uuid) this.retrievePoll(uuid);
		},
		retrievePoll: function() {
			contestActions.pollBySASL(this.sa,this.sl)
				.then(function(poll) {
				    if (poll) {
						this.pollView.render(poll);
				    } else {
				    	this.pollView.$el.hide();
				    }
				}.bind(this))
				.fail(function(err){
				    //TODO manage error
				    this.$el.hide();
				}.bind(this));
		},
		onEnterPoll: function(uuid, choise, callback) {
			this.dispatcher.get('popups').requireLogIn(function() {
				contestActions.enterPoll(this.sa,this.sl, uuid, choise)
	                .then(function(result) {
	                	callback(result);
	                }.bind(this))
	                .fail(function(err){
	                    // popupController.textPopup({ text: 'You already answered this question.'});
	                }.bind(this));
			}.bind(this));
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
	          			this.loyaltyCardView.renderLoyaltyDetails(resp);
	          		}
	          	}.bind(this));
		},
		onDiscountSelected: function(options) {
			console.log(options);
			if (options.uuid && !options.promoCode) {
				this.dispatcher.get('order').retrievePromoCodeByUUID(options.uuid)
					.then(this.onDiscountRetrieved.bind(this));
			} else {
				appCache.fetch('promoCode', options.promoCode);
				this.dispatcher.get('order').onDiscountSelected();
			}
		},
		onDiscountRetrieved: function(discount) {
			appCache.fetch('promoCode', discount.promoCode);
			this.onDiscountUsed();
		},
		onDiscountUsed: function() {
			this.discountsView.triggerMethod('discountUsed');
		},
		onPromotionSelected: function(options) {
			console.log(options);
			this.dispatcher.get('catalogs').onPromotionSelected(options);
		},
		onPromotionSelectedConfirmed: function() {
			this.promotionsView.triggerMethod('promotionSelected');
		},
		onPromotionUnselected: function() {
			this.promotionsView.triggerMethod('promotionUnselected');
		},
		onSendSMS: function(type, phone, uuid, shareUrl) {
			this.dispatcher.get('popups').showMessage({
				message: 'Sending message to... ' + phone,
				loader: true,
				infinite: true
			});
			contactActions.shareURLviaSMS(type, window.saslData.serviceAccommodatorId,
                window.saslData.serviceLocationId, phone, uuid, shareUrl)
                .then(function(res){
                	if (res.success) {
                		this.dispatcher.get('popups').showMessage({
							message: 'Sending message success.',
							loader: true
						});
                	} else {
                		this.dispatcher.get('popups').showMessage({
							message: res.explanation,
							loader: true
						});
                	}
                }.bind(this))
                .fail(function(res){
                  if (res.responseJSON && res.responseJSON.error) {
                    this.dispatcher.get('popups').showMessage({
							message: res.responseJSON.error.message,
							loader: true
						});
                  }
                }.bind(this));
		},

		onLoyaltyRefresh: function() {
			this.dispatcher.get('popups').onUserLogin();
		}
	});
	return LandingController;
});