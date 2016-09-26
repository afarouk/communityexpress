'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/payment.ejs');

var PaymentView = Backbone.View.extend({

	name: 'payment',

    id: 'cmtyx_payment',

    radio: '.ui-radio',

    active: '.ui-navbar .ui-btn-active',

	initialize: function(options) {
		this.options = options || {};
        this.totalAmount = this.model.get('totalAmount');
        this.tip = 0;
        this.selectTipValue = 0;
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
        this.$('.select_tip option[value=' + this.selectTipValue + ']').attr('selected','selected');
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack',
            'click .rightBtn': 'onCashSelected',
            'click .leftBtn': 'onCreditSelected',
            'change .select_tip': 'setTotalPticeWithTip'
        });
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
            tip: this.tip
    	});
    },

    triggerNext: function() {
        var checked = this.$(this.radio).find(':checked'),
            active = this.$(this.active).data('id');
        if (checked.attr('id') === 'use_another' && active !== 'cash') {
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
        this.model.set('cashSelected', true);
        this.model.set('creditCardSelected', false);
    },

    onCreditSelected: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_text_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.$('.rightBtn').addClass('cmtyx_text_color_1');
        this.model.set('cashSelected', false);
        this.model.set('creditCardSelected', true);
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

    setTotalPticeWithTip: function() {
        this.selectTipValue = this.$('.select_tip').val();
        var tipPortion = this.selectTipValue/100,
            tip = parseFloat((this.totalAmount*tipPortion).toFixed(2)),
            totalAmountWithTip = parseFloat((this.totalAmount + tip).toFixed(2));
        this.tip = tip;
        this.model.additionalParams.tip = tip;
        this.model.set('totalAmount', totalAmountWithTip);
    },

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo , this.model);
    }
});

module.exports = PaymentView;
