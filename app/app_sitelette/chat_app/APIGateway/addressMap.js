/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            /*chat app*/
            getUserFriends: ['GET', '/communication/getUserFriends'],
            inviteAndRegister: ['PUT', '/communication/inviteAndRegister'],
            getConversationBetweenUserUser: ['GET', '/communication/getConversationBetweenUserUser'],
            sendMessageFromUserToUser: ['POST', '/communication/sendMessageFromUserToUser'],
            markAsReadUser: ['PUT', '/communication/markAsReadUser'],
            notifyOnActivity: ['PUT', '/communication/notifyOnActivity'],
            registerForPresenceSignals: ['PUT', '/communication/registerForPresenceSignals'],
            /* regular chat */
            getConversationBetweenUserSASL: ['GET', '/communication/getConversationBetweenUserSASL'],
            sendMessageToSASL: ['POST', '/communication/sendMessageToSASL'],
            markAsReadSASLUser: ['PUT', '/communication/markAsReadSASLUser'],
            /*debug*/
            killSocket: ['GET', '/gaming/killSocket'],
        };
    }
};
