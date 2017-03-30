'use strict';

define([
	'ejs!../../templates/order/orderTime.ejs',
	], function(template){
	var OrderTimeView = Mn.View.extend({
		template: template,
		className: 'page order_time_page',
		initialize: function() {
		}
	});
	return OrderTimeView;
});