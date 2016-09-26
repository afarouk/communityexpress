'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js'),
    geolocation = require('../Geolocation.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

var handleResponse = function (response) {
    return response;
};

module.exports = {
    getContests: function (sa, sl) {
        return gateway.sendRequest('retrieveContestsForClient', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID()
        }).then(function (response) {
            return new Backbone.Collection(response.contests);
        });
    },

    photo: function (id) {
        return gateway.sendRequest('retrievePhotoContest', {
            contestUUID: id,
            UID: getUID()
        }).then(handleResponse);
    },

    poll: function (id) {
        return gateway.sendRequest('retrievePollContest', {
            contestUUID: id,
            UID: getUID()
        }).then(handleResponse);
    },

    photoBySASL: function (sa, sl) {
        return gateway.sendRequest('retrievePhotoContestBySASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID(),
            simulate:true
        }).then(handleResponse);
    },

    pollBySASL: function (sa, sl) {
        return gateway.sendRequest('retrievePollContestBySASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID(),
            simulate:true
        }).then(handleResponse);
    },

    checkin: function (id) {
        return gateway.sendRequest('retrieveCheckinContest', {
            contestUUID: id,
            UID: getUID()
        }).then(handleResponse);
    },

    enterPoll: function (sa, sl, contestUUID, choiseId) {
        return gateway.sendRequest('enterPoll', {
            choice: choiseId,
            uuid: contestUUID,
            UID: getUID(),
            simulate:true
        });
    },

    enterCheckIn: function (sa, sl, contestUUID) {
        var coords =  geolocation.getPreviousLocation();
        return gateway.sendRequest('enterCheckIn', {
            payload: {
                serviceAccommodatorId: sa,
                serviceLocationId: sl,
                contestUUID: contestUUID,
                latitude: coords.latitude,
                longitude: coords.longitude
            },
            UID: getUID()
        });
    },

    enterPhotoContest: function (sa, sl, contestUUID, file, message) {
        return gateway.sendFile('enterPhotoContest', {
            image: file,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            contestUUID: contestUUID,
            UID: getUID(),
            userComment: message
        });
    }
};
