'use strict';

define([
	'ejs!../../templates/popups/sendsms.ejs'
	], function(template){
	var SendsmsView = Mn.View.extend({
		template: template,
		className: 'sendsms-popup',
		attributes: { title: 'Type mobile phone number for sharing this site by sms' },
		ui: {
			send_sms: '.sms_send_button',
			sms_input: '.sms_input'
		},
		events: {
			'click @ui.send_sms': 'onSendSMS'
		},
     	onShow: function() {
     		this.$el.dialog('open');
     		$('.cmtyx_desktop_application').addClass('with-blur');
     		this.$el.prev().find('.ui-dialog-title').addClass('sendsms-title');
     		this.$el.prev().find('.ui-dialog-titlebar-close').click(function() {
				$('.cmtyx_desktop_application').removeClass('with-blur');
			});
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