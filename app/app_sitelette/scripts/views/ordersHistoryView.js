/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    template= require('ejs!../templates/ordersHistoryView.ejs');

var OrdersHistoryView = Backbone.View.extend({
    name: 'orders_history',
    id: 'cmtyx_orders_history',

    events: {
        'click .order-row': 'onOrderSelected'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.render(options.ordersHistory);
    },
    render: function(ordersHistory){
        this.$el.html(template({
            ordersHistory: ordersHistory
        }));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        loader.hide();
    },

    onOrderSelected: function(e) {
        var $target = $(e.currentTarget),
            orderUUID = $target.data('uuid');
        Vent.trigger( 'viewChange', 'order_details', orderUUID);
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = OrdersHistoryView;
