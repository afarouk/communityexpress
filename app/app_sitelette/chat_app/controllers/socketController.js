/*global define */

'use strict';

define([
    '../APIGateway/socket-connect'
    ], function(SocketConnect){
    var SocketController = Mn.Object.extend({
        start: function(user){
            this.uid = user;
            this.connector = new SocketConnect(user);
            this.listenTo(this.connector, 'updateStatus', this.updateStatus, this);
            this.listenTo(this.connector, 'onMessage', this.onMessage, this);
        },
        updateStatus: function(status) {
            switch (status) {
                case 'Connected':
                    this._super.onSocketConnected();
                    break;
                case 'Disconnected':
                    this.restart();
                    break;
            }
        },
        stop: function() {
            this.stopListening();
            this.connector.destroy();
        },

        restart: function() {
            this.stop();
            this.start(this.uid);
        },

        onMessage: function(message) {
            console.log(message);
            this._super.onMessage(message);
        }

    });

    return new SocketController();
});
