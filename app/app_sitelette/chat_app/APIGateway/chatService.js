/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../../scripts/appCache'
    ], function(gateway, appCache){
    var ChatService = Mn.Object.extend({
        /* chat application */
        getUserFriends: function() {
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid,
                    groupId: '1',
                    domain: 'SIMFEL'
                };
            return gateway.sendRequest('getUserFriends', params);
        },
        inviteAndRegister: function(payload) {
            var user = appCache.get('user'),
                params = {
                    UID: user.getUID(),
                    payload: _.extend(payload, {
                        serviceAccommodatorId: appCache.sa(),
                        serviceLocationId: appCache.sl(),
                        domain: 'SIMFEL',
                        groupId: '1'
                    })
                };
            return gateway.sendRequest('inviteAndRegister', params);
        },
        sendMessageFromUserToUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user ? user.getUID() : null;
            return gateway.sendRequest('sendMessageFromUserToUser', params);
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
        notifyOnActivity: function(otherUID, type) {
            //type="TYPING|IDLING" 
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid,
                    otherUID: otherUID,
                    type: type,
                    serviceAccommodatorId: appCache.sa(),
                    serviceLocationId: appCache.sl()
                };

            return gateway.sendRequest('notifyOnActivity', params);
        },
        registerForPresenceSignals: function(otherUID) {
            //type="TYPING|IDLING" 
            var user = appCache.get('user'),
                uid = user ? user.getUID() : null,
                params = {
                    UID: uid,
                    otherUID: otherUID,
                    serviceAccommodatorId: appCache.sa(),
                    serviceLocationId: appCache.sl()
                };

            return gateway.sendRequest('registerForPresenceSignals', params);
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
