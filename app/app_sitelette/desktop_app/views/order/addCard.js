'use strict';

define([
	'ejs!../../templates/order/addCard.ejs',
	], function(template){
	var AddCardView = Mn.View.extend({
		template: template,
		className: 'page add_card_page',
		ui: {
			back: '.nav_back_btn',
			next: '.nav_next_btn'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'validateCard',
			'change #save_reference': 'changeCardReference'
		},
		initialize: function() {
			//Fix for AMEX card (bug in skeuocard)
	        Skeuocard.prototype.isValid = function() {
	            var names = [],
	                nameString = this._getUnderlyingValue('name'),
	                firstName = (nameString.substr(0, nameString.indexOf(' ') == -1 ? nameString.length : nameString.indexOf(' '))),
	                lastName = (nameString.substr(nameString.indexOf(' ') == -1 ? nameString.length : nameString.indexOf(' ') + 1));

	            names.push(firstName);
	            names.push(lastName);
	            return !this.el.front.hasClass('invalid')
	            && (!this.el.back.hasClass('invalid') || !this._inputViewsByFace['back'].length)
	            && ((names[0] === "" ? false : true) || !( names[0].length < 2 ));
	        };
		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
	    		cs: this.model.additionalParams.symbol
	    	});
		},
		onRender: function() {
			setTimeout(this.calcCardHeight.bind(this), 0);
			this.prefillCard();
		},
		calcCardHeight: function() {
			var height = this.$('#skeuocard .face').width() / 1.6;
			this.$('#skeuocard.js').height(height);
			this.$('#skeuocard .face').height(height);
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
	    resetCVC: function() {
	        //tweak for skeuocard
	        if (this.card.product && this.card.product.attrs.companyShortname !== 'amex') {
	            this.card.set('cvc', '');
	            this.card._updateValidationForFace('back');
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
	            this.onNext();
	        } else {
	            this.showError();
	        }
	    },

	    showError: function() {
	        var names = [],
	            nameString = this.$('.cc-name').val(),
	            firstName = (nameString.substr(0, nameString.indexOf(' ') == -1 ? nameString.length : nameString.indexOf(' '))),
	            lastName = (nameString.substr(nameString.indexOf(' ') == -1 ? nameString.length : nameString.indexOf(' ') + 1)),
	            error = this.$('.roster_order_error'),
	            front = this.$('.front'),
	            number = this.$('.cc-number'),
	            exp = this.$('.cc-exp'),
	            expMonth = this.$('.cc-exp-field-m'),
	            expYear = this.$('.cc-exp-field-y');
	            names.push(firstName);
	            names.push(lastName);
	        if (!this.card._inputViewsByFace.front.length) {
	            error.text('Please, fill card fields').slideDown();
	        } else if (front.hasClass('invalid') || names[0] === "" || names[0].length < 2 ) {
	            if (number.hasClass('invalid')) {
	                error.text('Please, enter card number').slideDown();
	            } else  if (exp.hasClass('invalid') || !expMonth.val() || !expYear.val()) {
	                error.text('Please, enter valid expiration date MM/YY').slideDown();
	            }
	            else {
	                error.text('Please, enter your first name and last name').slideDown();
	            }
	        } else {
	            error.text('Please, enter CVV').slideDown();
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
	    validateInfo: function() {
	        var delivery = this.model.get('deliverySelected'),
	            addressExists = !this.model.additionalParams.addrIsEmpty;
	        if (!addressExists && delivery) return false;
	        return true;
	    },
		onNext: function() {
			if (this.validateInfo()) {
	    		this.trigger('onNextStep');
	    	}
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return AddCardView;
});