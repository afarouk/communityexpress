'use strict';

define([
	'ejs!../templates/signout.ejs',
	], function(template){
	var SignoutView = Mn.View.extend({
		template: template,
		initialize: function() {
			
		},
     	onShow: function () {
     		this.$el.dialog('open');
     	}
	});
	return SignoutView;
});