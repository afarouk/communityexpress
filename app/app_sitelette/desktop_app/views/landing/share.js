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

    initialize: function() {
      this.setShareLinks();
    },

    showSMSInput: function(e) {
      e.preventDefault();
      var $target = $(e.currentTarget),
         $el = $target.parent().parent().prev();

      $el.slideToggle();
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
    },

    getLinks: function() {
      var demo = window.community.demo ? '?demo=true' : '',
          shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + demo),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
        return links;
    },

    setShareLinks: function() {
        //TODO create helper for set share urls for each landing block
        var $block = this.$el.find('.share-block'),
          links = this.getLinks(),
          $links = $block.find('a');

        $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
        });
    },

	});
	return ShareView;
});