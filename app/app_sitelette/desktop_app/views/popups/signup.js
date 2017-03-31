'use strict';

define([
	'ejs!../../templates/popups/signup.ejs',
	], function(template){
	var SignupView = Mn.View.extend({
		template: template,
		ui: {
			email: '[name="email"]',
			password: '[name="password"]',
			password_confirmation: '[name="password_confirmation"]',
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
     		var email = this.ui.email.val(),
     			password = this.ui.password.val(),
     			password_confirmation = this.ui.password_confirmation.val();
     		//TODO validate fields
     		if (password !== password_confirmation) return; //temporary
     		this.trigger('user:signup', {
     			email: email,
     			password: password,
     			password_confirmation: password_confirmation
     		}, this.onClose.bind(this));
     	}
	});
	return SignupView;
});