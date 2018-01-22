'use strict';

define([
	'ejs!../../templates/order/summary.ejs',
	'../../../scripts/actions/orderActions',
	'../../../scripts/globalHelpers',
	'../../../scripts/appCache'
	], function(template, orderActions, h, appCache){
	var SummaryView = Mn.View.extend({
		name: 'order_summary',
		template: template,
		className: 'page summary_page',
		ui: {
			back: '.nav_back_btn',
			next: '.nav_next_btn',
			order: '.place_order_btn',
			add_note_btn: '.add-note',
			add_note_text: '.note-text'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext',
			'click @ui.order': 'onNext',
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

	    getTipInfo: function() {
	        this.totalAmount = this.model.additionalParams.cachedTotalAmount;
	        this.tip = this.model.additionalParams.tip;
	        this.tipSum = this.model.additionalParams.tipSum;
	        this.$('.tip_quantity').text(this.tip + '%');
	        this.$('.tip_price_value').text(this.tipSum);
	    },

	    incrementTip: function() {
	        if (this.tip === 20) return;
	        // h().playSound('addToCart');
	        this.tip = this.tip + 5;
	        this.setTotalPriceWithTip();
	    },

	    decrementTip: function() {
	        if (this.tip === 0) return;
	        // h().playSound('removeFromCart');
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
	    	this.trigger('onNextStep');
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    },

	    onShowNote: function() {
	    	this.ui.add_note_text.slideToggle();
	    }
	});
	return SummaryView;
});