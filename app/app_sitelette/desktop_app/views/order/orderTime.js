'use strict';

define([
	'ejs!../../templates/order/orderTime.ejs',
	'./switchTabsBehavior'
	], function(template, SwitchTabsBehavior){
	var OrderTimeView = Mn.View.extend({
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page order_time_page',
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
	return OrderTimeView;
});