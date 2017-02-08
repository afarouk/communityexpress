'use strict';

var gateway = require('../APIGateway/gateway.js'),
    moment = require('moment'),
    sessionActions = require('../actions/sessionActions.js');

var getUser = function () {
    return sessionActions.getCurrentUser();
};

var checkOptions = function(options) {
    if (options.pickupSelected) {
        options.deliveryAddress = null;
    }
    if (options.cashSelected) {
        options.creditCard = null;
    }
};

module.exports = {
    moment: moment,
    placeOrder: function (sa, sl, options) {
        checkOptions(options);
        return gateway.sendRequest('createUserOrder', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID()
        });
    },

    placePromoSingletonOrder: function(sa, sl, options) {
        checkOptions(options);
        return gateway.sendRequest('createUserPromoOrderSingleton', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID()
        });
    },

    placeEventSingletonOrder: function(sa, sl, options) {
        checkOptions(options);
        return gateway.sendRequest('createUserEventOrderSingleton', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl
            }),
            UID: getUser().getUID()
        });
    },

    retrievePromoCodeByUUID: function(uuid) {
        return gateway.sendRequest('retrievePromoCodeByUUID', {
            uuid: uuid,
            UID: getUser().getUID(),
        });
    },

    retrieveRetailPromoCodes: function(sa, sl) {
        return gateway.sendRequest('retrieveRetailPromoCodes', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUser().getUID(),
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
