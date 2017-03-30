'use strict';

define([
	'ejs!../templates/signin.ejs',
	], function(template){
	var SigninView = Mn.View.extend({
		template: template,
		attributes: { title: 'Sign in' },
		ui: {
			username: '[name="username"]',
			password: '[name="password"]',
			show_password: '[name="show_password"]',
			signup_btn: '[name="signup_btn"]'
		},
		events: {
			'click @ui.signup_btn': 'onSignup'
		},
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	},
     	onSignup: function() {
     		this.trigger('user:signup');
     	}
	});
	return SigninView;
});