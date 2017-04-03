'use strict';

define([
	'ejs!../../templates/order/summary.ejs',
	], function(template){
	var SummaryView = Mn.View.extend({
		template: template,
		className: 'page summary_page',
		ui: {
			back: '.back_btn',
			next: '.place_order_btn'
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
	return SummaryView;
});