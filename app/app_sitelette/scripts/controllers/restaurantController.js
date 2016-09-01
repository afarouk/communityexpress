/*global define */

'use strict';

var gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js'),
    h = require('../globalHelpers.js'),
    geolocation = require('../Geolocation.js'),
    RestaurantModel = require('../models/restaurantModel.js'),
    RestaurantSummary = require('../collections/restaurantSummaryCollection.js');

var getDefaults = function() {
    return {
        UID: ( appCache.get('user') ? appCache.get('user').getUID() : '' ),
        latitude: geolocation.getPreviousLocation().latitude,
        longitude: geolocation.getPreviousLocation().longitude
    };
};

var createRestaurant = function (data) {
    return new RestaurantModel(data);
};

var createRestaurantSummary = function (response) {
    return new RestaurantSummary(response);
};

var getRestaurantSummary = function(lat, lon, domain, uid, simulate) {
    return gateway.sendRequest('getRestaurantSummaryByUIDAndLocation', {
        latitude: lat,
        longitude: lon,
        domain: domain,
        UID: uid,
        simulate: simulate
    });
};

module.exports = {

    getRestaurant: function(first, second) {
        return second ? this.getRestaurantBySASL(first,second) : this.getRestaurantByURLkey(first);
    },

    getRestaurantBySASL: function(sa, sl) {
        return gateway.sendRequest('getRestaurantBySASL', $.extend( getDefaults(), {
            serviceAccommodatorId: sa,
            serviceLocationId: sl
        })).then(createRestaurant);
    },

    getRestaurantByURLkey: function(urlKey, lat, lng, uid) {
        return gateway.sendRequest('getRestaurantByURLkey', $.extend( getDefaults(), {
            urlKey: urlKey,
            latitude: lat,
            longitude: lng,
        })).then(createRestaurant);
    },

    getRestaurantWithStoredSASL: function(saslData) {
        return $.Deferred().resolve(createRestaurant(saslData)).promise();
    },

    getRestaurantSummaryByUIDAndLocation: function(lat, lon, domain, uid, simulate) {
        return getRestaurantSummary(lat, lon, domain, uid, simulate).then(createRestaurantSummary);
    },

    getRestaurantSummaryByUIDAndAddress: function(domain, uid, city, street, zip, simulate) {
        return gateway.sendRequest('getRestaurantSummaryByUIDAndAddress', {
            domain: domain,
            UID: uid,
            payload: {
                city: city,
                street: street,
                zip: zip
            }
        }).then(function (response) {
            return {
                sasls: createRestaurantSummary(response.sasls),
                latlng: {
                    lat: response.latitude,
                    lng: response.longitude
                }
            };
        });
    }

};
