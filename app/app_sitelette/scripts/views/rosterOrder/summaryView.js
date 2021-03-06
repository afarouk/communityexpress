'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
    template = require('ejs!../../templates/rosterOrder/summary.ejs');

var SummaryView = Backbone.View.extend({

	name: 'summary',

    id: 'cmtyx_summary',

	initialize: function(options) {
		this.options = options || {};
        this.getTipInfo();
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
        var index = this.options.circles === 3 ? 3 : 4;
        h().createCircles(this.$el.find('.circles_block'), this.options.circles, index);
    },

    reRender: function() {
        var html = $.parseHTML(template(this.renderData())),
            tpl = $(html).html();

        this.$el.html(tpl);
        this.createCircles();
        if (this.options.fromVantiv) this.onVantivResponse(this.options.fromVantiv);
    },

    onShow: function() {
        this.getTipInfo();
        this.setTotalPriceWithTip();
        this.addEvents({
            'click .placeOrderBtn': 'onNext',
            'click .next_btn': 'onNext',
            'click .nav_back_btn': 'goBack',
            'click .plus_button': 'incrementTip',
            'click .minus_button': 'decrementTip',
            'click .add-note': 'toggleAddNote',
            'change .note-text > textarea': 'onCommentChanged',
            'click .get_discount_button': 'onGetDiscount'
        });
    },

    toggleAddNote: function() {
        this.$('.note-text').toggle('slow');
    },
    onCommentChanged: function(e) {
        var target = $(e.currentTarget),
            comment = target.val();
        this.model.set({comment: comment}, {silent: true});
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
            }, this), _.bind(function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
                this.model.additionalParams.promoCode = null;
                popupController.textPopup({
                    text: text
                });
            }, this));
    },

    getTipInfo: function() {
        this.totalAmount = this.model.additionalParams.cachedTotalAmount;
        this.tip = this.model.additionalParams.tip;
        this.tipSum = this.model.additionalParams.tipSum;
        this.$('.tip_quantity').text(this.tip + '%');
        this.$('.tip_price_value').text(this.tipSum);
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
        var number = this.model.get('creditCard').cardNumber,
            favorites = this.model.additionalParams.userModel.favorites,
            pickupAddress = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl();

    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol,
            combinedItems: this.model.additionalParams.combinedItems,
            taxState: this.model.additionalParams.taxState.toFixed(2),
            subTotal: this.model.additionalParams.subTotal.toFixed(2),
            tip: this.tip,
            tipSum: this.tipSum,
            totalWithoutTax: this.totalWithoutTax,
            deliveryDate: this.model.additionalParams.deliveryDate,
            cardNumber: number ? 'XXXXXXXXXXXXXX' + number.substring(number.length-2,number.length) : undefined,
    	    addrIsEmpty: this.model.additionalParams.addrIsEmpty,
            allowDelivery: this.allowDelivery,
            pickupAddress: pickupAddress,
            showTipOnSummaryPage: this.model.additionalParams.showTipOnSummaryPage,
            discount: this.model.additionalParams.discountDisplay.toFixed(2),
            afterDiscount: this.model.additionalParams.afterDiscount ? this.model.additionalParams.afterDiscount.toFixed(2) : null,
            promoCode: this.model.additionalParams.promoCode,
            minimumPurchase: this.model.additionalParams.minimumPurchase,
            backToSingleton: this.model.additionalParams.backToSingleton
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
        this.$('.tip_price_value').text(this.tipSum.toFixed(2));
        this.model.additionalParams.tipSum = this.tipSum;
        this.model.additionalParams.tip = this.tip;

        this.model.set({'totalAmount': totalAmount.toFixed(2)}, {silent:true});
        this.model.trigger('change');
    },

    onNext: function() {
        if (this.model.get('paymentProcessor') === 'VANTIV_HID') {
            this.options.fromVantiv = null;
            Vent.trigger('viewChange', 'vantiv', {
                model: this.model,
                backTo: 'payment'
            });
        } else {
            this.onPlaceOrder();
        }
    },

    onVantivResponse: function(fromVantiv) {
        var vantiv = fromVantiv.vantiv,
            validationCode = fromVantiv.validationCode,
            status = vantiv.transactionId1;
        this.options.fromVantiv = null;
        if (status === 'Complete') {
            if (validationCode == fromVantiv.code) {
                _.extend(this.model.attributes, vantiv);
                this.onPlaceOrder();
            } else {
                this.model.unset('orderUUID');
                popupController.textPopup({
                    text: 'Vantiv validation error.'
                });
                return;
            }
        } else {
            this.model.unset('orderUUID');
            popupController.textPopup({
                text: 'Credit card error.'
            });
            return;
        }
    },

    onPlaceOrder: function() {
        this.onPlaceMultipleOrder();
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
            // appCache.set('promoCode', null);
            this.model.additionalParams.promoCodeActive = false;
            appCache.set('updateDiscount', true);
            var callback;
            if (params.backToSingleton) {
                callback = _.bind(this.triggerSingletonView, this);
            } else {
                callback = _.bind(this.triggerCatalogView, this);
            }
            popupController.textPopup({
                text: 'order placed'
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
            backToSingleton: false
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
        Vent.trigger('viewChange', this.options.backTo, {
            model: this.model,
            circles: this.options.circles
        });
    }
});

module.exports = SummaryView;
