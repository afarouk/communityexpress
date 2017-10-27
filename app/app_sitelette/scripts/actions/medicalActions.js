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

    getUserDetailsByPIN: function (authData, securityCode) {
        return gateway.sendRequest('getUserDetailsByPIN', {
            payload: {
                serviceAccommodatorId : authData.serviceAccommodatorId,
                serviceLocationId : authData.serviceLocationId,
                pin: securityCode,
                uid: authData.uid
            }
        });
    },

};
