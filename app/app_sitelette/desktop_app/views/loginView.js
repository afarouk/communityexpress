'use strict';

define([
	'../../scripts/appCache.js',
	'ejs!../templates/login.ejs',
	'ejs!../templates/logout.ejs',
	'../../../vendor/scripts/js.cookie',
	], function(appCache, loginTemplate, logoutTemplate, Cookies){
	var LoginView = Mn.View.extend({
		el: '#login-container',
		ui: {
			user_email : '.user_email',
			login : '.login-wrapper',
			history: '.order-history'
		},
		events: {
			'click @ui.login' : 'onLogin',
			'click @ui.history' : 'onOrderHistory'
		},
		initialize: function() {
			var user = appCache.get('user'),
				adhocEntry = Cookies.get('cmxAdhocEntry');

			this.logged = user && user.getUID() && adhocEntry == 'false' ? true : false;
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
     	onLogin: function(e) {
     		if (this.logged) {
     			this.trigger('user:logout');
     		} else {
     			this.trigger('user:login');
     		}
     	},
     	onOrderHistory: function() {
     		this.trigger('order:history');
     	}
	});
	return LoginView;
});