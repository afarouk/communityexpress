'use strict';

define([
	], function(template){
	var InputsValidationBehavior = Mn.Behavior.extend({
		ui: {
			email: '[name="email"]',
			password: '[name="password"]',
			password_confirmation: '[name="password_confirmation"]',
			username: '[name="username"]',
			email_error: '.email_error',
			password_error: '.password_error',
			signin_error: '.signin_error',
			forgot_error: '.forgot_error',
			submit_btn: '.submit_signup_btn, .signin_btn, .submit_forgot_btn'
		},
		events: {
			'click @ui.submit_btn': 'validateForm',
			'keypress @ui.password': 'onCheckEnter',
			'focus input': 'hideError'
		},

		onCheckEnter: function(e) {
		    if(e.which == 13) {
		        this.validateForm();
		    }
		},

		validateForm: function() {
			var email = this.ui.email,
     			password = this.ui.password,
     			password_confirmation = this.ui.password_confirmation,
     			username = this.ui.username;

	        var regexEmail = regexEmail = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,32}[.](([a-z]){2,32})+$/gi;
	        
	        if (email.data('validation') === 'valid' && !regexEmail.test(email.val())) {
	            this.showError('email');
	            return false;
	        }  
	        else if (password.val() !== password_confirmation.val() && password.data('validation') === 'valid') {
	            var text = 'Password does not match the confirm password';
	            this.showError('password', text);
	            return false;
	        } else if (password.val() === '' && password.data('validation') === 'valid' ) {
	            var text = 'Please, enter password';
	            this.showError('password', text);
	            return false;
	        } else if (password.val() && password.val().length < 6 && password.data('validation') === 'valid') {
	            var text = 'Please, use more than 5 characters';
	            this.showError('password', text);
	            return false;
	        } else if (password.val() === '' && password.data('validation') === 'required' ) {
	            var text = 'Please, enter password and email';
	            this.showError('signin', text);
	            return false;
	        } else if (email.val() === '' && email.data('validation') === 'required' ) {
	            var text = 'Please, enter password and email';
	            this.showError('signin', text);
	            return false;
	        } else if (username.val() === '' && username.data('validation') === 'required' ) {
	            this.showError('forgot', text);
	            return false;
	        }
            else {
              // return true;
              this.view.onProceedSubmit();
	        };
    	},

    	showError: function(error, text) {
	        switch (error) {
	            case 'email':
	                this.$el.find('.email_error').removeClass('hidden');
	                break;
	            case 'password':
	                this.$el.find('.password_error').text(text).removeClass('hidden');
	                break;
	            case 'signin':
	                this.$el.find('.signin_error').text(text).removeClass('hidden');
	                break;
	            case 'forgot':
	                this.$el.find('.forgot_error').removeClass('hidden');
	                break;
	            default:

	        }
	        this.$el.find('.signup_error').slideDown();
	        return false;
  		},

  		hideError: function(e) {
	        var target = e.target;
	        switch (target.type) {
	            case 'email':
	                this.$el.find('.email_error').addClass('hidden');
	                this.$el.find('.signin_error').addClass('hidden');
	                break;
	            case 'password':
	                this.$el.find('.password_error').addClass('hidden');
	                this.$el.find('.signin_error').addClass('hidden');
	                break;
	            case 'text':
	            	this.$el.find('.email_error').addClass('hidden');
	                this.$el.find('.signin_error').addClass('hidden');
	                this.$el.find('.forgot_error').addClass('hidden');
	                break;
	            default:

	        }
	    }
	});
	return InputsValidationBehavior;
});