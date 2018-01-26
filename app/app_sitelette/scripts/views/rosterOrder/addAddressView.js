'use strict';

var Vent = require('../../Vent'),
    h = require('../../globalHelpers'),
    states = require('../../states'),
    template = require('ejs!../../templates/rosterOrder/addAddress.ejs');

var AddAddressView = Backbone.View.extend({

	name: 'add_address',

    id: 'cmtyx_add_address',

    number: '#aptBldgInput',
    street: '#streetInput',
    city: '#cityInput',
    state: '#stateSelector',

	initialize: function(options) {
		this.options = options || {};
        this.states = this.getStatesData();
        this.options.deliveryPickupOptions = this.getDeliveryPickupOptions();
        this.on('show', this.onShow, this);
        this.render();
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

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerPayment',
            'click .nav_back_btn': 'goBack',
            'click #addressOnMap': 'getMapCoordinates',
            'change #aptBldgInput': 'onAptBldgChanged',
            'change #streetInput': 'onStreetChanged',
            'change #cityInput': 'onCityChanged',
            'change #stateSelector': 'onStateChanged',
            'focus .material-textfield input': 'hideError'
        });
        this.getMapCoordinates();
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol,
            states: this.states,
            selectedState: this.getSelectedState()
    	});
    },

    getDeliveryPickupOptions: function() {
        console.log(this.options);
        var deliveryPickupOptions = this.options.deliveryPickupOptions || {};
        var futureOrRegular = deliveryPickupOptions.futureOrRegular,
            future;
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

    getMapCoordinates: function() {
        var address = this.model.get('deliveryAddress'),
            geocoder = new google.maps.Geocoder(),
            location;
        geocoder.geocode({
            "address": address.state + ' ' + address.city + ' ' + address.street + ' ' + address.number
        }, _.bind(function(results) {
            if (results.length === 0 && !this.map) {
                this.mapResultEmpty();
                return;
            }
            if (results.length === 0) return;
            location = results[0].geometry.location;
            if (this.map) {
                this.changeMapCenter(location.lat(), location.lng());
            } else {
                this.showMap(location.lat(), location.lng());
            }
        }, this));
    },

    changeMapCenter: function(lat, lng) {
        var position = {
            lat : lat,
            lng : lng
        };
        this.map.setCenter(position);
        this.marker.setPosition(position);
    },

    mapResultEmpty: function() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(_.bind(function(position) {
            this.showMap(position.coords.latitude, position.coords.longitude);
          }, this), function() {
            //TODO location error
            console.warn('!!!Can\'t get current user location');
          });
        } else {
          // Browser doesn't support Geolocation
        }
    },

    showMap: function(lat, lng) {
        var el = this.$('#shipping_map2')[0],
            infoVisible = false,
            options = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 17,
            disableDefaultUI:true
        };
        this.map = new google.maps.Map(el, options);
        this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: this.map,
          title: 'Your address',
          draggable: true,
          raiseOnDrag: true
        });

        var infowindow = new google.maps.InfoWindow({
          content: 'Drag marker or double click on map to move it.'
        });
        google.maps.event.addListener(this.marker, 'click', _.bind(function(){
          if (infoVisible) {
            infowindow.close(this.map, this.marker);
            infoVisible = false;
          } else {
            infowindow.open(this.map, this.marker);
            infoVisible = true;
          }
        },this));
        google.maps.event.addListener(this.marker, 'dragend', _.bind(this.dragendMarker,this));
        google.maps.event.addListener(this.map, 'dblclick', function(e) {
            var positionDoubleclick = e.latLng;
            this.marker.setPosition(positionDoubleclick);
            this.dragendMarker(e);
        }.bind(this));

        //.......
        // Bounds for North America
        var strictBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(28.70, -127.50), 
            new google.maps.LatLng(48.85, -55.90)
        );
        google.maps.event.addListener(this.map, 'dragend', function() {
            if (strictBounds.contains(this.map.getCenter())) return;

            var c = this.map.getCenter(),
                x = c.lng(),
                y = c.lat(),
                maxX = strictBounds.getNorthEast().lng(),
                maxY = strictBounds.getNorthEast().lat(),
                minX = strictBounds.getSouthWest().lng(),
                minY = strictBounds.getSouthWest().lat();

            if (x < minX) x = minX;
            if (x > maxX) x = maxX;
            if (y < minY) y = minY;
            if (y > maxY) y = maxY;

            this.map.setCenter(new google.maps.LatLng(y, x));
        }.bind(this));
        //.......
    },

    dragendMarker: function(event) {
        this.$('.roster_order_error').slideUp();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            location: this.marker.getPosition()
        }, _.bind(function(results) {
            if (results.length > 0) {
                this.map.setCenter(results[0].geometry.location);
                this.setNewAddress(this.parseAddress(results[0]));
            } else {
                //TODO error
            }
        }, this));
    },

    parseAddress: function(result) {
        var address = {},
            cNumber = 0,
            formatted = result.formatted_address,
            components = result.address_components;

        components.forEach(function(component){
            var type = component.types[0];
            switch (type) {
                case 'street_number':
                address.number = component.short_name;
                cNumber++;
                break;
                case 'route':
                address.street = typeof component.short_name === 'string' ? component.short_name : '';
                cNumber++;
                break;
                case 'locality':
                address.city = component.short_name;
                cNumber++;
                break;
                case 'administrative_area_level_1':
                address.state = component.short_name.split(' ')[0];
                cNumber++;
                break;
            }
        });
        if (cNumber !== 4) {
            //try to parse if components wrong
            try {
                components = formatted.split(',');
                address.number = components[0].split(' ')[0];
                address.street = components[0].split(' ').slice(1).toString();
                address.city = components[1].replace(' ', '');
                address.state = components[2].replace(' ', '').split(' ')[0];
            } catch(e) {

            }
        }
        return address;
    },

    setNewAddress: function(address) {
        var state = this.states[address.state] ? address.state : 'CA';
        this.model.set('deliveryAddress', address);

        this.$(this.number).val(address.number);
        this.$(this.street).val(address.street);
        this.$(this.city).val(address.city);
        this.$(this.state).val(state);
        this.$(this.state).selectmenu('refresh', true);
    },

    triggerPayment: function() {
        if (this.validate()) {
            this.model.trigger('change');
            if (!this.options.futureOrRegular) {
                if (!this.model.additionalParams.allowCash && this.model.get('paymentProcessor') === 'VANTIV') {
                    Vent.trigger('viewChange', 'summary', {
                        model: this.model,
                        circles: this.options.circles,
                        backTo: 'add_address'
                    });
                } else {
                    Vent.trigger('viewChange', 'payment', {
                        circles: this.options.circles,
                        model: this.model,
                        backTo: 'add_address'
                    });
                }
            } else {
                Vent.trigger('viewChange', 'order_time', {
                    model: this.model,
                    circles: this.options.circles,
                    deliveryPickupOptions: this.options.deliveryPickupOptions,
                    futureOrRegular: this.options.futureOrRegular,
                    backTo: 'add_address'
                });
            }
        } else {
            //TODO show errors
        }
    },

    validate: function() {
        var address = this.model.get('deliveryAddress');
        if (address.number &&
            address.street &&
            address.city &&
            address.state) {
            this.model.additionalParams.addrIsEmpty = false;
            return true;
        } else {
            this.model.additionalParams.addrIsEmpty = true;
            _.each(address, _.bind(function(value, name) {
                if (!value) {
                    this.$('.roster_order_error.error_' + name).slideDown();
                }
            }, this));
            return false;
        }
    },

    hideError: function(e) {
        var name = e.target.name;
        this.$('.error_' + name).slideUp();
    },

    goBack : function() {
        Vent.trigger('viewChange', 'address', {
            model: this.model,
            circles: this.options.circles
        });
    },

    onAptBldgChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').number = value;
        this.onChangeAddress();
    },

    onStreetChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').street = value;
        this.onChangeAddress();
    },

    onCityChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').city = value;
        this.onChangeAddress();
    },

    onStateChanged: function() {
        var value = this.$('#stateSelector').val()
        this.model.get('deliveryAddress').state = value;
        this.onChangeAddress();
    },

    onChangeAddress: function() {
        var address = this.model.get('deliveryAddress'),
            tpl = 'Your address is ' + address.street + ' ,' + address.number + ' ,' + address.city;
        this.getMapCoordinates();
    },

    getValue: function(e) {
        var target = $(e.currentTarget);
        return target.val();
    },

    getStatesData: function() {
        return states;
    },
    getSelectedState: function() {
        var selected = this.model.get('deliveryAddress').state || null;
        if (!selected) {
            this.model.get('deliveryAddress').state = 'CA';
        }
        return this.states[selected] ? selected : 'CA';
    }

});

module.exports = AddAddressView;
