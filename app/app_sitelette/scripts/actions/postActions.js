/*global define*/

'use strict';

var appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    getPostsBySASL: function (sa, sl, prevId, prevOffset, nextId, nextOffset) {
        return gateway.sendRequest('retrievePostsOnSASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            previousId: prevId,
            previousOffset: prevOffset,
            nextId: nextId,
            nextOffset: nextOffset,
            count: 1
        });
    },

    likePost: function (threadUUID, messageID) {
        return gateway.sendRequest('likeDislikePost', {
            threadUUID: threadUUID,
            messageId: messageID,
            like: true,
            UID: getUID()
        });
    },

    postComment: function (sa, sl, file, comment, communicationId) {
        return gateway.sendFile('commentOnPostFromSASL', {
            image: file,
            toServiceAccommodatorId: sa,
            toServiceLocationId: sl,
            postbody: comment,
            authorId: getUID(),
            communicationId: communicationId,
            inReplyToMessageId: 1,
            UID: getUID()
        });
    }
};
