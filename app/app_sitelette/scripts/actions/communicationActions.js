/*global define*/

'use strict';

var appCache = require('../appCache'),
    sessionActions = require('../actions/sessionActions.js'),
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

    getConversation: function (sa, sl, count) {
        var uid = sessionActions.getCurrentUser().getUID(),
            cache = getCachedConversations(sa, sl, uid);

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

    getMessages: function(sa, sl) {
        var uid = sessionActions.getCurrentUser().getUID(),
            cache = getCachedConversations(sa, sl, uid);
        return cache.conversation;
    },

    getNotificationsByUIDAndLocation: function (lat, lng) {
        var cache = appCache.fetch('notifications', new MessageCollection()),
            uid = sessionActions.getCurrentUser().getUID();

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

    markAsRead: function (params) {
        var uid = sessionActions.getCurrentUser().getUID();

        params.UID = uid;

        return gateway.sendRequest('markAsRead', params);
    },

    sendMessage: function (sa, sl, messageBody) {
        var uid = sessionActions.getCurrentUser().getUID(),
            cache = getCachedConversations(sa, sl, uid),
            offset,
            communicationId;

        if (cache && cache.conversation && cache.conversation.length) {
            //TODO doesn't work properly V
            // get the most recent message in this conversation
            // offset = cache.conversation.at(0).get('offset');
            // communicationId = cache.conversation.at(0).get('communicationId');
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
    },

    onMessageReceived: function(sa, sl, message) {
        var uid = sessionActions.getCurrentUser().getUID(),
            cache = getCachedConversations(sa, sl, uid);
        message.fromUser = false; //temporary tweak
        if (cache) {
            cache.conversation.unshift(message);
        } else {
            var cachedConversations = createConversationCache(sa, sl, uid);
            cachedConversations.unshift(message);
        }
    },

    sendContactUsMessage: function(sa, sl, name, email, messageBody) {
        var uid = sessionActions.getCurrentUser().getUID();
        return communicationsController.sendContactUsMessage(sa, sl, name, email, messageBody, uid);
    }

};
