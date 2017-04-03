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
		serializeData: function() {
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
				cardNumber: this.model.get('creditCard').cardNumber
			});
		},
		onNext: function() {
			var checked = this.$('[name="radio-choice-card"]:checked'),
	    		card = checked.data('address');

	    	if (this.tabActive === 'cash') {
	    		this.model.set('cashSelected', true);
        		this.model.set('creditCardSelected', false);
			} else {
				this.model.set('cashSelected', false);
        		this.model.set('creditCardSelected', true);
			}
	    	this.trigger('onNextStep', card, this.tabActive);
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return ChoosePaymentView;
});