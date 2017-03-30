'use strict';

define([
	'ejs!../../templates/order/choosePayment.ejs',
	], function(template){
	var ChoosePaymentView = Mn.View.extend({
		template: template,
		className: 'page choose_payment_page',
		initialize: function() {
		}
	});
	return ChoosePaymentView;
});