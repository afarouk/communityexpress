/*global define*/

'use strict';

var appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway.js'),
    SaslSummary = require('../collections/restaurantSummaryCollection.js'),
    SaslCollection = require('../collections/sasls.js'),
    restaurantController = require('../controllers/restaurantController.js'),
    filterActions = require('../actions/filterActions.js'),
    configurationActions = require('../actions/configurationActions.js'),
    sessionActions = require('../actions/sessionActions.js'),
    restaurantModel = require('../models/restaurantModel.js'),
    geolocation = require('../Geolocation.js'),
    h = require('../globalHelpers.js');

module.exports = {
    updateLocation: function (sa, sl, lat, lng, status) {
        var uid = sessionActions.getCurrentUser().getUID();
        return gateway.sendRequest('updateLocation', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            latitude: lat,
            longitude: lng,
            status: status,
            UID: uid
        });
    },

    getAboutUs: function (sa,sl) {
        return gateway.sendRequest('getAboutUs', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
        });
    },

    getOpeningHours: function (sa,sl) {
        var uid = sessionActions.getCurrentUser().getUID();
        return gateway.sendRequest('getOpeningHours', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            floorId: 1,
            tierId: 1,
            UID: uid
        });
    },

    // !!! getSasl backup !!!
    // getSasl: function (id) {
    //     var uid = sessionActions.getCurrentUser().getUID();
    //     var cache =  appCache.fetch('sasls', new SaslCollection()).get(id);
    //     var coords =  geolocation.getPreviousLocation();
    //     var remote;
        
    //     function handleResponse (response) {
    //         appCache.get('sasls').unshift(response);
    //         return response;
    //     }

    //     if ($.isArray(arguments[0])) {
    //         remote = restaurantController.getRestaurantBySASL(id[0], id[1], coords.latitude, coords.longitude, uid)
    //         .then(handleResponse);
    //     } else {
    //         remote = restaurantController.getRestaurantByURLkey(id , coords.latitude, coords.longitude, uid)
    //         .then(handleResponse);
    //     }

    //     return cache ? $.Deferred().resolve(cache).promise() : remote;
    // },

    getSasl: function (id) {
        var cached = appCache.get('saslData');

        return restaurantController.getRestaurantWithStoredSASL(cached);
    },

    getSaslSummaryByLocation: function (lat, lng) {
        var uid = sessionActions.getCurrentUser().getUID();
        var simulate = configurationActions.getConfigurations().get('simulate');
        var cache =  appCache.fetch('saslSummary', new SaslSummary());

        var remote = restaurantController.getRestaurantSummaryByUIDAndLocation( lat, lng, 'UNDEFINED', uid, simulate)
            .then(function (saslSummary) {
                cache.reset(saslSummary.models);
                return cache;
            });
        return cache.length > 0 ? $.Deferred().resolve(cache).promise() : remote;
    },

    getUserDistanceToRestaurant: function ( restaurant ) {
        return h().distanceBetween(
            geolocation.getPreviousLocation().latitude,
            geolocation.getPreviousLocation().longitude,
            parseFloat( restaurant.get('latitude') ),
            parseFloat( restaurant.get('longitude') ),
            true
        );
    }

};
