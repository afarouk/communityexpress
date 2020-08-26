'use strict';
//TODO no full ready
define([
	'ejs!../../templates/order/choosePayment.ejs',
	'./switchTabsBehavior',
	'../../../scripts/actions/orderActions',
	'../../../scripts/globalHelpers',
	'../../../scripts/appCache',
	], function(template, SwitchTabsBehavior, orderActions, h, appCache){
	var ChoosePaymentView = Mn.View.extend({
		name: 'order_payment',
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page choose_payment_page',
		ui: {
			back: '.nav_back_btn',
			next: '.nav_next_btn',
			left: '.left',
			right: '.right',
			add_note_btn: '.add-note',
			add_note_text: '.note-text',
			bottom_btns_block: '.bottom_btns_block'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext',
            'click .plus_button': 'incrementTip',
            'click .minus_button': 'decrementTip',
            'click .add-note': 'toggleAddNote',
            'change .note-text > textarea': 'onCommentChanged',
            'click .get_discount_button': 'onGetDiscount',
            'click @ui.add_note_btn': 'onShowNote'
		},
		modelEvents: {
	        'change': 'render'
	    },
		initialize: function() {
	        this.getTipInfo();
	        this.allowCash = this.model.additionalParams.allowCash;
	        this.paymentOnlineAccepted = this.model.additionalParams.paymentOnlineAccepted;
	        this.allowDelivery = this.model.additionalParams.allowDelivery;
	        this.currencySymbol = this.model.currencySymbols['USD'];
	        this.setTotalPriceWithTip();
		},
		serializeData: function() {
			var favorites = this.model.additionalParams.userModel.favorites,
            	pickupAddress = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl();
        
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
				cardNumber: this.model.get('creditCard').cardNumber,
				cs: this.model.additionalParams.symbol,
	            combinedItems: this.model.additionalParams.combinedItems,
	            taxState: this.model.additionalParams.taxState.toFixed(2),
	            subTotal: this.model.additionalParams.subTotal.toFixed(2),
	            deliveryDate: this.model.additionalParams.deliveryDate,
	            tip: this.tip,
	            tipSum: this.tipSum,
	            totalWithoutTax: this.totalWithoutTax,
	            addrIsEmpty: this.model.additionalParams.addrIsEmpty,
	            allowCash: this.allowCash,
	            paymentOnlineAccepted: this.paymentOnlineAccepted,
	            allowDelivery: this.allowDelivery,
	            pickupAddress: pickupAddress,
	            showTipOnSummaryPage: this.model.additionalParams.showTipOnSummaryPage,
	            discount: this.model.additionalParams.discountDisplay ? this.model.additionalParams.discountDisplay.toFixed(2) : 0,
	            afterDiscount: this.model.additionalParams.afterDiscount ? this.model.additionalParams.afterDiscount.toFixed(2) : null,
	            promoCode: this.model.additionalParams.promoCode,
	            minimumPurchase: this.model.additionalParams.minimumPurchase
			});
                        
		},

		onRender: function() {
			var cashOnly = this.allowCash && !this.paymentOnlineAccepted,
				cardOnly = !this.allowCash && this.paymentOnlineAccepted;
			if (cashOnly) {
	            this.$('.left')
	            	.addClass('disabled')
	            	.attr('disabled', 'disabled');
	            this.$('.right').click();
	        } else if (cardOnly) {
	            this.$('.right')
	            	.addClass('disabled')
	            	.attr('disabled', 'disabled');
	            this.$('.left').click();
	        } else if (this.model.get('cashSelected')) {
	        	this.$('.right').click();
	        } else {
	        	this.$('.left').click();
	        }
		},

		onTabShown: function() {
	    	if (this.tabActive === 'cash') {
	    		this.onCashSelected();
	    		this.ui.next.addClass('order').html('<span class="text">ORDER</span><span class="arr right-arrow"></span>');
	    		// this.ui.next.css('visibility', 'hidden');
	    		this.ui.bottom_btns_block.show();
	    	}
	    	else {
	    		this.onCreditCardSelected();
	    		// this.ui.next.css('visibility', 'visible');
	    		this.ui.next.removeClass('order').html('<span class="text">next</span><span class="arr right-arrow">&rsaquo;</span>');;
	    		this.ui.bottom_btns_block.hide();
	    	}
	    },

	    onCreditCardSelected: function() {
	    	this.model.set('creditCardSelected', true);
	    	this.model.set('cashSelected', false);
	    },
	    onCashSelected: function() {
	    	this.model.set('deliverySelected', false);
	    	this.model.set('cashSelected', true);
	    },

		getAddressFromSasl: function() {
	        var address = {
	            name: saslData.saslName,
	            street: saslData.street,
	            street2: saslData.street2,
	            number: saslData.number,
	            city: saslData.city,
	            state: saslData.state,
	            zip: saslData.zip,
	            phone: saslData.telephoneNumber
	        };
	        return address;
	    },

	    getTipInfo: function(){
	        this.totalAmount = this.model.additionalParams.cachedTotalAmount;
	        this.tip = this.model.additionalParams.tip;
	        this.tipSum = this.model.additionalParams.tipSum;  
	        this.$('.tip_quantity').text(this.tip + '%');
	        this.$('.tip_price_value').text(this.tipSum);
	    },

	    incrementTip: function() { 
	        if (this.tip === 20) return;
	        h().playSound('addToCart');
                var sum = this.tip + 5;
                this.tip = sum;
	        //this.tip = this.tip + 5;
              
	        this.setTotalPriceWithTip();
	    },

	    decrementTip: function() {
	        if (this.tip === 0) return;
	        h().playSound('removeFromCart');
	        this.tip = this.tip - 5;
	        this.setTotalPriceWithTip();
	    },

	    setTotalPriceWithTip: function() {
	        var cs = this.model.additionalParams.symbol,
	            totalAmount,
	            tax,
	            tipPortion = this.tip/100,
	            subTotal = this.model.additionalParams.subTotal,
	            minimumPurchase = this.model.additionalParams.minimumPurchase;

	        var discountType = this.model.additionalParams.discountType;
	        totalAmount = parseFloat(subTotal);
	        this.totalWithoutTax = totalAmount;
	        if (totalAmount < minimumPurchase) {
	            this.model.additionalParams.discountDisplay = 0;
	            this.$('.minimum_purchase_error').addClass('visible');
	        } else {
	            this.$('.minimum_purchase_error').removeClass('visible');
	            switch (discountType) {
	                case 'PERCENT':
	                    var maximumDiscount = this.model.additionalParams.maximumDiscount,
	                        percent = this.model.additionalParams.discount,
	                        discount;

	                    this.$('.minimum_purchase_error').removeClass('visible');
	                    discount = parseFloat(percent * totalAmount / 100);
	                    if (maximumDiscount) {
	                        discount = discount <= maximumDiscount ? discount : maximumDiscount;
	                    }
	                    this.model.additionalParams.discountDisplay = discount;
	                    totalAmount = parseFloat((100 - percent) * totalAmount / 100);
	                    break;
	                case 'AMOUNT':
	                    this.model.additionalParams.discountDisplay = this.model.additionalParams.discount;
	                    totalAmount = parseFloat((totalAmount - this.model.additionalParams.discount).toFixed(2));
	                    break;
	                default:
	            }
	            if (this.model.additionalParams.discountDisplay) {
	            	this.model.additionalParams.afterDiscount = this.model.additionalParams.subTotal - this.model.additionalParams.discountDisplay;
	            }
	        }
	        if (totalAmount < 0) {
	            totalAmount = 0
	        }
	        totalAmount = this.model.getTotalPriceWithTaxAfterAll(totalAmount);
	        this.tipSum = parseFloat((totalAmount * tipPortion).toFixed(2));
	        totalAmount = parseFloat((totalAmount + this.tipSum).toFixed(2));
	        this.$('.tip_quantity').text(this.tip + '%');
	        this.$('.tip_price_value').text(cs + this.tipSum.toFixed(2));
        	this.$('.total_amount').text(cs + totalAmount.toFixed(2));
	        this.model.additionalParams.tipSum = this.tipSum;
	        this.model.additionalParams.tip = this.tip;
                
                this.model.set({'tipAmount':this.tipSum}, {silent:true});
                
	        this.model.set({'totalAmount': totalAmount.toFixed(2)}, {silent:true});
                
	        this.model.trigger('change');
	    },

	    toggleAddNote: function() {
	        this.$('.note-text').toggle('slow');
	    },
	    onCommentChanged: function(e) {
	        var target = $(e.currentTarget),
	            comment = target.val();
	        this.model.set({comment: comment}, {silent: true});
	    },

	    onDiscountUpdate: function(promoCode) {
        	this.$('input[name=promocode]').val(promoCode);
        	this.$('input[name=promocode]').attr('disabled', true);
        	this.setTotalPriceWithTip();
	    },

	    onGetDiscount: function() {
	    	var promoCode = this.$('input[name=promocode]').val();
	    	this.dispatcher.get('order')
	    		.validatePromoCode(this.model, promoCode)
	    		.then(this.setTotalPriceWithTip.bind(this),
    			function(){
    				this.$('input[name=promocode]').val('');
    			}.bind(this));
	    },

		onNext: function() {
			var checked = this.$('[name="radio-choice-card"]:checked'),
	    		card = checked.data('card');

	    	if (this.tabActive === 'cash') {
	    		this.model.set('cashSelected', true);
        		this.model.set('creditCardSelected', false);
			} else {
				this.model.set('cashSelected', false);
        		this.model.set('creditCardSelected', true);
			}
			if (this.model.get('paymentProcessor') === 'VANTIV_HID') {
	    		this.trigger('onNextStep', 'saved', this.tabActive);
	    	} else {
	    		this.trigger('onNextStep', card, this.tabActive);
	    	}
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    },

	    onShowNote: function() {
	    	this.ui.add_note_text.slideToggle();
	    }
	});
	return ChoosePaymentView;
});