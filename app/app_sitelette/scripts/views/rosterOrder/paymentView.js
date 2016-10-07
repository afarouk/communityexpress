'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
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
        this.on('show', this.onShow, this);
        this.model.on('change', _.bind(this.reRender, this));
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    reRender: function() {
        var number = this.model.get('creditCard').cardNumber,
            $label = this.$('#credit label[for="saved_card"]'),
            $cash = this.$('#cash'),
            html = $.parseHTML(template(this.renderData())),
            tpl = $(html).find('#cash').html();

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
        var params = this.model.additionalParams,
            promoCode = this.$('input[name=promocode]').val();
        if (!promoCode) return;
        orderActions.validatePromoCode(params.sasl.sa(), params.sasl.sl(), promoCode)
            .then(_.bind(function(resp) {
                var currencySymbol = this.model.currencySymbols[resp.currencyCode];
                this.$('.discount_value').text(currencySymbol + resp.discount);
                this.model.additionalParams.discount = currencySymbol + resp.discount;
                this.model.set('totalAmount', this.totalAmount);
            }, this), _.bind(function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
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
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol,
            combinedItems: this.model.additionalParams.combinedItems,
            taxState: this.model.additionalParams.taxState,
            subTotal: this.model.additionalParams.subTotal,
            cardNumber: this.model.get('creditCard').cardNumber,
            tip: this.tip,
            tipSum: this.tipSum,
            addrIsEmpty: this.model.additionalParams.addrIsEmpty,
            allowCash: this.allowCash,
            paymentOnlineAccepted: this.paymentOnlineAccepted,
            allowDelivery: this.allowDelivery,
            discount: this.model.additionalParams.discount
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
        Vent.trigger('viewChange', 'payment_card', this.model);
    },

    incrementTip: function() {
        if (this.tip === 20) return;
        h().playSound('addToCart');
        this.tip = this.tip + 5;
        this.setTotalPticeWithTip();
    },

    decrementTip: function() {
        if (this.tip === 0) return;
        h().playSound('removeFromCart');
        this.tip = this.tip - 5;
        this.setTotalPticeWithTip();
    },

    setTotalPticeWithTip: function() {
        var tipPortion = this.tip/100;
        this.tipSum = parseFloat((this.totalAmount * tipPortion).toFixed(2));
        var totalAmountWithTip = parseFloat((this.totalAmount + this.tipSum).toFixed(2));
        this.$('.tip_quantity').text(this.tip + '%');
        this.$('.tip_price_value').text(this.tipSum);
        this.model.additionalParams.tipSum = this.tipSum;
        this.model.additionalParams.tip = this.tip;
        this.model.set('totalAmount', totalAmountWithTip - this.model.additionalParams.discount);
    },

    onPlaceOrder: function() {
        var params = this.model.additionalParams;
        loader.show('placing your order');

        return orderActions.placeOrder(
            params.sasl.sa(),
            params.sasl.sl(),
            this.model.toJSON()
        ).then(function(e) {
            loader.hide();
            params.basket.reset();
            params.backToRoster = false;
            var callback = params.backToCatalog
            ? _.bind(this.triggerCatalogView, this)
            : _.bind(this.triggerRosterView, this);
            popupController.textPopup({
                text: 'order successful'
            }, callback);
        }.bind(this), function(e) {
            debugger;
            loader.hide();
            var text = h().getErrorMessage(e, 'Error placing your order');
            popupController.textPopup({
                text: text
            });
        }.bind(this));
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
        Vent.trigger('viewChange', this.options.backTo , this.model);
    }
});

module.exports = PaymentView;
