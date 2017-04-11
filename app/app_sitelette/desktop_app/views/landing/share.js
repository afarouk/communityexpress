'use strict';

define([
	], function(){
	var ShareView = Mn.View.extend({
    el: '#cmtyx_share_block',
		ui: {
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button', 
      share_email: '[name="share_email"]',
      share_facebook: '[name="share_facebook"]',
      share_twitter: '[name="share_twitter"]'
		},
		events: {
      'click @ui.show_sms_block': 'showSMSInput',
      'click @ui.send_sms': 'onSendSMS'
		},

    showSMSInput: function(e) {
      e.preventDefault();
      var $target = $(e.currentTarget),
         $el = $target.parent().parent().prev();

      $el.slideToggle();
    },

    onSendSMS: function(e) {
    }

	});
	return ShareView;
});