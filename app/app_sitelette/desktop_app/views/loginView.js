'use strict';

define([
	'../../scripts/appCache.js',
	'ejs!../templates/login.ejs',
	'ejs!../templates/logout.ejs',
	], function(appCache, loginTemplate, logoutTemplate){
	var LoginView = Mn.View.extend({
		el: '#login-container',
		ui: {
			login_btn : '#login-btn',
			user_email : '.user_email'
		},
		events: {
			'click' : 'onLogin'
		},
		initialize: function() {
			var user = appCache.get('user');

			this.logged = user && user.getUID() ? true : false;
			this.template = this.logged ? logoutTemplate : loginTemplate;
			this.render();
		},
		render: function () {
			var userEmail = this.logged ? appCache.get('user').userName : "";
			this.$el.html(this.template());
			this.bindUIElements(); //required for dynamic template rendered in existing element
			this.ui.user_email.html(userEmail);
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