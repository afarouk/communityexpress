'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/address.ejs');

var AddressView = Backbone.View.extend({

    name: 'address',

    id: 'cmtyx_address',

    initialize: function(options) {
        this.options = options || {};
        this.addresses = options.addresses;
        this.on('show', this.onShow, this);
        this.render();
    },

    onShow: function() {
        this.addEvents({
            'click .next_btn': 'triggerPayment'
        });
    },

    addEvents: function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    },

    render: function() {
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
        var tmpData = _.extend({}, this.model.toJSON());

        return tmpData;
    },

    triggerPayment: function() {
        Vent.trigger('viewChange', 'payment', this.model);
    }
});

module.exports = AddressView;
