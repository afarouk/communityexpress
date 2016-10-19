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
    },

    getAppointments: function(start, end) {
    	return gateway.sendRequest('getAppointments', {
			start: start,
			end: end,
			underscore: null,
            UID: getUser().getUID()
        });
    },

    bookAppointment: function(bookId, sa, sl) {
    	return gateway.sendRequest('bookAppointment', {
            id: bookId,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUser().getUID()
        });
    }
};