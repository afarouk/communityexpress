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
	'../views/landing/videos',
	'../views/landing/share',
	'../../scripts/actions/contactActions',
	'../../scripts/actions/loyaltyActions',
	'../../scripts/actions/contestActions',
	'../views/popups/sendsms',
	'../views/backBtnView',
	], function(appCache, h,
		DiscountsView, PromotionsView, LoyaltyCardView, AppointmentsView, PhotoContestView, PollView, VideosView,
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
			this.listenTo(this.photoContestView, 'onSendSMS', this.onSendSMS.bind(this));
			this.listenTo(this.photoContestView, 'onEnterPhoto', this.onEnterPhoto.bind(this));

			this.pollView = new PollView();
			this.listenTo(this.pollView, 'onSendSMS', this.onSendSMS.bind(this));
			this.listenTo(this.pollView, 'onEnterPoll', this.onEnterPoll.bind(this));

			this.videosView = new VideosView();

			var shareView = new ShareView();
			this.listenTo(shareView, 'onSendSMS', this.onSendSMS.bind(this));

			var sendsmsView = new SendsmsView();
			this.listenTo(sendsmsView, 'onSendSMS', this.onSendSMS.bind(this));

			var backBtnView = new BackBtnView();
		},
		onLoginStatusChanged: function() {
			var user = appCache.get('user'),
				uid = user ? user.getUID() : null;
			this.landingViewsRender(uid);
		},
		landingViewsRender: function(uid) {
			this.loyaltyRender(uid);
			this.pollRender(uid);
			this.photoRender(uid);
		},
		photoRender: function(uid) {
			if (!uid && this.photoContestView) {
				this.photoContestView.render();
			}
			if (uid) this.retrievePhoto(uid);
		},
		retrievePhoto: function() {
			contestActions.photoBySASL(this.sa,this.sl)
				.then(function(contest) {
				    if (contest) {
						this.photoContestView.render(contest);
				    } else {
				    	this.photoContestView.$el.hide();
				    }
				}.bind(this))
				.fail(function(err){
				    //TODO manage error
				    this.$el.hide();
				}.bind(this));
		},
		pollRender: function(uid) {
			if (!uid && this.pollView) {
				this.pollView.render();
			}
			if (uid) this.retrievePoll(uid);
		},
		retrievePoll: function(uid) {
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
		onEnterPhoto: function(contestUUID, image, message, callback) {
			var file = h().dataURLtoBlob(image.data);

	        contestActions.enterPhotoContest(this.sa, this.sl,
	            contestUUID, file, message)
	            .then(function(result) {
	            	callback(result);
	            	this.dispatcher.get('popups').showMessage({
						message: 'Photo contest entered.',
						loader: true
					});
	            }.bind(this))
	            .fail(function(err){
	                this.dispatcher.get('popups').showMessage({
						message: 'error uploading photo.',
						loader: true
					});
	            }.bind(this));
		},
		loyaltyRender: function(uid) {
			if (!uid && this.loyaltyCardView) {
				this.loyaltyCardView.render(this.loyaltyProgram);
			}
			if (uid) this.retrieveLoyaltyStatus(uid);
		},
		retrieveLoyaltyStatus: function(uid) {
			loyaltyActions.updateLoyaltyStatus(uid)
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