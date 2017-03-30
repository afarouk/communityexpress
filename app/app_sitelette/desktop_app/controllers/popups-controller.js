'use strict';

define([
	'../../scripts/appCache',
	'../views/popupsLayout',
	'../views/loginView',
	'../views/signin',
	'../views/signup'
	], function(appCache, PopupsLayoutView, LoginView, SigninView, SignupView){
	var PopupsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new PopupsLayoutView();
		},
		onLoginStatusChanged: function() {
			this.loginView = new LoginView();
			this.listenTo(this.loginView, 'user:login', this.onUserLogin.bind(this));
		},
		onUserLogin: function() {
			var signin = new SigninView();
			this.layout.showChildView('popupsContainer', signin);
			this.listenTo(signin, 'user:signup', this.onUserSignup.bind(this));
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
		onUserSignup: function () {
			var signup = new SignupView();
			this.layout.showChildView('popupsContainer', signup);
			// this.listenTo(signin, 'user:signup', this.onUserSignup.bind(this));
			this.initializeDialog(signup.$el);
			signup.onShow();
		}
	});
	return new PopupsController();
});