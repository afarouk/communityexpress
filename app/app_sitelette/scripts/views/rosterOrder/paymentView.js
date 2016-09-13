'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/payment.ejs');

var PaymentView = Backbone.View.extend({

	name: 'payment',

    id: 'cmtyx_payment',

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
            'click .next_btn': 'triggerPayment'
        });
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol
    	});
    }
});

module.exports = PaymentView;
