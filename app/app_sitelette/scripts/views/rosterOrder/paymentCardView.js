'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/paymentCard.ejs');

var PaymentCardView = Backbone.View.extend({

	name: 'payment_card',

    id: 'cmtyx_payment_card',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));

        this.prefillCard();

        return this;
    },

    prefillCard: function() {
        //TODO this
        var cardData = this.model.get('creditCard'); 
        this.card = new Skeuocard(this.$('#skeuocard'), {
            initialValues: {
                number: '',//cardData.cardNumber,
                expMonth: '' + cardData.expirationMonth,
                expYear: '' + cardData.expirationYear,
                name: cardData.firstName + ' ' + cardData.lastName,
                cvc: cardData.cvv
            }
        });
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerSummary',
            'click .nav_back_btn': 'goBack'
        });
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol
    	});
    },

    triggerSummary: function() {
        Vent.trigger('viewChange', 'summary', {
            model: this.model,
            backTo: 'payment_card'
        });
    },

    goBack : function() {
        Vent.trigger('viewChange', 'payment', this.model);
    }
});

module.exports = PaymentCardView;
