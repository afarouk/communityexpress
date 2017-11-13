/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache'
    ], function(gateway, appCache){
    var ChatService = Mn.Object.extend({
        getAvailableUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getAvailableUsers', params);
        },

        /* chat */
        getConversationBetweenUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getConversationBetweenUserUser', params);
        },

        sendMessageFromUserToUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('sendMessageFromUserToUser', params);
        },

        markAsReadUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('markAsReadUser', params);
        },

        /*debug*/
        killSocket: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };

            return gateway.sendRequest('killSocket', params);
        },
    });
    return new ChatService();
});
