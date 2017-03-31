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
	return PopupsLayoutView;
});