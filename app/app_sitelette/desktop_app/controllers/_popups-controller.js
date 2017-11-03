'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../../scripts/controllers/userController',
	'../../scripts/actions/sessionActions',
	'../views/popupsLayout',
	'../views/loginView',
	'../views/popups/signin',
	'../views/popups/signup',
	'../views/popups/signout',
	'../views/popups/forgotPassword',
	'../views/popups/message',
	'../views/popups/loader',
	'../views/landing/share',
	'../views/popups/sendsms',
	'../views/popups/ordersHistory',
	'../views/popups/expandImage',
	'../../scripts/actions/contactActions',
	'../../../vendor/scripts/js.cookie'
	], function(appCache, h, userController, sessionActions,
		PopupsLayoutView, LoginView, SigninView, SignupView, 
		SignoutView, ForgotView, MessageView, LoaderView, 
		ShareView, SendsmsView, OrdersHistoryView, ExpandImageView,
		contactActions, Cookies){
	var PopupsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new PopupsLayoutView();

			this.onShareBySms();
		},
		onLoginStatusChanged: function() {
			this.loginView = new LoginView();
			this.listenTo(this.loginView, 'user:login', this.onUserLogin.bind(this));
			this.listenTo(this.loginView, 'user:logout', this.onUserLogout.bind(this));
			this.listenTo(this.loginView, 'order:history', this.onOrderHistory.bind(this));
			this.dispatcher.onLoginStatusChanged();
		},
		onUserLogin: function(callback) {
			var signin = new SigninView({
				callback: typeof callback === 'function' ? callback : function(){}
			});
			this.layout.showChildView('popupsContainer', signin);
			this.listenTo(signin, 'user:signup', this.onUserSignup.bind(this));
			this.listenTo(signin, 'user:signup', this.onUserSignup.bind(this));
			this.listenTo(signin, 'user:signin', this.onUserSignin.bind(this));
			this.listenTo(signin, 'user:forgot', this.onUserForgot.bind(this));
			this.listenTo(signin, 'user:facebook', this.onUserFacebookLogin.bind(this));
			this.initializeDialog(signin.$el);
			signin.onShow();
		},
		onShareBySms: function() {
			this.shareView = new ShareView();
			this.listenTo(this.shareView, 'user:sendsmsopen', this.onUserSendsmsopen.bind(this));
		},
		onUserSendsmsopen: function(callback) {
			var sendsms = new SendsmsView();
			this.layout.showChildView('popupsContainer', sendsms);
			this.listenTo(sendsms, 'onSendSMS', this.onSendSMS.bind(this));
			this.initializeDialog(sendsms.$el);
			sendsms.onShow();
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
		initializeDialog: function($el) {
			$el.dialog({ 
				autoOpen: false,
				draggable: false,
				resizable: false,
				modal: true,
				closeOnEscape: false
			});
		},
		onUserSignin: function(creds, onClose, callback) {
			sessionActions.startSession(creds.username, creds.password)
            .then(function(response){
                this.onLoginStatusChanged();
                onClose();
                callback();

				this.showMessage({
					message: 'user is logging in',
					loader: true
				});
            }.bind(this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'Error signin in');
                console.log(text);
                this.showMessage({
					message: text,
					confirm: 'ok',
					callback: this.onUserLogin.bind(this)
				});
            }.bind(this));
		},
		onUserFacebookLogin: function(status, onClose) {
			sessionActions.facebookLoginStatus(status)
                .then(function(response){
             		onClose();
                    if (response.success) {
                    	this.showMessage({
							message: 'Successfully Logged in with FB Login',
							confirm: 'ok',
							callback: this.onLoginStatusChanged.bind(this)
						});
                    } else {
                    	this.showMessage({
							message: response.error,
							loader: true
						});
                    }
                }.bind(this));
		},
		onUserSignup: function () {
			var signup = new SignupView();
			this.layout.showChildView('popupsContainer', signup);
			this.listenTo(signup, 'user:signup', this.onCreateNewUser.bind(this));
			this.initializeDialog(signup.$el);
			signup.onShow();
		},
		onUserForgot: function() {
			var forgot = new ForgotView();
			this.layout.showChildView('popupsContainer', forgot);
			this.listenTo(forgot, 'user:remember', this.onRememberPassword.bind(this));
			this.initializeDialog(forgot.$el);
			forgot.onShow();
		},
		onCreateNewUser: function(creds, onClose) {
			sessionActions.registerNewMember(
                creds.email,
                creds.password,
                creds.password_confirmation)
                    .then(function(){
                    	this.onLoginStatusChanged();
                    	onClose();
                    }.bind(this), onClose);

		},
		onRememberPassword: function(username, onClose) {
			sessionActions.forgotPassword(username)
	            .then(function(response){
	                console.log('An email has been sent to let you change the password');
	                onClose();
	            }.bind(this), function(jqXHR) {
	                var text = h().getErrorMessage(jqXHR, 'Error signin in');
	                console.log(text);
	            }.bind(this));
		},
		onUserLogout: function() {
			var order = appCache.get('orderInProcess'),
				signout = new SignoutView({
					order: order
				});
			this.layout.showChildView('popupsContainer', signout);
			this.listenTo(signout, 'user:submitLogout', this.onUserSubmitLogout.bind(this));
			this.initializeDialog(signout.$el);
			signout.onShow();
		},
		onUserSubmitLogout: function() {
			var user = appCache.get('user');
			
			this.showLoader();
        	userController.logout(user.getUID()).then(function(){
        		this.hideLoader();
        		this.onLoginStatusChanged();
        		console.log('user logged out');
        		this.showMessage({
        			message: 'user logged out',
        			loader: true
        		});
        		setTimeout(function() {
        			this.dispatcher.onLogoutSuccess();
        		}.bind(this), 2000);
        	}.bind(this));
		},
		onOrderHistory: function() {
			this.dispatcher.get('history').getHistory();
		},
		requireLogIn: function(callback) {
			var user = appCache.get('user'),
				adhocEntry = Cookies.get('cmxAdhocEntry'),
				logged = user && user.getUID() && adhocEntry == 'false' ? true : false;
			if (logged) {
				callback();
			} else {
				this.onUserLogin(callback);
			}
		},
		showMessage: function(options) {
			var messageView = new MessageView(options);
			this.layout.showChildView('popupsContainer', messageView);
			this.initializeDialog(messageView.$el);
			messageView.onShow();
		},
		showLoader: function() {
			this.loader = new LoaderView();
			this.layout.showChildView('popupsContainer', this.loader);
			this.initializeDialog(this.loader.$el);
			this.loader.show();
		},
		hideLoader: function() {
			this.loader.hide();
		},
		showOrdersHistory: function(history) {
			var ordersHistoryView = new OrdersHistoryView({
				history: history
			});
			this.layout.showChildView('popupsContainer', ordersHistoryView);
			this.initializeDialog(ordersHistoryView.$el);
			ordersHistoryView.onShow();
		},
		expandImage: function(imgSource, title) {
			var expandImageView = new ExpandImageView({
				imgSource: imgSource,
				title: title
			});
			this.layout.showChildView('popupsContainer', expandImageView);
			this.initializeDialog(expandImageView.$el);
			expandImageView.onShow();
		}
	});
	return PopupsController;
});