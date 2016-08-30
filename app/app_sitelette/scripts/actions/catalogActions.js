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
};
