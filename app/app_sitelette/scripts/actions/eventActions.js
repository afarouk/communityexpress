'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUser = function () {
    return sessionActions.getCurrentUser();
};

module.exports = {
    getEvents: function (options) {
        return gateway.sendRequest('getEventByUUID', {
            eventUUID: options.id,
            UID: getUser().getUID()
        });
    }
};