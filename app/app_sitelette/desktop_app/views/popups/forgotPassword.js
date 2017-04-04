'use strict';

define([
	'ejs!../../templates/popups/forgotPassword.ejs',
	'./inputsValidationBehavior',
	], function(template, InputsValidationBehavior){
	var ForgotPasswordView = Mn.View.extend({
		template: template,
		behaviors: [InputsValidationBehavior],
		className: 'forgot-popup',
		attributes: { title: 'Forgot password' },
		ui: {
			username: '[name="username"]',
			submit: '[name="submit"]'
		},
		events: {
			// 'click @ui.submit': 'onSubmit'
		},
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	},
     	onProceedSubmit: function() {
     		var username = this.ui.username.val();
     		//TODO validate
     		this.trigger('user:remember',  username, this.onClose.bind(this));
     	}
	});
	return ForgotPasswordView;
});