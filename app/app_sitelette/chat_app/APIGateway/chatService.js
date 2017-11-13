/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../../scripts/appCache'
    ], function(gateway, appCache){
    var ChatService = Mn.Object.extend({
        getAvailableUsers: function(params) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
            params = params || {};
            params.UID = uid;
            return gateway.sendRequest('getAvailableUsers', params);
        },

        /* chat */
        getConversationBetweenUsers: function(params) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
            params = params || {};
            params.UID = uid;
            return gateway.sendRequest('getConversationBetweenUserUser', params);
        },

        sendMessageFromUserToUser: function(params) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
            params = params || {};
            params.UID = uid;
            return gateway.sendRequest('sendMessageFromUserToUser', params);
        },

        markAsReadUser: function(params) {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null;
            params = params || {};
            params.UID = uid;
            return gateway.sendRequest('markAsReadUser', params);
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
