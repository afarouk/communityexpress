/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getAvailableUsers: ['GET', '/gaming/getAvailableUsers'],
            /* chat */
            getConversationBetweenUserSASL: ['GET', '/communication/getConversationBetweenUserSASL'],
            sendMessageToSASL: ['POST', '/communication/sendMessageToSASL'],
            markAsReadSASLUser: ['PUT', '/communication/markAsReadSASLUser'],
            /*debug*/
            killSocket: ['GET', '/gaming/killSocket'],
        };
    }
};
