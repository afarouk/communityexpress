'use strict';

define([
	'ejs!../../templates/popups/signout.ejs',
	'ejs!../../templates/popups/signoutOnOrder.ejs',
	], function(signoutTemplate, onOrderTemplate){
	var SignoutView = Mn.View.extend({
		className: 'signout-popup',
		ui: {
			submit_signout_btn: '.submit_signout_btn',
			cancel_btn: '.cancel_btn'
		},
		events: {
			'click @ui.submit_signout_btn': 'onSignout',
			'click @ui.cancel_btn': 'onClose'
		},
		initialize: function(options) {
			this.template = options.order ? onOrderTemplate : signoutTemplate;
		},
     	onShow: function() {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	},
     	onSignout: function() {
     		this.onClose();
     		this.trigger('user:submitLogout');
     	}
	});
	return SignoutView;
});