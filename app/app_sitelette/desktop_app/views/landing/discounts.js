'use strict';

define([
	], function(){
	var DiscountsView = Mn.View.extend({
    el: '#cmtyx_promocodes_block',
		ui: {
			buy: '.promoCode-buybutton',
      show_share_btn: '.share_btn_block',
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button', 
      share_email: '[name="share_email"]',
      share_facebook: '[name="share_facebook"]',
      share_twitter: '[name="share_twitter"]'
		},
		events: {
			'click @ui.buy': 'onBuy',
      'click @ui.show_share_btn': 'showShareBlock',
      'click @ui.show_sms_block': 'showSMSInput',
      'click @ui.send_sms': 'onSendSMS'
		},
    initialize: function() {
         this.setLinksForEachDiscount();
    },
    onBuy: function(e) {
      var $target = $(e.currentTarget),
          uuid = $target.data('uuid'),
          promoCode = $target.data('promocode');
      this.trigger('onDiscount', {
          uuid: uuid,
          promoCode: promoCode
      });
      this.$el.addClass('used');
    },
    showShareBlock: function(e) {
      var $target = $(e.currentTarget),
         $el = $target.parent().next();

      $el.slideToggle();
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
         uuid = $target.parent().parent().data('uuid'),
         demo = window.community.demo ? 'demo=true&' : '',
         shareUrl = window.location.href.split('?')[0] +
           '?' + demo + 't=e&u=' + uuid,
         val = $target.prev().val();
      //todo toggle block 
      this.trigger('onSendSMS', 'DISCOUNT', val, uuid, shareUrl);
    },

    getLinks: function(uuid) {
      var demo = window.community.demo ? 'demo=true&' : '',
            shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] +
            '?' + demo + 't=d&u=' + uuid),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
      return links;
    },

    setShareLinks: function($discount) {
      var $block = $discount.find('.promoCode-share-block'),
          uuid = $block.data('uuid'),
          links = this.getLinks(uuid),
          $links = $block.find('a');

      $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
      });
      },

    setLinksForEachDiscount: function() {
      var $discounts = this.$el.find('.promoCode_item');
      $discounts.each(function(index, el){
        var $discount = $(el);
        this.setShareLinks($discount);
      }.bind(this));
    }

	});
	return DiscountsView;
});