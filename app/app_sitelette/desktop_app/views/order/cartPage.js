'use strict';

define([
	'ejs!../../templates/order/cartPage.ejs',
	], function(template){
	var CartPageView = Mn.View.extend({
		template: template,
		className: 'page cart_page',
		regions: {
			orderListContainer: '#order-list-region'
		},
		initialize: function() {
		}
	});
	return CartPageView;
});