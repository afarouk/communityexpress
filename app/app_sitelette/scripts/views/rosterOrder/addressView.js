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
        this.coords = this.model.get('coords');
        this.directionsDisplay = new google.maps.DirectionsRenderer(),
        this.directionsService = new google.maps.DirectionsService();
        var lat = this.coords.lat,
            long = this.coords.long,
            el = this.$('#shipping_map')[0],
            options = {
            center: new google.maps.LatLng(lat, long), 
            zoom: 10,
            disableDefaultUI:true
        };
        this.map = new google.maps.Map(el, options);
        this.restaurantMarker = new google.maps.Marker({
            position: {lat: lat, lng: long},
            map: this.map
        });
        google.maps.event.addListener(this.map, 'click', _.bind(this.calculateRoute, this));
    },

    calculateRoute: function(location) {
        var start = location.latLng,
            end = new google.maps.LatLng(this.coords.lat, this.coords.long),
            bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        this.map.fitBounds(bounds);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService.route(request, _.bind(function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
                this.directionsDisplay.setMap(this.map);
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        }, this));
    }
});

module.exports = AddressView;
