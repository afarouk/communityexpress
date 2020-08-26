'use strict';

var Vent = require('../../Vent'),
    h = require('../../globalHelpers'),
    template = require('ejs!../../templates/rosterOrder/address.ejs');

var AddressView = Backbone.View.extend({

    name: 'address',

    id: 'cmtyx_address',

    radio: '.ui-radio',

    active: '.ui-navbar .ui-btn-active',

    initialize: function(options) {
        this.options = options || {};

        this.options.deliveryPickupOptions = this.getDeliveryPickupOptions();

        this.addresses = options.addresses;
        this.allowPickUp = this.model.additionalParams.allowPickUp;
        this.allowDelivery = this.model.additionalParams.allowDelivery;
        this.shownMap = false;
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

        if (!this.allowDelivery && this.allowPickUp && !this.shownMap) {
            this.showMap();
            this.shownMap = true;
        }
    },

    addEvents: function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    },

    render: function() {
        this.$el.html(template(this.renderData()));
        this.createCircles();
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    createCircles: function(){
        h().createCircles(this.$el.find('.circles_block'), this.options.circles, 1);
    },

    updateAddress: function() {
        if (this.model.additionalParams.addrIsEmpty) return;
        var $label = this.$('label[for="saved_address"]'),
            address = this.model.get('deliveryAddress'),
            tpl = address.number + ' ' + address.street + ', ' + address.city + ', ' + address.state;

        $label.removeClass('hidden');
        $label.siblings().first().removeClass('hidden').click();
        $label.html(tpl);
    },

    renderContent: function (){
        return this.$el;
    },

    renderData: function() {
        //TODO check if it will work in all cases
        var favorites = this.model.additionalParams.userModel.favorites,
            address = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl(),
            tmpData = _.extend({
                circles: this.options.circles,
                address: address,
                addrIsEmpty: this.model.additionalParams.addrIsEmpty,
                allowPickUp: this.allowPickUp,
                allowDelivery: this.allowDelivery
            }, this.model.toJSON());

        return tmpData;
    },

    getDeliveryPickupOptions: function() {
        var deliveryPickupOptions = this.options.deliveryPickupOptions || {};
        var futureOrRegular = deliveryPickupOptions.futureOrRegular;
        if (!futureOrRegular || futureOrRegular === 'UNDEFINED' ||  
            !deliveryPickupOptions.options || deliveryPickupOptions.options.length === 0 ) {
            this.options.circles = 3;
            this.options.futureOrRegular = null;
            return null;
        } else {
            this.options.circles = 4;
            this.options.futureOrRegular = futureOrRegular;
            return deliveryPickupOptions;
        }
    },

    getAddressFromSasl: function() {
        var address = {
            name: saslData.saslName,
            street: saslData.street,
            street2: saslData.street2,
            number: saslData.number,
            city: saslData.city,
            state: saslData.state,
            zip: saslData.zip,
            phone: saslData.telephoneNumber
        };
        return address;
    },

    triggerNext: function() {
        var checked = this.$(this.radio).find(':checked');
        if (checked.attr('id') === 'add_another' && !this.pickUp) {
            this.triggerAddAddress();
        } else {
            this.triggerPayment();
        }
    },

    triggerAddAddress: function() {
        Vent.trigger('viewChange', 'add_address', {
            deliveryPickupOptions: this.options.deliveryPickupOptions,
            futureOrRegular: this.options.futureOrRegular,
            circles: this.options.circles,
            model: this.model
        });
    },

    triggerPayment: function() {
        //temporary for testing
        if (!this.options.futureOrRegular) {
            if (!this.model.additionalParams.allowCash && this.model.get('paymentProcessor') === 'VANTIV_HID') {
                Vent.trigger('viewChange', 'summary', {
                    model: this.model,
                    circles: this.options.circles,
                    backTo: 'address'
                });
            } else {
                Vent.trigger('viewChange', 'payment', {
                    circles: this.options.circles,
                    model: this.model,
                    backTo: 'address'
                });
            }
        } else {
            Vent.trigger('viewChange', 'order_time', {
                model: this.model,
                circles: this.options.circles,
                deliveryPickupOptions: this.options.deliveryPickupOptions,
                futureOrRegular: this.options.futureOrRegular,
                backTo: 'address'
            });
        }
    },

    onDelivery: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_text_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.$('.rightBtn').addClass('cmtyx_text_color_1');
        this.pickUp = false;
        this.model.set('pickupSelected', false);
        this.model.set('deliverySelected', true);
    },

    showMap: function() {
        this.$('.rightBtn').addClass('cmtyx_color_1');
        this.$('.rightBtn').removeClass('cmtyx_text_color_1');
        this.$('.leftBtn').removeClass('cmtyx_color_1');
        this.$('.leftBtn').addClass('cmtyx_text_color_1');
        this.pickUp = true;
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
                disableDefaultUI:true,
                zoomControl: true,
                gestureHandling: 'none'
            };
        this.map = new google.maps.Map(el, options);
        this.restaurantMarker = new google.maps.Marker({
            position: {lat: lat, lng: long},
            map: this.map
        });
        // google.maps.event.addListener(this.map, 'click', _.bind(this.calculateRoute, this));
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
        if ( params.backToRoster){
          this.triggerRosterView(params);
        } else if (params.backToCatalog) {
            this.triggerCatalogView(params);
        } else if (params.backToSingleton) {
            this.triggerSingletonView(params);
        } else {
            this.triggerRestaurantView(params);
        }
    },

    triggerSingletonView: function(params) {
        Vent.trigger('viewChange', 'singleton', {
            uuid: params.itemUUID,
            backToRoster: false,
            backToCatalogs: false,
            backToCatalog: false,
            backToSingleton: true
       });
    },

    triggerRosterView: function(params) {
        Vent.trigger('viewChange', 'roster', {
          sasl: params.sasl.id,
          id: params.rosterId,
          backToRoster:true,
          rosterId: params.rosterId,
          launchedViaURL: params.launchedViaURL
       }, { reverse: true });
    },

    triggerCatalogView: function(params) {
        Vent.trigger('viewChange', 'catalog', {
          sasl: params.sasl.id,
          catalogId: params.catalogId,
          backToRoster: false,
          backToCatalogs: false,
          backToCatalog: true
       }, { reverse: true });
    },

    triggerRestaurantView: function() {
        Vent.trigger('viewChange', 'restaurant', this.model.additionalParams.sasl.getUrlKey());
    }
});

module.exports = AddressView;
