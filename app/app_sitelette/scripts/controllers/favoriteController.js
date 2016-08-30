/*global define */

'use strict';

var RestaurantSummaryModel = require('../models/restaurantSummaryModel.js'),
    RestaurantSummaryCollection = require('../collections/restaurantSummaryCollection.js'),
    gateway = require('../APIGateway/gateway.js');

module.exports = {

    getFavoriteSASLSummary: function(UID, lat, lng) {
        return gateway.sendRequest('getFavoriteSASLSummary', {
            UID: UID,
            lat: lat || '',
            lng: lng || ''
        }).then(function (response) {
            return new RestaurantSummaryCollection(response);
        });
    },

    deleteURLFromFavorites: function (UID, urlKey) {
        return gateway.sendRequest('deleteURLFromFavorites', {
            urlKey: urlKey,
            UID: UID
        }).then(function (response) {
            return new RestaurantSummaryModel(response);
        });
    },

    addSASLToFavorites: function (UID, sa, sl) {
        return gateway.sendRequest('addSASLToFavorites', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: UID
        }).then(function (response) {
            return new RestaurantSummaryModel(response);
        });
    }

};
