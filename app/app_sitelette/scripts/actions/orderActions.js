'use strict';

var gateway = require('../APIGateway/gateway.js'),
    moment = require('moment'),
    sessionActions = require('../actions/sessionActions.js');

var getUser = function () {
    return sessionActions.getCurrentUser();
};

module.exports = {
    moment: moment,
    placeOrder: function (sa, sl, options) {
        return gateway.sendRequest('createUserOrder', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID()
        });
    },

    createUserOrderSingleton: function(options) {
        return gateway.sendRequest('createUserOrderSingleton', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID()
        });
    },

    validatePromoCode: function(sa, sl, promoCode) {
        var data = this.moment.utc(new Date()).format().replace('Z', ':UTC'); //tweak utc date
        return gateway.sendRequest('validatePromoCode', {
            payload: {
                promoCode : promoCode,
                date: data,
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            },
            UID: getUser().getUID(),
        });
    },

    getOrderPrefillInfo: function() {
        return gateway.sendRequest('getOrderPrefillInfo', {
            UID: getUser().getUID()
            // simulate: true
        });
    },

    getPriceAddons: function(sa, sl) {
        return gateway.sendRequest('getPriceAddons', {
            UID: getUser().getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl
        });
    }
};
