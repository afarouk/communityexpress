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
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack'
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
            subTotal: this.model.additionalParams.subTotal
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

    triggerSummary: function() {
        Vent.trigger('viewChange', 'summary', {
            model: this.model,
            backTo: 'payment'
        });
    },

    triggerPaymentCard: function() {
        Vent.trigger('viewChange', 'payment_card', this.model);
    },

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo , this.model);
    }
});

module.exports = PaymentView;
