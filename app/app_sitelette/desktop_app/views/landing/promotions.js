'use strict';

define([
	], function(){
	var PromotionsView = Mn.View.extend({
          el: '#cmtyx_promotion_block',
		ui: {
			
		},
		events: {
			
		},
          onBuy: function(e) {
               var $target = $(e.currentTarget),
                    uuid = $target.data('uuid');
               
               this.$el.addClass('used');
          }
	});
	return PromotionsView;
});