/*global define */

'use strict';

var Vent = require('../Vent.js'),
    gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js'),
    MessageCollection = require('../collections/messages.js'),
    NotificationsCollection = require('../collections/notifications.js'),
    CommunicationModel = require('../models/communicationModel.js'),
    ChatApplication = require('../../chat_app/chat.js');

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

    sendMessage: function(sa, sl, messageBody, uid, messageId, communicationId) {
        return gateway.sendRequest('sendMessageToSASL',{
            payload: {
                toServiceAccommodatorId: sa,
                toServiceLocationId: sl,
                messageBody: messageBody,
                authorId: uid,
                inReplyToMessageId: messageId,
                communicationId: communicationId,
            },
            UID: uid,
            simulate: true
        }).then( function (response) {
            return new CommunicationModel(response);
        });
    },

    sendContactUsMessage: function(sa, sl, name, email, messageBody, uid) {
        //TODO should works different way
        return gateway.sendRequest('sendMessageToSASL',{
            payload: {
                toServiceAccommodatorId: sa,
                toServiceLocationId: sl,
                name: name,
                email: email,
                messageBody: messageBody,
            },
            UID: uid
        })
    },

    listenSaslMessages: function() {
        var chat = (new ChatApplication()).start('mobile');
        Vent.on('login_success', this.onLoginSuccess.bind(this, chat));
        Vent.on('logout_success', this.onLogoutSuccess.bind(this, chat));
        Vent.on('onChatMessage', this.onMessageReceived, this);
    },

    onLoginSuccess: function(chat) {
        chat.chatStart();
    },
    onLogoutSuccess: function(chat) {
        chat.chatStop();
    },

    onMessageReceived: function() {
        var user = appCache.get('user');
        user.messageCount = user.messageCount + 1;
        Vent.trigger('update_message_count', user.messageCount);
    },
};
