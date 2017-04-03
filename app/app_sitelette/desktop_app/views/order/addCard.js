'use strict';

define([
	'ejs!../../templates/order/addCard.ejs',
	], function(template){
	var AddCardView = Mn.View.extend({
		template: template,
		className: 'page add_card_page',
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
		onRender: function() {
			var card = new Skeuocard(this.$("#skeuocard"));
		},
		onNext: function() {
	    	this.trigger('onNextStep');
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return AddCardView;
});