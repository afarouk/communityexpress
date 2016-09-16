'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/summary.ejs');

var SummaryView = Backbone.View.extend({

	name: 'summary',

    id: 'cmtyx_summary',

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
        var html = $.parseHTML(template(this.renderData())),
            tpl = $(html).html();
        
        this.$el.html(tpl);
    },

    onShow: function() {
        this.addEvents({
            'click .placeOrderBtn': 'triggerPlaceOrder',
            'click .next_btn': 'triggerPlaceOrder',
            'click .nav_back_btn': 'goBack'
        });
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
            cardNumber: 'XXXXXXXXXXXXXX' + number.substring(number.length-2,number.length),
    	});
    },

    triggerPlaceOrder: function() {
        console.log('place order');
    },

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo, this.model);
    }
});

module.exports = SummaryView;
