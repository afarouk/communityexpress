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

        return this;
    },

    prefillCard: function() {
        var cardData = this.model.get('creditCard');
        // if (this.model.additionalParams.cardExists) {
        //     this.card = new Skeuocard(this.$('#skeuocard'), {
        //         initialValues: {
        //             number: cardData.cardNumber,
        //             expMonth: '' + cardData.expirationMonth,
        //             expYear: '' + cardData.expirationYear,
        //             name: cardData.firstName + ' ' + cardData.lastName,
        //             cvc: cardData.cvv
        //         },
        //         validationState: {
        //             number: true,
        //             exp: true,
        //             name: true,
        //             cvc: true
        //         }
        //     });
        // } else {
            this.card = new Skeuocard(this.$('#skeuocard'), {
                validationState: {
                    number: true,
                    exp: true,
                    name: true,
                    cvc: true
                }
            });
        // }
    },

    onShow: function() {
        this.prefillCard();
        this.addEvents({
            'click .nav_next_btn': 'validateCard',
            'click .nav_back_btn': 'goBack',
            'change #save_reference': 'changeCardReference'
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
        //valid
        // Visa: 4556 8270 2101 3160
        // American Express: 3708 338922 79668
        if (valid) {
            this.setNewCardToModel();
            this.triggerSummary();
        } else {
            //TODO error
        }
    },

    changeCardReference: function(e) {
        var ref = $(e.currentTarget),
            checked = ref.is(':checked');

        this.model.set('saveCreditCardForFutureReference', checked);
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
        if (this.validateInfo()) {
            Vent.trigger('viewChange', 'summary', {
                model: this.model,
                backTo: 'payment_card'
            });
        } else {
            debugger;
            //TODO some error
        }
    },

    validateInfo: function() {
        var delivery = this.model.get('deliverySelected'),
            addressExists = !this.model.additionalParams.addrIsEmpty;
        if (!addressExists && delivery) return false;
        return true;
    },

    goBack : function() {
        Vent.trigger('viewChange', 'payment', this.model);
    }
});

module.exports = PaymentCardView;