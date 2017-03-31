'use strict';

define([
	'ejs!../../templates/order/cartPage.ejs',
	'./orderList'
	], function(template, OrderList){
	var CartPageView = Mn.View.extend({
		template: template,
		className: 'page cart_page',
		regions: {
			orderListContainer: '#order-list-region'
		},
		initialize: function(options) {
			this.basket = options.basket;
			this.sasl = options.sasl;
		},
		onRender: function() {
			var orderList = new OrderList({
				collection: this.basket
			});
			this.showChildView('orderListContainer', orderList);
		},
		serializeData: function() {
			return {
				subtotal: this.basket.getTotalPrice().toFixed(2),
				shipping: null,
				tax: null,
				tip: null,
				total: null
			};
		}
	});
	return CartPageView;
});