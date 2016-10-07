'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    template = require('ejs!../../templates/rosterOrder/summary.ejs');

var SummaryView = Backbone.View.extend({

	name: 'summary',

    id: 'cmtyx_summary',

	initialize: function(options) {
		this.options = options || {};
        this.getTipInfo();
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
        var html = $.parseHTML(template(this.renderData())),
            tpl = $(html).html();

        this.$el.html(tpl);
    },

    onShow: function() {
        this.getTipInfo();
        this.setTotalPriceWithTip();
        this.addEvents({
            'click .placeOrderBtn': 'onPlaceOrder',
            'click .next_btn': 'onPlaceOrder',
            'click .nav_back_btn': 'goBack',
            'click .plus_button': 'incrementTip',
            'click .minus_button': 'decrementTip',
            'click .get_discount_button': 'onGetDiscount'
        });
    },

    onGetDiscount: function() {
        var params = this.model.additionalParams,
            promoCode = this.$('input[name=promocode]').val();
        if (!promoCode) return;
        orderActions.validatePromoCode(params.sasl.sa(), params.sasl.sl(), promoCode)
            .then(_.bind(function(resp) {
                var currencySymbol = this.model.currencySymbols[resp.currencyCode];
                this.$('.discount_value').text(currencySymbol + resp.discount);
                this.model.additionalParams.discount = resp.discount;
                this.setTotalPriceWithTip();
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
        var number = this.model.get('creditCard').cardNumber;

    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol,
            combinedItems: this.model.additionalParams.combinedItems,
            taxState: this.model.additionalParams.taxState,
            subTotal: this.model.additionalParams.subTotal,
            tip: this.tip,
            tipSum: this.tipSum,
            cardNumber: number ? 'XXXXXXXXXXXXXX' + number.substring(number.length-2,number.length) : undefined,
    	    addrIsEmpty: this.model.additionalParams.addrIsEmpty,
            allowDelivery: this.allowDelivery,
            discount: this.model.additionalParams.discount
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
        var totalAmount,
            tipPortion = this.tip/100;
        this.tipSum = parseFloat((this.totalAmount * tipPortion).toFixed(2));
        var totalAmountWithTip = parseFloat((this.totalAmount + this.tipSum).toFixed(2));
        this.$('.tip_quantity').text(this.tip + '%');
        this.$('.tip_price_value').text(this.tipSum);
        this.model.additionalParams.tipSum = this.tipSum;
        this.model.additionalParams.tip = this.tip;
        var totalAmountWithTipDiscount = parseFloat((totalAmountWithTip - this.model.additionalParams.discount).toFixed(2));
        totalAmountWithTipDiscount < 0 ? totalAmount = 0 : totalAmount = totalAmountWithTipDiscount;
        this.model.set('totalAmount', totalAmount);
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
        Vent.trigger('viewChange', this.options.backTo, this.model);
    }
});

module.exports = SummaryView;
