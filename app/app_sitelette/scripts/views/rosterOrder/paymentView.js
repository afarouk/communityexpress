'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache.js'),
    template = require('ejs!../../templates/rosterOrder/payment.ejs');

var PaymentView = Backbone.View.extend({

	name: 'payment',

    id: 'cmtyx_payment',

    radio: '.ui-radio',

    active: '.ui-navbar .ui-btn-active',

	initialize: function(options) {
		this.options = options || {};
        this.getTipInfo();
        this.allowCash = this.model.additionalParams.allowCash;
        this.paymentOnlineAccepted = this.model.additionalParams.paymentOnlineAccepted;
        this.allowDelivery = this.model.additionalParams.allowDelivery;
        this.currencySymbol = this.model.currencySymbols['USD'];
        this.onGetDiscount();
        this.on('show', this.onShow, this);
        this.model.on('change', _.bind(this.reRender, this));
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.createCircles();
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    createCircles: function(){
        var index = this.options.circles === 3 ? 2 : 3;
        h().createCircles(this.$el.find('.circles_block'), this.options.circles, index);
    },

    reRender: function() {
        var number = this.model.get('creditCard').cardNumber,
            $label = this.$('#credit label[for="saved_card"]'),
            $cash = this.$('#cash'),
            html = $.parseHTML(template(this.renderData())),
            tpl = $(html).find('#cash').html();
        console.log(this.renderData());
        if (number) {
            $label.removeClass('hidden');
            $label.siblings().first().removeClass('hidden').click();
            $label.html('XXXXXXXXXXXXXX' + number.substring(number.length-2,number.length));
        }
        $cash.html(tpl);
        this.checkCashCreditSelection();
    },

    onShow: function() {
        this.checkCashCreditSelection();
        this.getTipInfo();
        this.setTotalPriceWithTip();
        this.addEvents({
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack',
            'click .rightBtn': 'onCashSelected',
            'click .leftBtn': 'onCreditSelected',
            'click .plus_button': 'incrementTip',
            'click .minus_button': 'decrementTip',
            'click .get_discount_button': 'onGetDiscount'
        });

        if (!this.paymentOnlineAccepted && this.allowCash && !this.cashSelected) {
            this.onCashSelected();
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
                this.model.additionalParams.minimumPurchase = resp.minimumPurchase;
                this.model.additionalParams.promoCodeActive = true;
                this.setTotalPriceWithTip();
            }, this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
                popupController.textPopup({
                    text: text
                });
            });
    },

    getTipInfo: function() {
        this.totalAmount = this.model.additionalParams.cachedTotalAmount;
        this.tip = this.model.additionalParams.tip;
        this.tipSum = this.model.additionalParams.tipSum;
        this.$('.tip_quantity').text(this.tip + '%');
        this.$('.tip_price_value').text(this.tipSum);
    },

    renderContent: function(options) {
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol,
            combinedItems: this.model.additionalParams.combinedItems,
            taxState: this.model.additionalParams.taxState.toFixed(2),
            subTotal: this.model.additionalParams.subTotal.toFixed(2),
            cardNumber: this.model.get('creditCard').cardNumber,
            tip: this.tip,
            tipSum: this.tipSum,
            totalWithoutTax: this.totalWithoutTax,
            addrIsEmpty: this.model.additionalParams.addrIsEmpty,
            allowCash: this.allowCash,
            paymentOnlineAccepted: this.paymentOnlineAccepted,
            allowDelivery: this.allowDelivery,
            discount: this.model.additionalParams.discountDisplay.toFixed(2),
            promoCode: this.model.additionalParams.promoCode,
            minimumPurchase: this.model.additionalParams.minimumPurchase,
            backToSingleton: this.model.additionalParams.backToSingleton
    	});
    },

    triggerNext: function() {
        var checked = this.$(this.radio).find(':checked');
        if (this.cashSelected) {
            this.onPlaceOrder();
        } else if (checked.attr('id') === 'use_another') {
            this.triggerPaymentCard();
        } else {
            this.triggerSummary();
        }
    },

    onCashSelected: function() {
        this.$('.rightBtn').addClass('cmtyx_color_1');
        this.$('.rightBtn').removeClass('cmtyx_text_color_1');
        this.$('.leftBtn').removeClass('cmtyx_color_1');
        this.$('.leftBtn').addClass('cmtyx_text_color_1');
        this.cashSelected = true;
        this.model.set('cashSelected', true);
        this.model.set('creditCardSelected', false);
        this.checkCashCreditSelection();
    },

    onCreditSelected: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_text_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.$('.rightBtn').addClass('cmtyx_text_color_1');
        this.cashSelected = false;
        this.model.set('cashSelected', false);
        this.model.set('creditCardSelected', true);
        this.checkCashCreditSelection();
    },

    checkCashCreditSelection: function() {
        this.cashSelected ?
        this.$('.next_btn').text('Place order') :
        this.$('.next_btn').text('Next');
    },

    triggerSummary: function() {
        if (this.validateInfo()) {
            Vent.trigger('viewChange', 'summary', {
                model: this.model,
                circles: this.options.circles,
                backTo: 'payment'
            });
        } else {
            debugger;
            //TODO some error
            //We should decide how to display
            //errors when some field is empty.
        }
    },

    validateInfo: function() {
        var delivery = this.model.get('deliverySelected'),
            credit = this.model.get('creditCardSelected'),
            number = this.model.get('creditCard').cardNumber,
            addressExists = !this.model.additionalParams.addrIsEmpty;
        if (!number && credit) return false;
        if (!addressExists && delivery) return false;
        return true;
    },

    triggerPaymentCard: function() {
        Vent.trigger('viewChange', 'payment_card', {
            circles: this.options.circles,
            model: this.model
        });
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

        this.tipSum = parseFloat((subTotal * tipPortion).toFixed(2));
        totalAmount = parseFloat((subTotal + this.tipSum).toFixed(2));
        this.$('.tip_quantity').text(this.tip + '%');
        this.$('.tip_price_value').text(this.tipSum.toFixed(2));
        this.model.additionalParams.tipSum = this.tipSum;
        this.model.additionalParams.tip = this.tip;
        var discountType = this.model.additionalParams.discountType;
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
                    discount = discount <= maximumDiscount ? discount : maximumDiscount;
                    this.model.additionalParams.discountDisplay = discount;
                    totalAmount = parseFloat((100 - percent) * totalAmount / 100);
                    break;
                case 'AMOUNT':
                    this.model.additionalParams.discountDisplay = this.model.additionalParams.discount;
                    totalAmount = parseFloat((totalAmount - this.model.additionalParams.discount).toFixed(2));
                    break;
                default:
            }
        }
        if (totalAmount < 0) {
            totalAmount = 0
        }
        totalAmount = this.model.getTotalPriceWithTaxAfterAll(totalAmount);
        this.model.set({'totalAmount': totalAmount.toFixed(2)}, {silent:true});
        this.model.trigger('change');
    },

    onPlaceOrder: function() {
        this.model.additionalParams.backToSingleton ?
        this.onPlaceSingletonOrder() :
        this.onPlaceMultipleOrder();
    },

    onPlaceSingletonOrder: function() {
        var params = this.model.additionalParams,
            items = this.model.get('items'),
            request;

        if (!items) {
            popupController.textPopup({
                text: 'Can\'t place order.'
            });
            return;
        }
        
        loader.show('placing your order');
        this.model.set({
            itemUUID: this.model.additionalParams.itemUUID,
            quantity: items[0].quantity,
            tipAmount: this.tipSum
        });
        this.model.unset('items');
        request = params.type === 'PROMO'? orderActions.placePromoSingletonOrder :
            orderActions.placeEventSingletonOrder
        return request(
            params.sasl.sa(),
            params.sasl.sl(),
            this.model.toJSON()
        ).then(function() {
            loader.hide();
            appCache.set('promoCode', null);
            appCache.set('updateDiscount', true);
            var callback = _.bind(this.triggerSingletonView, this);
            popupController.textPopup({
                text: 'order successful'
            }, callback);
        }.bind(this), function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'Error placing your order');
            popupController.textPopup({
                text: text
            });
        });
    },

    onPlaceMultipleOrder: function() {
        var params = this.model.additionalParams;
        loader.show('placing your order');

        this.model.set({
            tipAmount: this.tipSum
        });

        return orderActions.placeOrder(
            params.sasl.sa(),
            params.sasl.sl(),
            this.model.toJSON()
        ).then(function(e) {
            loader.hide();
            params.basket.reset();
            params.basket.versions = undefined;
            params.backToRoster = false;
            appCache.set('promoCode', null);
            appCache.set('updateDiscount', true);
            var callback;
            if (params.backToCatalog) {
                callback = _.bind(this.triggerCatalogView, this)
            } else {
                callback = _.bind(this.triggerRosterView, this);
            }
            popupController.textPopup({
                text: 'order successful'
            }, callback);
        }.bind(this), function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'Error placing your order');
            popupController.textPopup({
                text: text
            });
        }.bind(this));
    },

    triggerSingletonView: function() {
        var params = this.model.additionalParams;
        Vent.trigger('viewChange', 'singleton', {
            uuid: params.itemUUID,
            backToRoster: false,
            backToCatalogs: false,
            backToCatalog: false,
            backToSingleton: true
        }, { reverse: false });
    },

    triggerCatalogView: function() {
        var params = this.model.additionalParams;
        Vent.trigger('viewChange', 'catalog', {
            sasl: params.sasl.id,
            id: params.catalogId,
            backToCatalog: params.backToCatalog === false ? false : true,
            catalogId: params.catalogId,
            launchedViaURL: params.launchedViaURL
        }, {
            reverse: false
        });
    },

    triggerRosterView: function() {
        var params = this.model.additionalParams;
        Vent.trigger('viewChange', 'roster', {
            sasl: params.sasl.id,
            id: params.rosterId,
            backToRoster: params.backToRoster === false ? false : true,
            rosterId: params.rosterId,
            launchedViaURL: params.launchedViaURL,
        }, {
            reverse: false
        });
    },

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo , {
            model: this.model,
            circles: this.options.circles,
            deliveryPickupOptions: this.options.deliveryPickupOptions,
            futureOrRegular: this.options.futureOrRegular
        });
    }
});

module.exports = PaymentView;
