'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/paymentCard.ejs');

var PaymentCardView = Backbone.View.extend({

	name: 'payment_card',

    id: 'cmtyx_payment_card',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));

        this.card = new Skeuocard(this.$('#skeuocard'));

        return this;
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerSummary',
            'click .nav_back_btn': 'goBack'
        });
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol
    	});
    },

    triggerSummary: function() {
        Vent.trigger('viewChange', 'summary', this.model);
    },

    goBack : function() {
        Vent.trigger('viewChange', 'payment', this.model);
    }
});

module.exports = PaymentCardView;
