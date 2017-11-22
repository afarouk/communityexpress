/*global define*/

'use strict';

var appCache = require('../appCache'),
    gateway = require('../APIGateway/gateway'),
    sessionActions = require('./sessionActions');

module.exports = {
    securityAuthentication: function(fullCode) {
        var domain = window.saslData.domainEnum;
        if (domain === 'MEDICURIS') {
            return this.medicurisAuthentication(fullCode);
        } else if (domain === 'MOBILEVOTE') {
            return this.voteAuthentication(fullCode);
        } else if (domain === 'SECURECHAT') {
            return this.chatAuthentication(fullCode);
        }
    },

    medicurisAuthentication: function (fullCode) {
        return gateway.sendRequest('medicurisAuthentication', {
            payload: {
                fullCode: fullCode
            }
        });
    },

    voteAuthentication: function (fullCode) {
        return gateway.sendRequest('simfelAuthentication', {
            payload: {
                fullCode: fullCode
            }
        });
    },

    chatAuthentication: function (fullCode) {
        return gateway.sendRequest('simfelAuthentication', {
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
