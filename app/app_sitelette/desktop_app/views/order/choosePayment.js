'use strict';
//TODO no full ready
define([
	'ejs!../../templates/order/choosePayment.ejs',
	'./switchTabsBehavior',
	'../../../scripts/actions/orderActions',
	'../../../scripts/globalHelpers',
	'../../../scripts/appCache',
	'../../controllers/_dispatcher'
	], function(template, SwitchTabsBehavior, orderActions, h, appCache, dispatcher){
	var ChoosePaymentView = Mn.View.extend({
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page choose_payment_page',
		ui: {
			back: '.nav_back_btn',
			next: '.nav_next_btn',
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
		initialize: function() {
			this.getTipInfo();
	        this.allowCash = this.model.additionalParams.allowCash;
	        this.paymentOnlineAccepted = this.model.additionalParams.paymentOnlineAccepted;
	        this.allowDelivery = this.model.additionalParams.allowDelivery;
	        this.currencySymbol = this.model.currencySymbols['USD'];

	        var promoCode = appCache.get('promoCode');
	        if (promoCode) {
	        	this.model.additionalParams.promoCode = promoCode;
	        }
	        this.onGetDiscount(); //temporary
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
	            // showTipOnSummaryPage: this.model.additionalParams.showTipOnSummaryPage,
	            showTipOnSummaryPage: true,
	            discount: this.model.additionalParams.discountDisplay ? this.model.additionalParams.discountDisplay.toFixed(2) : 0,
	            promoCode: this.model.additionalParams.promoCode,
	            minimumPurchase: this.model.additionalParams.minimumPurchase,
			});
		},

		onRender: function() {
			var cashOnly = this.allowCash && !this.allowDelivery ,
				deliveryOnly = !this.allowCash && this.allowDelivery;
			if (cashOnly) {
	            // this.$('.left').addClass('disabled');
	            // this.$('.left').css('pointer-events', 'none');
	            this.$('.right').click();
	        } else if (deliveryOnly) {
	            // this.$('.right').addClass('disabled');
	            // this.$('.right').css('pointer-events', 'none');
	            this.$('.left').click();
	        } else {
	        	this.$('.left').click();
	        }
		},

		onTabShown: function() {
	    	if (this.tabActive === 'cash') {
	    		this.$el.find('.navigation_block .nav_next_btn').css('visibility', 'hidden');
	    		this.ui.bottom_btns_block.show();
	    	}
	    	else {
	    		this.ui.next.css('visibility', 'visible');
	    		this.ui.bottom_btns_block.hide();
	    	}
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
	        h().playSound('addToCart');
	        this.tip = this.tip + 5;
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
	            this.$('.discount_value').text(cs + this.model.additionalParams.discountDisplay.toFixed(2));
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

	    onDiscountUpdate: function() {
	    	if (this.model.additionalParams.promoCodeActive) return;
	    	var promoCode = appCache.get('promoCode');
	        if (promoCode) {
	        	this.model.additionalParams.promoCode = promoCode;
	        	this.$('input[name=promocode]').val(promoCode);
	        	this.$('input[name=promocode]').attr('disabled', true);
	        	this.onGetDiscount();
	        }
	    },

	    onGetDiscount: function() {
	        if (this.model.additionalParams.promoCodeActive) return;
	        var params = this.model.additionalParams,
	            promoCode;
	        if (!params.promoCodeActive && params.promoCode) {
	            promoCode = params.promoCode;
	        } else {
	            promoCode = this.$('input[name=promocode]').val();
	        }
	        this.model.additionalParams.promoCode = promoCode;
	        if (!promoCode) return;
	        orderActions.validatePromoCode(params.sasl.sa(), params.sasl.sl(), promoCode)
	            .then(_.bind(function(resp) {
	                this.currencySymbol = this.model.currencySymbols[resp.currencyCode];
	                this.model.additionalParams.discount = resp.discount;
	                this.model.additionalParams.discountType = resp.discountType;
	                this.model.additionalParams.maximumDiscount = resp.maximumDiscount;
	                this.model.additionalParams.minimumPurchase = resp.minimumPurchase || 0;
	                this.model.additionalParams.promoCodeActive = true;
	                this.model.set({'promoCode': promoCode}, {silent: true});
	                this.setTotalPriceWithTip();
	            }, this), function(jqXHR) {
	                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
	                this.model.additionalParams.promoCode = null;
	                dispatcher.getPopupsController().showMessage({
	                	message: text,
						confirm: 'ok'
	                });
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
	    	this.trigger('onNextStep', card, this.tabActive);
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