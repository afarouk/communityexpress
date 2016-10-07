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

        //Fix for AMEX card (bug in skeuocard)
        Skeuocard.prototype.isValid = function() {
            var names = this._getUnderlyingValue('name').split(' ');
            return !this.el.front.hasClass('invalid')
            && (!this.el.back.hasClass('invalid') || !this._inputViewsByFace['back'].length)
            && ((names.length < 2 ? false : true) || !(!names[0] || !names[1]));
        };
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));

        return this;
    },

    prefillCard: function() {
        if (this.card) return;
        var cardData = this.model.get('creditCard');
        this.card = new Skeuocard(this.$('#skeuocard'), {
            validationState: {
                number: true,
                exp: true,
                name: true,
                cvc: true
              }
        });

        //tweak for skeuocard
        this.$('#skeuocard')
            .on('fieldValidationStateDidChange.skeuocard', function(evt, card, validationState){
            if (validationState === 'number') {
                this.resetCVC();
            }
        }.bind(this));
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

    resetCVC: function() {
        //tweak for skeuocard
        if (this.card.product && this.card.product.attrs.companyShortname !== 'amex') {
            this.card.flip();
            this.$el.find('.cc-cvc').val('').trigger('keyup')
                .trigger('valueChanged', this.card._inputViews.cvc);
                this.card._state.cvcFilled = false;
                this.card._state.cvcValid = false;
            this.card.flip();
        } else {

        }
    },

    validateCard: function() {
        var valid = this.card.isValid();
        //valid
        // Visa: 4556 8270 2101 3160
        // American Express: 3466 255570 30027
        if (valid) {
            this.$('.roster_order_error').slideUp();
            this.setNewCardToModel();
            // this.resetCVC();
            this.triggerSummary();
        } else {
            this.showError();
        }
    },

    showError: function() {
        var names = this.$('.cc-name').val().split(' '),
            error = this.$('.roster_order_error'),
            front = this.$('.front'),
            number = this.$('.cc-number'),
            exp = this.$('.cc-exp'),
            expMonth = this.$('.cc-exp-field-m'),
            expYear = this.$('.cc-exp-field-y');

        if (!this.card._inputViewsByFace.front.length) {
            error.text('Please, fill card fields').slideDown();
        } else if (front.hasClass('invalid') || (names.length < 2 || (!names[0] || !names[1]))) {
            if (number.hasClass('invalid')) {
                error.text('Please, enter card number').slideDown();
            } else  if (exp.hasClass('invalid') || !expMonth.val() || !expYear.val()) {
                error.text('Please, enter valid month and year').slideDown();
            }
            else {
                error.text('Please, enter your first name and last name').slideDown();
            }
        } else {
            error.text('Please, enter cvc').slideDown();
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
