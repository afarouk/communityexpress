'use strict';

define([
	'ejs!../../templates/popups/forgotPassword.ejs',
	], function(template){
	var ForgotPasswordView = Mn.View.extend({
		template: template,
		className: 'forgot-popup',
		attributes: { title: 'Forgot password' },
		ui: {
			username: '[name="username"]',
			submit: '[name="submit"]'
		},
		events: {
			'click @ui.submit': 'onSubmit'
		},
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	},
     	onSubmit: function() {
     		var username = this.ui.username.val();
     		//TODO validate
     		this.trigger('user:remember',  username, this.onClose.bind(this));
     	}
	});
	return ForgotPasswordView;
});