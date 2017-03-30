'use strict';

define([
	'ejs!../templates/forgotPassword.ejs',
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