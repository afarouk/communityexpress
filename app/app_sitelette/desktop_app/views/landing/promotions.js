'use strict';

define([
	], function(){
	var PromotionsView = Mn.View.extend({
          el: '#cmtyx_promotion_block',
		ui: {
			promo: '.promoCode_image img',
               show_share_btn: '.share_btn_block',
               show_sms_block: '.sms_block'
		},
		events: {
			'click @ui.promo': 'onBuy',
               'click @ui.show_share_btn': 'showShareBlock',
               'click @ui.show_sms_block': 'showSMSInput'
		},
          onBuy: function(e) {
               var $target = $(e.currentTarget),
                    uuid = $target.data('uuid'),
                    promoPrice = parseFloat($target.data('price'));

               this.trigger('onPromotion', {
                    uuid: uuid,
                    promoPrice: promoPrice
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
          }
	});
	return PromotionsView;
});