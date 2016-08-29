/*global define */

'use strict';

var appCache = require('../appCache.js'),
    filtersController = require('../controllers/filtersController.js');

module.exports = {

    getDomains: function () {
        var cache = appCache.get('domains');
        if (cache) {
            return $.Deferred().resolve(cache).promise();
        }

        return filtersController.getDomainAndFilterOptions().
            then(function (domains) {
                appCache.set('domains', domains);
                return domains;
            });
    },

    getFilterOptions: function () {
        var cache = appCache.get('filterOptions');
        if (cache) {
            return $.Deferred().resolve(cache).promise();
        }

        return filtersController.getFilterOptions().
            then(function (domains) {
                appCache.set('filterOptions', domains);
                return domains;
            });
    }
};
