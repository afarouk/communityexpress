'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/address.ejs');

var AddressView = Backbone.View.extend({

    name: 'address',

    id: 'cmtyx_address',

    radio: '.ui-radio',

    active: '.ui-navbar .ui-btn-active',

    initialize: function(options) {
        this.options = options || {};
        this.addresses = options.addresses;
        this.on('show', this.onShow, this);
        this.model.on('change', _.bind(this.updateAddress, this));
        this.render();
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack',
            'click .rightBtn': 'showMap',
            'click .leftBtn': 'onDelivery'
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

    updateAddress: function() {
        if (this.model.additionalParams.addrIsEmpty) return;
        var $label = this.$('label[for="saved_address"]'),
            address = this.model.get('deliveryAddress'),
            tpl = address.street + ' ,' + address.number + ' ,' + address.city;

        $label.removeClass('hidden');
        $label.siblings().first().removeClass('hidden').click();
        $label.html(tpl);
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
        //TODO check if it will work in all cases
        var favorites = this.model.additionalParams.userModel.favorites,
            address = favorites.length !== 0 ? favorites.first().get('address') : undefined,
            tmpData = _.extend({
                address: address,
                addrIsEmpty: this.model.additionalParams.addrIsEmpty
            }, this.model.toJSON());

        return tmpData;
    },

    triggerNext: function() {
        var checked = this.$(this.radio).find(':checked'),
            active = this.$(this.active).data('id');
        if (checked.attr('id') === 'add_another' && active !== 'pick_up') {
            this.triggerAddAddress();
        } else {
            this.triggerPayment();
        }
    },

    triggerAddAddress: function() {
        Vent.trigger('viewChange', 'add_address', this.model);
    },

    triggerPayment: function() {
        Vent.trigger('viewChange', 'payment', {
            model: this.model,
            backTo: 'address'
        });
    },

    onDelivery: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.model.set('pickupSelected', false);
        this.model.set('deliverySelected', true);
    },

    showMap: function() {
        this.$('.rightBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_color_1');
        this.model.set('pickupSelected', true);
        this.model.set('deliverySelected', false);

        this.coords = this.model.additionalParams.coords;
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
    },

    goBack : function() {
        var params = this.model.additionalParams;
        if( params.backToRoster){
          this.triggerRosterView(params);
        }else if(params.backToCatalog) {
            this.triggerCatalogView(params);
        } else {
            this.triggerRestaurantView(params);
        }
    },

    triggerRosterView: function(params) {
        Vent.trigger('viewChange', 'roster', {
          sasl: params.sasl.id,
          id: params.rosterId,
          backToRoster:true,
          rosterId:params.rosterId,
          launchedViaURL:  params.launchedViaURL
       }, { reverse: true });
    },

    //TODO
    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', {
          sasl: params.sasl.id,
          id: params.catalogId,
          backToCatalog: true,
          catalogId: params.catalogId,
          launchedViaURL:  params.launchedViaURL
       }, { reverse: true });
    },

    triggerRestaurantView: function() {
        console.log('return to restaurant');
    },
});

module.exports = AddressView;
