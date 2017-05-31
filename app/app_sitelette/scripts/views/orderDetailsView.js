/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    template= require('ejs!../templates/orderDetailsView.ejs');

var OrderDetailsView = Backbone.View.extend({
    name: 'order_details',
    id: 'cmtyx_order_details',
    initialize: function(options) {
        options = options || {};
        this.on('show', this.onShow, this);
        this.render(options);
    },
    render: function(options) {
        this.$el.html(template(options));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        loader.hide();
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'orders_history');
    }
});

module.exports = OrderDetailsView;
