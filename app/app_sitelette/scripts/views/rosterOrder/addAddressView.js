'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/addAddress.ejs');

var AddAddressView = Backbone.View.extend({

	name: 'add_address',

    id: 'cmtyx_add_address',

    order_address: '.order_address',

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
        });
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
            if (results.length === 0) {
                this.mapResultEmpty();
                return;
            }
            location = results[0].geometry.location;
            this.showMap(location.lat(), location.lng());
        }, this));
    },

    mapResultEmpty: function() {
        //TODO empty map 
        this.$(this.order_address).html('');
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(_.bind(function(position) {
            this.showMap(position.coords.latitude, position.coords.longitude);
          }, this), function() {
            //TODO location error
            debugger;
          });
        } else {
            debugger;
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
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            location: this.marker.getPosition()
        }, _.bind(function(results) {
            if (results.length > 0) {
                var address = results[0].formatted_address;
                this.map.setCenter(results[0].geometry.location);
                this.setNewAddress(address);
            } else {
                //TODO error
            }
        }, this));
    },

    setNewAddress: function(address) {
        console.log(address);
        var addressComp = address.split(','),
            addr = this.model.get('deliveryAddress');

        if (addressComp.length >=3) {
            addr.street = addressComp[0];
            addr.number = addressComp[1];
            addr.city = addressComp[2];
            this.model.trigger('change');
            //TODO update each address fields
        }
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
            return false;
        }
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
        this.$(this.order_address).html(tpl);
    },

    getValue: function(e) {
        var target = $(e.currentTarget);
        return target.val();
    }

});

module.exports = AddAddressView;
