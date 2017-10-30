/*global define*/

'use strict';

var appCache = require('../appCache'),
    gateway = require('../APIGateway/gateway'),
    sessionActions = require('./sessionActions');

module.exports = {
    medicurisAuthentication: function (fullCode) {
        return gateway.sendRequest('medicurisAuthentication', {
            payload: {
                fullCode: fullCode
            }
        });
    },

    getSASLcodeByPIN: function (authData, securityCode) {
        return gateway.sendRequest('getSASLcodeByPIN', {
            payload: {
                serviceAccommodatorId : authData.serviceAccommodatorId,
                serviceLocationId : authData.serviceLocationId,
                pin: securityCode,
                tempId: authData.tempId
            }
        });
    },

    verifySASLcodeAndRetrieveUID: function (saslCode, authData) {
        return gateway.sendRequest('verifySASLcodeAndRetrieveUID', {
            payload: {
                serviceAccommodatorId : authData.serviceAccommodatorId,
                serviceLocationId : authData.serviceLocationId,
                saslCode: saslCode,
                tempId: authData.tempId
            }
        });
    },

};
