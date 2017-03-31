'use strict';

define([
	'../../scripts/appCache',
	'../views/orderLayout',
	'../views/order/cartPage',
	'../views/order/addAddress',
	'../views/order/addCard',
	'../views/order/chooseAddress',
	'../views/order/choosePayment',
	'../views/order/orderTime',
	'../views/order/summary',
	], function(appCache, OrderLayoutView, CartPageView){
	var OrderController = Mn.Object.extend({
		initialize: function() {
			this.layout = new OrderLayoutView();
		},
		renderOrder: function(basket) {
			var cartPage = new CartPageView({
				collection:basket
			});
			this.layout.showChildView('orderContainer', cartPage);
			//TODO cart view collecton
		}
	});
	return new OrderController();
});