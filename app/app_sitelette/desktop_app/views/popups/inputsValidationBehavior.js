'use strict';

define([
	], function(template){
	var InputsValidationBehavior = Mn.Behavior.extend({
		ui: {
			email_error: '.signup_email_error',
			password_error: '.signup_password_error'
		},
		events: {
			
		},

	    
	});
	return InputsValidationBehavior;
});