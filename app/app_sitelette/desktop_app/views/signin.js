'use strict';

define([
	'ejs!../templates/signin.ejs',
	], function(template){
	var SigninView = Mn.View.extend({
		template: template,
		attributes: { title: 'Sign in' },
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	}
	});
	return SigninView;
});