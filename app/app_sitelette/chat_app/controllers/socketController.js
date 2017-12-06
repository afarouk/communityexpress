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
        updateStatus: function(status, code) {
            switch (status) {
                case 'Connected':
                    this._super.onSocketConnected();
                    break;
                case 'Disconnected':
                    if(this._super.onReconnectAllowed()) {
                        this.restart(code);
                    }
                    break;
            }
        },
        stop: function() {
            this.stopListening();
            this.connector.destroy();
        },

        restart: function(code) {
            this._super.onWSDisconnected(code);
            setTimeout(function(){
                this.stop();
                this.start(this.uid);
            }.bind(this), 2000);
        },

        onMessage: function(message) {
            console.log(message);
            this._super.onMessage(message);
        }

    });

    return new SocketController();
});
