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

        // this.prefillCard();

        return this;
    },

    prefillCard: function() {
        //TODO this
        var cardData = this.model.get('creditCard');
        this.card = new Skeuocard(this.$('#skeuocard'), {
            //TODO doesn't work without number
            initialValues: {
                number: '4111111111111111',//cardData.cardNumber,
                expMonth: '' + cardData.expirationMonth,
                expYear: '' + cardData.expirationYear,
                name: cardData.firstName + ' ' + cardData.lastName,
                cvc: cardData.cvv
            },
            validationState: {
                // number: true,
                // exp: true,
                // name: true,
                // cvc: true
            },
            debug: true
        });
        // TODO try to set undefined when number was removed
        this.$('[name="cc_number"]').val(undefined).trigger('change')
    },

    onShow: function() {
        this.prefillCard();
        this.addEvents({
            'click .nav_next_btn': 'validateCard',
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

    validateCard: function() {
        var valid = this.card.isValid();
        if (valid) {
            this.setNewCardToModel();
        }
        this.triggerSummary();
    },

    setNewCardToModel: function() {
        var cardData = this.model.get('creditCard'),
            number = this.card._getUnderlyingValue('number'),
            expMonth = this.card._getUnderlyingValue('expMonth'),
            expYear = this.card._getUnderlyingValue('expYear'),
            cvc = this.card._getUnderlyingValue('cvc'),
            name = this.card._getUnderlyingValue('name'),
            names = name.split(' ');
        cardData.cardNumber = number,
        cardData.expirationMonth = expMonth,
        cardData.expirationYear = expYear,
        cardData.firstName = names[0];
        cardData.lastName = names[1];
        cardData.cvv = cvc;
        this.model.trigger('change');
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
