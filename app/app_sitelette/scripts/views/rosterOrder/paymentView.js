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
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack',
            'click .rightBtn': 'onCashSelected',
            'click .leftBtn': 'onCreditSelected'
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
            cardNumber: this.model.get('creditCard').cardNumber
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
        this.model.set('cashSelected', true);
        this.model.set('creditCardSelected', false);
    },

    onCreditSelected: function() {
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

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo , this.model);
    }
});

module.exports = PaymentView;
