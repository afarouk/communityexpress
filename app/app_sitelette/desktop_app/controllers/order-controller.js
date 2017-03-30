'use strict';

define([
	'../../scripts/appCache',
	'../views/orderLayout',
	'../views/order/addAddress',
	'../views/order/addCard',
	'../views/order/cartPage',
	'../views/order/chooseAddress',
	'../views/order/choosePayment',
	'../views/order/orderTime',
	'../views/order/summary',
	], function(appCache, OrderLayoutView){
	var OrderController = Mn.Object.extend({
		initialize: function() {
			this.layout = new OrderLayoutView();
		}
	});
	return new OrderController();
});