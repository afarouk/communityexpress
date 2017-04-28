'use strict';

define([
	'ejs!../../templates/popups/sendsms.ejs'
	], function(template){
	var SendsmsView = Mn.View.extend({
		template: template,
		className: 'sendsms-popup',
		ui: {
			send_sms: '.sms_send_button',
			sms_input: '.sms_input'
		},
		events: {
			'click @ui.send_sms': 'onSendSMS'
		},
     	onShow: function() {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	},
     	onSendSMS: function(e) {
	      var $el = this.$el.find('.sms_input_block'),
	         $target = $(e.currentTarget),
	         demo = window.community.demo ? 'demo=true&' : '',
	         shareUrl = window.location.href.split('?')[0] +
	          '?' + demo,
	         val = $target.prev().val();
	      //todo toggle block 
	      this.trigger('onSendSMS', 'SITELETTE', val, null, shareUrl);
	    }
	});
	return SendsmsView;
});