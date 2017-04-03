'use strict';

define([
	'ejs!../../templates/order/addAddress.ejs',
	], function(template){
	var AddAddressView = Mn.View.extend({
		template: template,
		className: 'page add_address_page',
		ui: {
			back: '.back_btn',
			next: '.next_btn'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext'
		},
		initialize: function() {
		},

		onRender: function() {
			this.getMapCoordinates();
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

	    onNext: function() {
	    	this.trigger('onNextStep');
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return AddAddressView;
});