/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            /* chat */
            getConversationBetweenUserSASL: ['GET', '/communication/getConversationBetweenUserSASL'],
            sendMessageToSASL: ['POST', '/communication/sendMessageToSASL'],
            markAsReadUser: ['PUT', '/communication/markAsReadUser'],
            /*debug*/
            killSocket: ['GET', '/gaming/killSocket'],
        };
    }
};
