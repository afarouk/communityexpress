'use strict';

define([
	'ejs!../../templates/order/choosePayment.ejs',
	'./switchTabsBehavior'
	], function(template, SwitchTabsBehavior){
	var ChoosePaymentView = Mn.View.extend({
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page choose_payment_page',
		ui: {
			back: '.back_btn',
			next: '.next_btn'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext'
		},
		initialize: function() {
		},
		onNext: function() {
	    	this.trigger('onNextStep');
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return ChoosePaymentView;
});