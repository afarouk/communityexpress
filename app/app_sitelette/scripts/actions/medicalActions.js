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

    getMedicalSecureCode: function (UID) {
        if (emulate) {
            return this.emulateRequest({
                secureCode: '123'
            });
        } else {
            return gateway.sendRequest('getMedicalSecureCode', {
                UID: UID
            });
        }
    },

    approveMedicalSecureCode: function (UID, secureCode) {
        if (emulate) {
            return this.emulateRequest({
                success: true
            });
        } else {
            return gateway.sendRequest('approveMedicalSecureCode', {
                UID: getUID(),
                code: secureCode
            });
        }
        //approveMedicalSecureCode
    },

};
