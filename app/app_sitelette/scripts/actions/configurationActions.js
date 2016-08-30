/*global define*/

'use strict';

var gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js'),
    ConfigurationModel = require('../models/configurationModel.js'),
    config = require('../appConfig.js');

var getConf = function () {
    return appCache.fetch('configurations', new ConfigurationModel());
};

module.exports = {

    getConfigurations: function () {
        return getConf();
    },

    toggleSimulate: function (value) {
        var conf = getConf();
        conf.set('simulate', value);
        if (value === true) {
            config.apiRoot = config.simulateRoot;
        } else {
            config.apiRoot = config.productionRoot;
        }
    },

    getLegendInfo: function () {
        return gateway.sendRequest('getLegendInfo');
    }

};
