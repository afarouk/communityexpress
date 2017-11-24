/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../../scripts/appCache'
    ], function(gateway, appCache){
    var ChatService = Mn.Object.extend({
        /* chat application */
        getAvailableUsers: function() {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid
                };
            return gateway.sendRequest('getAvailableUsers', params);
        },
        getConversationBetweenUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user ? user.getUID() : null;
            return gateway.sendRequest('getConversationBetweenUserUser', params);
        },

        sendMessageFromUserToUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user ? user.getUID() : null;
            return gateway.sendRequest('sendMessageFromUserToUser', params);
        },
        markAsReadUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user ? user.getUID() : null;
            return gateway.sendRequest('markAsReadUser', params);
        },
        /* sasl chat */
        getConversationBetweenUserSASL: function() {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid,
                    serviceAccommodatorId: appCache.sa(),
                    serviceLocationId: appCache.sl()
                };

            return gateway.sendRequest('getConversationBetweenUserSASL', params);
        },

        sendMessageToSASL: function(message) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid,
                    simulate: true,
                    payload: {
                        messageBody: message,
                        authorId: uid,
                        toServiceAccommodatorId: appCache.sa(),
                        toServiceLocationId: appCache.sl(),
                        urgent: false
                    }
                };
            return gateway.sendRequest('sendMessageToSASL', params);
        },

        markAsReadSASLUser: function(params) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
            params = params || {};
            params.UID = uid;
            return gateway.sendRequest('markAsReadSASLUser', params);
        },

        /*debug*/
        killSocket: function() {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
                params = {
                    UID: uid
                };

            return gateway.sendRequest('killSocket', params);
        },
    });
    return new ChatService();
});
