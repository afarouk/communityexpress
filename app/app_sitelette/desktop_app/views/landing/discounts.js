'use strict';

define([
	], function(){
	var DiscountsView = Mn.View.extend({
          el: '#cmtyx_promocodes_block',
		ui: {
			buy: '.promoCode-buybutton',
               show_share_btn: '.share_btn_block',
               show_sms_block: '.sms_block'

		},
		events: {
			'click @ui.buy': 'onBuy',
               'click @ui.show_share_btn': 'showShareBlock',
               'click @ui.show_sms_block': 'showSMSInput'
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
          }
	});
	return DiscountsView;
});