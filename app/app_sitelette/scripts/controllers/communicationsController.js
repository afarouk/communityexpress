/*global define */

'use strict';

var gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js'),
    MessageCollection = require('../collections/messages.js'),
    NotificationsCollection = require('../collections/notifications.js'),
    CommunicationModel = require('../models/communicationModel.js');

var getUID = function () {
    return appCache.get('user') ? appCache.get('user').getUID() : '';
};

var setCommunications = function (response) {
    return {
        notifications: new NotificationsCollection(response.notifications),
        messages: new MessageCollection(response.messages)
    };
};

module.exports = {

    getCommunicationsForUser: function (uid) {
        return gateway.sendRequest('getCommunicationsForUser', {
            UID: uid
        }).then(setCommunications);
    },

    getConversation: function (sa, sl, uid, count) {
        return gateway.sendRequest('fetchConversation', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: uid,
            count: count || 10
        }).then(function (response) {
            return new MessageCollection(response.messages);
        });
    },

    sendMessage: function(sa, sl, messageBody, uid, offset, communicationId) {
        return gateway.sendRequest('sendMessageToSASL',{
            payload: {
                toServiceAccommodatorId: sa,
                toServiceLocationId: sl,
                messageBody: messageBody,
                authorId: uid,
                inReplyToCommunicationId: offset,
                communicationId: communicationId,
            },
            UID: uid
        }).then( function (response) {
            return new CommunicationModel(response);
        });
    }
};
