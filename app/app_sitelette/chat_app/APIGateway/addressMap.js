/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getAvailableUsers: ['GET', '/gaming/getAvailableUsers'],
            getConversationBetweenUserUser: ['GET', '/gaming/getConversationBetweenUserUser'],
            sendMessageFromUserToUser: ['POST', '/gaming/sendMessageFromUserToUser'],
            markAsReadUser: ['PUT', '/gaming/markAsReadUser'],
            /* chat */
            getConversationBetweenUserSASL: ['GET', '/communication/getConversationBetweenUserSASL'],
            sendMessageToSASL: ['POST', '/communication/sendMessageToSASL'],
            markAsReadSASLUser: ['PUT', '/communication/markAsReadSASLUser'],
            /*debug*/
            killSocket: ['GET', '/gaming/killSocket'],
        };
    }
};
