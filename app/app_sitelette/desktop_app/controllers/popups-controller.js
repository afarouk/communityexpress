'use strict';

define([
	'../../scripts/appCache',
	'../views/popupsLayout',
	'../views/loginView',
	'../views/signin'
	], function(appCache, PopupsLayoutView, LoginView, SigninView){
	var PopupsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new PopupsLayoutView();
			this.loginView = new LoginView();
			this.listenTo(this.loginView, 'user:login', this.onUserLogin.bind(this));
			// this.layout.showChildView('popupsContainer', null);
		},
		onUserLogin: function() {
			var signin = new SigninView();
			this.layout.showChildView('popupsContainer', signin);
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
		}
	});
	return new PopupsController();
});