/*global define*/

'use strict';

var appCache = require('../appCache'),
    gateway = require('../APIGateway/gateway'),
    sessionActions = require('./sessionActions');

var emulate = true;

module.exports = {

    emulateRequest: function(response) {
        var $def = $.Deferred();

        setTimeout(function() {
            $def.resolve(response);
        }, 1000);

        return $def;
    },

    getMedicalSecurityCode: function (UID) {
        if (emulate) {
            return this.emulateRequest({
                securityCode: '123'
            });
        } else {
            return gateway.sendRequest('getMedicalSecurityCode', {
                UID: UID
            });
        }
    },

    approveMedicalSecurityCode: function (UID, securityCode) {
        if (emulate) {
            return this.emulateRequest({
                success: true,
                secondaryID: 'someUId'
            });
        } else {
            return gateway.sendRequest('approveMedicalSecurityCode', {
                UID: getUID(),
                code: securityCode
            });
        }
    },

};
