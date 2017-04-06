'use strict';

define([
	], function(){
	var DiscountsView = Mn.View.extend({
          el: '#cmtyx_promocodes_block',
		ui: {
			buy: '.promoCode-buybutton'
		},
		events: {
			'click @ui.buy': 'onBuy'
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
          }
	});
	return DiscountsView;
});