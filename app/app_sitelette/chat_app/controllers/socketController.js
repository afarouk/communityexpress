/*global define */

'use strict';

define([
    '../APIGateway/socket-connect'
    ], function(SocketConnect){
    var SocketController = Mn.Object.extend({
        start: function(user){
            this.connector = new SocketConnect(user);
            this.listenTo(this.connector, 'updateStatus', this.updateStatus, this);
            this.listenTo(this.connector, 'onMessage', this.onMessage, this);
        },
        onBeforeDestroy: function(){
            this.stopListening();
            this.connector.destroy();
        },
        updateStatus: function(status) {
            switch (status) {
                case 'Connected':
                    debugger;
                    break;
                case 'Disconnected':
                    debugger
                    break;
            }
        },
        stop: function() {

        },

        onMessage: function(message) {
            console.log(message);
            this.publicController.getSignalManager().onMessage(message);
        }

    });

    return new SocketController();
});
