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

    sendAppURLForSASLToMobileviaSMS: function(sa, sl, phone, contestUUID) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone
        };
        if (contestUUID) {
            params.contestUUID = contestUUID;
        }
        return gateway.sendRequest('sendAppURLForSASLToMobileviaSMS', params);
    },

    //App new
    sendAppURLForSASLToMobileviaSMSPost: function(sa, sl, phone, shareURL) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone,
            payload: {shareURL: shareURL}
        };
        return gateway.sendRequest('sendAppURLForSASLToMobileviaSMSPOST', params);
    },

    //Promo new
    sendPromoURLToMobileviaSMSPOST: function(sa, sl, phone, promoUUID, shareURL) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone,
            promoUUID: promoUUID,
            payload: {shareURL: shareURL}
        };
        return gateway.sendRequest('sendPromoURLToMobileviaSMSPOST', params);
    },
    //Events new
    sendEventURLToMobileviaSMSPOST: function(sa, sl, phone, eventUUID, shareURL) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone,
            eventUUID: eventUUID,
            payload: {shareURL: shareURL}
        };
        return gateway.sendRequest('sendEventURLToMobileviaSMSPOST', params);
    },
    //Poll contest new
    sendPollContestURLToMobileviaSMSPOST: function(sa, sl, phone, contestUUID, shareURL) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone,
            contestUUID: contestUUID,
            payload: {shareURL: shareURL}
        };
        return gateway.sendRequest('sendPollContestURLToMobileviaSMSPOST', params);
    },
    //Photo contest new
    sendPhotoContestURLToMobileviaSMSPOST: function(sa, sl, phone, contestUUID, shareURL) {
        var params = {
            UID: getUID(),
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: phone,
            contestUUID: contestUUID,
            payload: {shareURL: shareURL}
        };
        return gateway.sendRequest('sendPhotoContestURLToMobileviaSMSPOST', params);
    },

    //new Contact Us
    sendContactUsEmail: function(contactUsInfo) {
        return gateway.sendRequest('sendContactUsEmail', {
            payload: contactUsInfo
        });
    }

};
