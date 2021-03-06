'use strict';

define([
	'ejs!../../templates/order/cartPage.ejs',
	'ejs!../../templates/order/cartIsEmpty.ejs',
	'./orderList'
	], function(cartTemplate, emptyTemplate, OrderList){
	var CartPageView = Mn.View.extend({
		name: 'shopping_cart',
		className: 'page cart_page',
		regions: {
			orderListContainer: '#order-list-region'
		},
		ui: {
			order: '[name="order"]',
			item_added: '[name="item-added"]'
		},
		triggers: {
			'click @ui.order': 'order:proceed'
		},
		initialize: function(options, changed) {
			options.basket = options.basket || [];
			this.changed = changed;
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
					total: null,
					changed: this.changed
				};
			}
		}
	});
	return CartPageView;
});