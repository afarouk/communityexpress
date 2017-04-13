'use strict';

define([
	'../../scripts/appCache.js',
	'ejs!../templates/login.ejs',
	'ejs!../templates/logout.ejs',
	], function(appCache, loginTemplate, logoutTemplate){
	var LoginView = Mn.View.extend({
		el: '#login-container',
		ui: {
			'login_btn' : '#login-btn',
			'user_email' : '.user_email'
		},
		events: {
			'click @ui.login_btn' : 'onLogin'
		},
		initialize: function() {
			var user = appCache.get('user');

			this.logged = user && user.getUID() ? true : false;
			this.render();
		},
		render: function () {
			var template = this.logged ? logoutTemplate : loginTemplate, 
				userEmail = this.logged ? appCache.get('user').userName : "";
			this.bindUIElements();
				debugger;
			this.ui.user_email.html(userEmail);
			this.$el.html(template());

			return this;
     	},
     	onLogin: function() {
     		if (this.logged) {
     			this.trigger('user:logout');
     		} else {
     			this.trigger('user:login');
     		}
     	}
	});
	return LoginView;
});