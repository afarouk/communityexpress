/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    moment = require('moment'),
    template= require('ejs!../templates/ordersHistoryView.ejs');

var OrdersHistoryView = Backbone.View.extend({
    name: 'orders_history',
    id: 'cmtyx_orders_history',
    moment: moment,
    events: {
        'click .order-row': 'onOrderSelected'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.render(this.templateData(options.ordersHistory));
    },
    templateData: function(ordersHistory) {
        return ordersHistory.map(function(order){
            var date = order.dateTimeOrderPlacedOn.replace('at', '');
            return {
                orderUUID: order.orderUUID,
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                saslName: order.saslName,
                dateTimeOrderPlacedOn: this.moment(date).format('MMM D \'YY')
            }
        }.bind(this));
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
