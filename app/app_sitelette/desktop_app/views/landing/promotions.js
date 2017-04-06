'use strict';

define([
	], function(){
	var PromotionsView = Mn.View.extend({
          el: '#cmtyx_promotion_block',
		ui: {
			promo: '.promoCode_image img'
		},
		events: {
			'click @ui.promo': 'onBuy'
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
          }
	});
	return PromotionsView;
});