'use strict';

define([
	'ejs!../../templates/order/cartPage.ejs',
	'ejs!../../templates/order/cartIsEmpty.ejs',
	'./orderList'
	], function(cartTemplate, emptyTemplate, OrderList){
	var CartPageView = Mn.View.extend({
		className: 'page cart_page',
		regions: {
			orderListContainer: '#order-list-region'
		},
		ui: {
			order: '[name="order"]'
		},
		triggers: {
			'click @ui.order': 'order:proceed'
		},
		initialize: function(options) {
			options.basket = options.basket || [];
			this.basket = options.basket;
			this.sasl = options.sasl;
			this.chooseTemplate();
		},
		chooseTemplate: function() {
			if (this.basket.length > 0) {
				this.template = cartTemplate;
			} else {
				this.template = emptyTemplate;
			}
		},
		onRender: function() {
			if (this.basket.length > 0) {
				var orderList = new OrderList({
					collection: this.basket
				});
				this.showChildView('orderListContainer', orderList);
			}
		},
		serializeData: function() {
			if (this.basket.length > 0) {
				return {
					subtotal: this.basket.getTotalPrice().toFixed(2),
					shipping: null,
					tax: null,
					tip: null,
					total: null
				};
			}
		}
	});
	return CartPageView;
});