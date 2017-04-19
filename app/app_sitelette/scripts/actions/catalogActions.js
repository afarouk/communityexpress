'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js'),
    appCache = require('../appCache.js'),
    CatalogBasketModel = require('../models/CatalogBasketModel.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    getCatalog: function (sa, sl, catalogId) {
        return gateway.sendRequest('getCatalog', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            catalogId: catalogId
        }).then(function (response) {
            return {
                data: response,
                collection: response
            };
        });
    },

    getCatalogs: function(sa, sl) {
        return gateway.sendRequest('getCatalogs', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID()
        }).then(function(response) {
            return {
                data: response,
                collection: response
            };
        });
    },

    getSubItems: function(params) {
        return gateway.sendRequest('getSubItems', {
            serviceAccommodatorId: params.sa,
            serviceLocationId: params.sl,
            itemId: params.itemId,
            itemVersion: params.itemVersion,
            priceId: params.priceId,
            // simulate: true
        }).then(function(response) {
            return response
        });
    },

    getRoster: function(sa, sl, rosterId) {
        return gateway.sendRequest('getRoster', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID(),
            rosterId:rosterId
        }).then(function(response) {
            return {
                data: response,
                collection: response
            };
        });
    },

    getItemDetailsForPromoItem: function(uuid) {
        return gateway.sendRequest('getItemDetailsForPromoItem', {
            UID: getUID,
            uuid: uuid
        });
    },

    getEventDetails: function(uuid) {
        return gateway.sendRequest('getEventDetails', {
            UID: getUID,
            uuid: uuid
        });
    }
};
