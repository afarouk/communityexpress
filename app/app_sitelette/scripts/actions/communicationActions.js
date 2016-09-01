/*global define*/

'use strict';

var appCache = require('../appCache'),
    communicationsController = require('../controllers/communicationsController'),
    ConversationModel = require('../models/conversationModel'),
    MessageCollection = require('../collections/messages'),
    userController = require('../controllers/userController'),
    gateway = require('../APIGateway/gateway');

var setUserCommunications = function (user, communications) {
    user.notifications.set(communications.notifications.models);
    user.messages.set(communications.messages.models);
    return {
        notifications: user.notifications,
        messages: user.messages
    };
};

var getCachedConversations = function (sa, sl, uid) {
    return appCache.fetch('conversations', new Backbone.Collection([],{
        model: ConversationModel
    })).where({
        sa: sa,
        sl: sl,
        uid: uid
    })[0];
};

var createConversationCache = function (sa, sl, uid, conversation) {
    var conversationCache = conversation || new MessageCollection() ;
    appCache.get('conversations').unshift(new ConversationModel({
        conversation: conversationCache,
        sa: sa,
        sl: sl,
        uid: uid
    }));
    return conversationCache;
};


module.exports = {

    getConversation: function (sa, sl, uid, count) {

        var cache = getCachedConversations(sa, sl, uid);

        var remote = communicationsController.getConversation(sa, sl, uid, (count || 10))
            .then(function (conversation) {
                if (cache) {
                    cache.conversation.set(conversation.models);
                    return cache.conversation;
                } else {
                    createConversationCache(sa, sl, uid, conversation);
                    return conversation;
                }
            });

        return cache ? $.Deferred().resolve(cache.conversation).promise() : remote;

    },

    getNotificationsByUIDAndLocation: function (lat, lng) {

        var cache = appCache.fetch('notifications', new MessageCollection());

        var uid = sessionActions.getCurrentUser().getUID();

        var remote = gateway.sendRequest('getNotificationsByUIDAndLocation', {
            latitude: lat,
            longitude: lng,
            UID: uid
        }).then(function (notifications) {
            cache.set(notifications.notifications);
            return cache;
        });

        return cache ? $.Deferred().resolve(cache).promise() : remote;
    },

    markAsRead: function (communicationId, offset) {
        var uid = sessionActions.getCurrentUser().getUID();

        if (!uid) return $.Deferred().resolve().promise();

        return gateway.sendRequest('markAsRead', {
            UID: uid,
            payload: {
                communicationId: communicationId,
                offset: offset
            }
        });
    },

    sendMessage: function (sa, sl, messageBody) {
        var sessionActions = require('./sessionActions');
        var uid = sessionActions.getCurrentUser().getUID();
        var cache = getCachedConversations(sa, sl, uid);
        var offset;
        var communicationId;

        if (cache && cache.conversation && cache.conversation.length) {
            // get the most recent message in this conversation
            offset = cache.conversation.at(0).get('offset');
            communicationId = cache.conversation.at(0).get('communicationId');
        }
        return communicationsController.sendMessage(sa, sl, messageBody, uid, offset, communicationId)
            .then(function (message) {
                if (cache) {
                    cache.conversation.unshift(message);
                } else {
                    var cachedConversations = createConversationCache(sa, sl, uid);
                    cachedConversations.unshift(message);
                }
                return message;
            });
    }

};
