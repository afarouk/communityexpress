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
	], function(appCache, h, userController, sessionActions,
		PopupsLayoutView, LoginView, SigninView, SignupView, SignoutView){
	var PopupsController = Mn.Object.extend({
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
		onRememberPassword: function() {
			
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
			// loader.show();
        	userController.logout(user.getUID()).then(function(){
        		this.onLoginStatusChanged();
        		console.log('user logged out');
        	}.bind(this));
		}
	});
	return new PopupsController();
});