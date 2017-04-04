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
	'../views/popups/loader'
	], function(appCache, h, userController, sessionActions,
		PopupsLayoutView, LoginView, SigninView, SignupView, SignoutView, ForgotView, MessageView, LoaderView){
	var PopupsController = Mn.Object.extend({
		loader: new LoaderView(),
		initialize: function() {
			this.layout = new PopupsLayoutView();
		},
		onLoginStatusChanged: function() {
			this.loginView = new LoginView();
			this.listenTo(this.loginView, 'user:login', this.onUserLogin.bind(this));
			this.listenTo(this.loginView, 'user:logout', this.onUserLogout.bind(this));
		},
		onUserLogin: function() {
			var signin = new SigninView();
			this.layout.showChildView('popupsContainer', signin);
			this.listenTo(signin, 'user:signup', this.onUserSignup.bind(this));
			this.listenTo(signin, 'user:signin', this.onUserSignin.bind(this));
			this.listenTo(signin, 'user:forgot', this.onUserForgot.bind(this));
			this.initializeDialog(signin.$el);
			signin.onShow();
		},
		initializeDialog: function($el) {
			$el.dialog({ 
				autoOpen: false,
				closeOnEscape: true,
				draggable: false,
				resizable: false,
				modal: true
			});
		},
		onUserSignin: function(creds, onClose) {
			sessionActions.startSession(creds.username, creds.password)
            .then(function(response){
                this.onLoginStatusChanged();
                onClose();

				this.showMessage({
					message: 'user is logging in',
					loader: true
				});
            }.bind(this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'Error signin in');
                console.log(text);
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
			var signout = new SignoutView();
			this.layout.showChildView('popupsContainer', signout);
			this.listenTo(signout, 'user:submitLogout', this.onUserSubmitLogout.bind(this));
			this.initializeDialog(signout.$el);
			signout.onShow();
		},
		onUserSubmitLogout: function() {
			var user = appCache.get('user');
			
			this.loader.show();
        	userController.logout(user.getUID()).then(function(){
        		// this.loader.hide();
        		this.onLoginStatusChanged();
        		console.log('user logged out');
        		this.showMessage({
        			message: 'user logged out',
        			loader: true
        		});
        	}.bind(this));
		},
		requireLogIn: function(callback) {
			var user = appCache.get('user'),
				logged = user && user.getUID() ? true : false;
			if (logged) {
				callback();
			} else {
				//TODO show signin
			}
		},
		showMessage: function(options) {
			var messageView = new MessageView(options);
			this.layout.showChildView('popupsContainer', messageView);
			this.initializeDialog(messageView.$el);
			messageView.onShow();
		}
	});
	return new PopupsController();
});