'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/addAddress.ejs');

var AddAddressView = Backbone.View.extend({

	name: 'add_address',

    id: 'cmtyx_add_address',

    number: '#aptBldgInput',
    street: '#streetInput',
    city: '#cityInput',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerPayment',
            'click .nav_back_btn': 'goBack',
            'click #addressOnMap': 'getMapCoordinates',
            'change #aptBldgInput': 'onAptBldgChanged',
            'change #streetInput': 'onStreetChanged',
            'change #cityInput': 'onCityChanged',
            'focus .material-textfield input': 'hideError'
        });
        this.getMapCoordinates();
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol
    	});
    },

    getMapCoordinates: function() {
        var address = this.model.get('deliveryAddress'),
            geocoder = new google.maps.Geocoder(),
            location;
        geocoder.geocode({
            "address": address.city + ' ' + address.street + ' ' + address.number
        }, _.bind(function(results) {
            if (results.length === 0 && !this.map) {
                this.mapResultEmpty();
                return;
            }
            if (results.lenght === 0) return;
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
        //TODO empty map
        // this.$(this.order_address).html('');
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

        google.maps.event.addListener(this.marker, 'dragend', _.bind(this.dragendMarker,this));
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
                address.street = component.short_name;
                cNumber++;
                break;
                case 'locality':
                address.city = component.short_name;
                cNumber++;
                break;
            }
        });
        if (cNumber !== 3) {
            components = formatted.split(',');
            address.street = components[0];
            address.number = components[1].replace(' ', '');
            address.city = components[2];
        }
        return address;
    },

    setNewAddress: function(address) {
        console.log(address);
        this.model.set('deliveryAddress', address);

        this.$(this.number).val(address.number);
        this.$(this.street).val(address.street);
        this.$(this.city).val(address.city);
    },

    triggerPayment: function() {
        if (this.validate()) {
            this.model.trigger('change');
            Vent.trigger('viewChange', 'payment', {
                model: this.model,
                backTo: 'add_address'
            });
        } else {
            //TODO show errors
        }
    },

    validate: function() {
        var address = this.model.get('deliveryAddress');
        if (address.number &&
            address.street &&
            address.city) {
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
        Vent.trigger('viewChange', 'address', this.model);
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

    onChangeAddress: function() {
        var address = this.model.get('deliveryAddress'),
            tpl = 'Your address is ' + address.street + ' ,' + address.number + ' ,' + address.city;
        // this.$(this.order_address).html(tpl);
        this.getMapCoordinates();
    },

    getValue: function(e) {
        var target = $(e.currentTarget);
        return target.val();
    }

});

module.exports = AddAddressView;
