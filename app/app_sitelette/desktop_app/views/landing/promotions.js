'use strict';

define([
	], function(){
	var PromotionsView = Mn.View.extend({
    el: '#cmtyx_promotion_block',
		ui: {
      buy: '.promotions-buybutton',
      show_share_btn: '.share_btn_block',
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button'
		},
		events: {
      'click @ui.buy': 'onBuy',
      'click @ui.show_share_btn': 'showShareBlock',
      'click @ui.show_sms_block': 'showSMSInput',
      'click @ui.send_sms': 'onSendSMS'
		},
    initialize: function() {
         this.setLinksForEachPromotion();
         this.initGallery();
    },
    initGallery: function() {
      this.$('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]
      });
    },
    onBuy: function(e) {
      var $target = $(e.currentTarget),
          uuid = $target.data('uuid'),
          promoPrice = parseFloat($target.data('price'));
          
      this.trigger('onPromotion', {
          uuid: uuid,
          promoPrice: promoPrice
      });
    },
    onPromotionSelected: function() {
      this.$el.addClass('used');
    },
    onPromotionUnselected: function() {
      this.$el.removeClass('used');
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
      this.trigger('onSendSMS', 'PROMOTION', val, uuid, shareUrl);
    },

    getLinks: function(uuid) {
      var demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + '?' + demo + 't=p&u=' + uuid),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
      return links;
    },

    setShareLinks: function($promotion) {
      var $block = $promotion.find('.promotion-share-block'),
          uuid = $block.data('uuid'),
          links = this.getLinks(uuid),
          $links = $block.find('a');

      $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
      });
    },

    setLinksForEachPromotion: function() {
      var $promotions = this.$el.find('.promotions-item');
      $promotions.each(function(index, el){
        var $promotion = $(el);
        this.setShareLinks($promotion);
      }.bind(this));
    }
	});
	return PromotionsView;
});