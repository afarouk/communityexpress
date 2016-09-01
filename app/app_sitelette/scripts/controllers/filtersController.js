/*global define */

'use strict';

var DomainCollection = require('../collections/domains.js'),
    FilterOptionsCollection = require('../collections/filterOptions.js'),
    DomainModel = require('../models/domainModel.js'),
    gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js');

module.exports = {

    getDomainAndFilterOptions: function () {
        return gateway.sendRequest('getDomainAndFilterOptions').
            then(function (response) {
                var models = response.map(function (item) {
                    return new DomainModel(item.domain, item.filterOptions);
                });
                return new DomainCollection(models);
            });
    },

    getFilterOptions: function () {
        return gateway.sendRequest('getSASLFilterOptions').
            then(function (response) {
                return new FilterOptionsCollection(response);
            });
    },

};
