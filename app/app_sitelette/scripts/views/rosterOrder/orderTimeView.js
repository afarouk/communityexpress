'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
    template = require('ejs!../../templates/rosterOrder/orderTime.ejs');

var SummaryView = Backbone.View.extend({

	name: 'order_time',

    id: 'cmtyx_order_time',

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
            'click .leftBtn': 'onRegularSelected',
            'click .rightBtn': 'onFutureSelected',
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack'
        });
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
        var number = this.model.get('creditCard').cardNumber;

    	return _.extend(this.model.toJSON(), {
    		futureOrRegular: true
        });
    },

    onRegularSelected: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_text_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.$('.rightBtn').addClass('cmtyx_text_color_1');
    },

    onFutureSelected: function() {
        this.$('.rightBtn').addClass('cmtyx_color_1');
        this.$('.rightBtn').removeClass('cmtyx_text_color_1');
        this.$('.leftBtn').removeClass('cmtyx_color_1');
        this.$('.leftBtn').addClass('cmtyx_text_color_1');
    },

    triggerNext: function() {
        Vent.trigger('viewChange', 'payment', {
                model: this.model,
                backTo: 'order_time'
            });
    },

    goBack : function() {
        Vent.trigger('viewChange', this.options.backTo, this.model);
    }
});

module.exports = SummaryView;
