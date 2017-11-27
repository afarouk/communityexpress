'use strict';

define([
	'../scripts/Vent',
    '../scripts/appCache',
    './controllers/socketController',
    './controllers/chatController',
    '../scripts/controllers/userController'
	], function(Vent, appCache, socketController, chatController, userController) {

	var Chat = Mn.Application.extend({
		region: '#cmtyx_chat_block',
		initialize: function() {
			socketController._super = this;
			chatController._super = this;
		},
		//different type of application MEDICURIS or MOBILEVOTE APP
		checkSecurity: function() {
			return window.saslData.domainEnum === 'SIMFEL' ||
				   window.saslData.domainEnum === 'MEDICURIS' ||
		           window.saslData.domainEnum === 'MOBILEVOTE';
		},
		isChatApp: function() {
			return window.saslData.domainEnum === 'SIMFEL';
		},
		checkMessagingService: function() {
			return true;//window.saslData.services.messagingService.masterEnabled; //temporary, must get from sasl
		},
		chackIfChatAvailable: function() {
			return this.checkSecurity() && this.checkMessagingService();
		},
		onStart: function(app, device) {
			this.device = device;
			return this;
		},
		chatStart: function() {
			var user = appCache.get('user');
			if (this.chackIfChatAvailable()) {
				this.started = true;
				socketController.start(user.UID);
			}
		},
		chatStop: function() {
			if (this.started && this.chackIfChatAvailable()) {
				this.started = false;
				chatController.chatDestroy();
				socketController.stop();
			}
		},
		onSocketConnected: function() {
			if (this.device === 'mobile') {
				//todo something
			} else {
				var main = this.getRegion();
				chatController.create(main);
			}
		},
		onReconnectAllowed: function () {
			var user = appCache.get('user');
			return user && user.getUID() ? true : false;
		},
		onMessage: function(message) {
			switch (message.signal) {
				case 'FORCED_LOGOUT':
					if (this.device === 'mobile') {
						userController.onForceLogout();
					} else {
						this.dispatcher.get('popups').onForceLogout();
					}
					break;
				case 'MESSAGE_RECEIVED':
					if (this.device === 'mobile') {
						Vent.trigger('onChatMessage', message);
					} else {
						chatController.onChatSignal(message);
					}
					break;
				default:
					
					break;
			}
		}
	});

	return Chat;
});