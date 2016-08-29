/*global define*/

'use strict';

var appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    sendSupportRequest: function (email, subject, description) {
        return gateway.sendRequest('sendCustomerSupportEmail', {
            UID: getUID(),
            payload: {
                replyToEmail: email,
                subject: subject,
                descriptino: description
            }
        });
    },

    sendPromoURLToEmail: function (sa, sl, email, promoUUID) {
        return gateway.sendRequest('sendPromoURLToEmail', {
            UID: getUID(),
            toEmail: email,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            promoUUID: promoUUID
        });
    },

    sendPromoURLToMobile: function (sa, sl, mobile, promoUUID) {
        return gateway.sendRequest('sendPromoURLToMobileviaSMS', {
            UID: getUID(),
            toTelephoneNumber: mobile,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            promoUUID: promoUUID
        });
    },

    sendAppURLForSASLToMobileviaSMS: function(sa, sl, phone) {
        return gateway.sendRequest('sendAppURLForSASLToMobileviaSMS', {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone
        });
    }
};
