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
            'click .next_btn': 'triggerPayment',
            'click .rightBtn': 'showMap'
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
    },

    showMap: function() {
        var coords = this.model.get('coords'),
            lat = coords.lat,
            long = coords.long,
            el = this.$('#shipping_map')[0],
            options = {
            center: new google.maps.LatLng(lat, long), 
            zoom: 10,
            disableDefaultUI:true
        };
        this.map = new google.maps.Map(el, options);
        google.maps.event.addListener(this.map, 'click', _.bind(this.addMarker, this));
    },

    addMarker: function(location) {
        if (this.marker) {
            this.marker.setMap(null)
        }
        this.marker = new google.maps.Marker({
            position: location.latLng, 
            map: this.map
        });
    }
});

module.exports = AddressView;
