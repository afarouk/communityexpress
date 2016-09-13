'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/payment.ejs');

var PaymentView = Backbone.View.extend({

	name: 'payment',

    id: 'cmtyx_payment',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        console.log(this.model.toJSON());
        this.render();
	},

	render: function() {
        this.$el.html(template(this.model.toJSON()));
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
    }
});

module.exports = PaymentView;
