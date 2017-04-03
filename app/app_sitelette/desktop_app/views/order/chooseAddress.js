'use strict';

define([
	'ejs!../../templates/order/chooseAddress.ejs',
	'./switchTabsBehavior'
	], function(template, SwitchTabsBehavior){
	var ChooseAddressView = Mn.View.extend({
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page choose_address_page',
		ui: {
			back: '.back_btn',
			next: '.next_btn'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext'
		},
		initialize: function() {
			console.log(this.model.additionalParams);
			console.log(this.model.toJSON());
			this.tabActive = this.model.additionalParams.allowDelivery ? 'delivery' : 'pick_up';
		},
		serializeData: function() {
			var favorites = this.model.additionalParams.userModel.favorites,
            	address = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl();
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
				address: address
			});
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

	    showMap: function() {
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

	    onTabShown: function() {
	    	if (this.tabActive === 'pick_up') {
	    		this.showMap();
	    	}
	    },

	    onNext: function() {
	    	var checked = this.$('[name="radio-choice-address"]:checked'),
	    		address = checked.data('address');

	    	if (this.tabActive === 'delivery') {
	    		this.model.set('pickupSelected', false);
        		this.model.set('deliverySelected', true);
			} else {
				this.model.set('pickupSelected', true);
        		this.model.set('deliverySelected', false);
			}
	    	this.trigger('onNextStep', address, this.tabActive);
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }

	});
	return ChooseAddressView;
});