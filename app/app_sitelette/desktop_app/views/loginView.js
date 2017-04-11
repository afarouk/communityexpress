'use strict';

define([
	'../../scripts/appCache.js',
	'ejs!../templates/login.ejs',
	'ejs!../templates/logout.ejs',
	], function(appCache, loginTemplate, logoutTemplate){
	var PopupsLayoutView = Mn.View.extend({
		el: '#login-btn',
		events: {
			'click' : 'onLogin'
		},
		initialize: function() {
			var user = appCache.get('user');

			this.logged = user && user.getUID() ? true : false;
			this.render();
		},
		render: function () {
			var template = this.logged ? logoutTemplate : loginTemplate;
			var userEmail = this.logged ? appCache.get('user').userName : '';
			this.$el.html(template());

			if (this.logged) {
				this.$el.prev().find('.logged_in .user_email').html(userEmail);
				this.$el.prev().find('.logged_in').show();
				this.$el.prev().find('.logged_out').hide();
			}
			else {
				this.$el.prev().find('.logged_in').hide();
				this.$el.prev().find('.logged_out').show();
			}

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
	return PopupsLayoutView;
});