'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUser = function () {
    return sessionActions.getCurrentUser();
};

module.exports = {
    placeOrder: function (sa, sl, options) {
        return gateway.sendRequest('createUserOrder', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID(),
        });
    },

    // getCreditInfo: function() {
    //     return gateway.sendRequest('getCreditCardTypes');
    // },

    getCreditInfo: function() {
        return gateway.sendRequest('getCreditCardInfo', {
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
