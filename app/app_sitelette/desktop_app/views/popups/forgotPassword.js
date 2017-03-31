'use strict';

define([
	'ejs!../../templates/popups/forgotPassword.ejs',
	], function(template){
	var ForgotPasswordView = Mn.View.extend({
		template: template,
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	}
	});
	return ForgotPasswordView;
});