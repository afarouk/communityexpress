'use strict';

define([
	'ejs!../templates/login.ejs',
	'ejs!../templates/logout.ejs',
	], function(loginTemplate, logoutTemplate){
	var PopupsLayoutView = Mn.View.extend({
		el: '#login-btn',
		events: {
			'click' : 'onLogin'
		},
		initialize: function() {
			this.render();
		},
		render: function () {
			this.$el.html(loginTemplate());
			return this;
     	},
     	onLogin: function() {
     		this.trigger('user:login');
     	}
	});
	return PopupsLayoutView;
});