'use strict';

define([
	'ejs!../../templates/popups/signin.ejs',
     './inputsValidationBehavior'
	], function(template, InputsValidationBehavior){
	var SigninView = Mn.View.extend({
		template: template,
          behaviors: [InputsValidationBehavior],
          className: 'signin-popup',
		attributes: { title: 'Sign in' },
		ui: {
			username: '[name="username"]',
			password: '[name="password"]',
			show_password: '[name="show_password"]',
			signup_btn: '[name="signup_btn"]',
			signin_btn: '[name="signin_btn"]',
			forgot_btn: '[name="forgot_btn"]',
               facebook_login: '[name="facebook_btn"]'
		},
		events: {
			'click @ui.signup_btn': 'onSignup',
			'click @ui.forgot_btn': 'onForgot',
			'change @ui.show_password': 'onShowPasswordChange',
               'click @ui.facebook_login': 'loginWithFacebook',
		},
		initialize: function(options) {
			this.callback = options.callback;

               FB.getLoginStatus(function (response) {
                    this.facebookStatus = response.status;
               }.bind(this), true);
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	},
     	onShowPasswordChange: function() {
     		var checked = this.ui.show_password.is(':checked');
     		if (checked) {
     			this.ui.password.attr('type', 'text');
     		} else {
     			this.ui.password.attr('type', 'password');
     		}
     	},
     	onProceedSubmit: function() {
     		var username = this.ui.username.val(),
     	         password = this.ui.password.val();
     		//TODO validate fields
     		this.trigger('user:signin', {
     			username: username,
     			password: password
     		}, this.onClose.bind(this), this.callback);
     	},
          loginWithFacebook: function() {
               this.trigger('user:facebook', this.onClose.bind(this));
          },
     	onSignup: function() {
     		this.trigger('user:signup');
     	},
     	onForgot: function() {
     		this.trigger('user:forgot');
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	}
	});
	return SigninView;
});