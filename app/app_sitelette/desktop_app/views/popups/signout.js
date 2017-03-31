'use strict';

define([
	'ejs!../../templates/popups/signout.ejs',
	], function(template){
	var SignoutView = Mn.View.extend({
		template: template,
		className: 'signout-popup',
		ui: {
			submit_signout_btn: '.submit_signout_btn',
			cancel_btn: '.cancel_btn'
		},
		events: {
			'click @ui.submit_signout_btn': 'onSignout',
			'click @ui.cancel_btn': 'onClose'
		},
		initialize: function() {
			
		},
     	onShow: function() {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	},
     	onSignout: function() {
     		this.trigger('user:submitLogout');
     		this.onClose();
     	}
	});
	return SignoutView;
});