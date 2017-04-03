'use strict';

define([
	], function(template){
	var InputsValidationBehavior = Mn.Behavior.extend({
		ui: {
			email: '[name="email"]',
			password: '[name="password"]',
			password_confirmation: '[name="password_confirmation"]',
			email_error: '.signup_email_error',
			password_error: '.signup_password_error',
			submit_btn: '.submit_signup_btn, .signin_btn',
			
		},
		events: {
			'click @ui.submit_btn': 'validateForm',
			'focus input': 'hideSignupError'
		},

		validateForm: function() {
			var email = this.ui.email.val(),
     			password = this.ui.password.val(),
     			password_confirmation = this.ui.password_confirmation.val();
	        var regexEmail = regexEmail = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,32}[.](([a-z]){2,32})+$/gi;
	        if (!regexEmail.test(email)) {
	            this.showSignupError('email');
	            return false;
	        } else if (password !== password_confirmation) {
	            var text = 'Password does not match the confirm password';
	            this.showSignupError('password', text);
	            return false;
	        } else if (password === '') {
	            var text = 'Please, enter password';
	            this.showSignupError('password', text);
	        } else if (password.length < 6) {
	            var text = 'Please, use more than 6 characters';
	            this.showSignupError('password', text);
	        } else {
	            // return true;
	            this.view.onSubmit();
	        };
    	},

    	showSignupError: function(error, text) {
	        switch (error) {
	            case 'password':
	                // this.$el.find('.signup_password_error').text(text).slideDown();
	                this.$el.find('.signup_password_error').text(text).removeClass('hidden');
	                break;
	            case 'email':
	                // this.$el.find('.signup_email_error').slideDown();
	                this.$el.find('.signup_email_error').removeClass('hidden');
	                break;
	            default:

	        }
	        this.$el.find('.signup_error').slideDown();
	        return false;
  		},

  		hideSignupError: function(e) {
	        var target = e.target;
	        switch (target.type) {
	            case 'email':
	                // this.$el.find('.signup_email_error').slideUp();
	                this.$el.find('.signup_email_error').addClass('hidden');
	                break;
	            case 'password':
	                // this.$el.find('.signup_password_error').slideUp();
	                this.$el.find('.signup_password_error').addClass('hidden');
	                break;
	            default:

	        }
	    }
	});
	return InputsValidationBehavior;
});