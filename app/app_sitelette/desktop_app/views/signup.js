'use strict';

define([
	'ejs!../templates/signup.ejs',
	], function(template){
	var SignupView = Mn.View.extend({
		template: template,
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	}
	});
	return SignupView;
});