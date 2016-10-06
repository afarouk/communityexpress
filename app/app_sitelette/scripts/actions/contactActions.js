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

    //send share link via sms
    shareURLviaSMS: function(shareType, sa, sl, mobile, uuid, shareURL) {
        var UID = getUID(),
            params = {
            UID: UID,
            payload: {
                shareType: shareType, //[SITELETTE/EVENT/PROMOTION/POLL/CHECKIN/PHOTO/MEDIA]
                shareURL: shareURL,
                serviceAccommodatorId: sa,
                serviceLocationId: sl,
                mobile: mobile, // phone number
                uuid: uuid,
                passCode: 'sitelettes', // ???
                trackingId: UID,
                demo: window.community.demo //check if 'demo=true'
            }
        };
        return gateway.sendRequest('shareURLviaSMS', params);
    },

    //new Contact Us
    sendContactUsEmail: function(contactUsInfo) {
        return gateway.sendRequest('sendContactUsEmail', {
            payload: contactUsInfo
        });
    }

};
