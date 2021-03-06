'use strict';

define([
	'../scripts/Vent',
    '../scripts/appCache',
    '../scripts/loader',
    './controllers/socketController',
    './controllers/chatController',
    '../scripts/controllers/userController'
	], function(Vent, appCache, loader, 
		socketController, chatController, userController) {

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
			var main = this.getRegion();
			if (this.device === 'mobile') {
				if (this.isChatApp()) {
					chatController.create('mobile', main);
				}
			} else {
				chatController.create('desktop', main);
			}
		},
		onReconnectAllowed: function () {
			var user = appCache.get('user');
			return user && user.getUID() ? true : false;
		},
		onWSDisconnected: function(code) {
			if (code === 1006) {
				if (this.device === 'mobile') {
					loader.showFlashMessage('Websockets error!', {
						infinite: true
					});
				} else {
					this.dispatcher.get('popups').showMessage({
						message: 'Websockets error!',
						loader: true,
						infinite: true
					});
				}
			}
		},
		onShowError: function(message) {
			if (this.device === 'mobile') {
				loader.showFlashMessage(message);
			} else {
				this.dispatcher.get('popups').showMessage({
					message: message,
					loader: true
				});
			}
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
						if (this.isChatApp()) {
							chatController.onChatMessage(message);
						} else {
							Vent.trigger('onChatMessage', message);
						}
					} else {
						chatController.onChatMessage(message);
					}
					break;
				case 'OPPONENT_TYPING':
					if (this.device === 'mobile') {
						chatController.onOpponentTyping();
						chatController.opponentOnline(true);
					} else {
						chatController.onOpponentTyping();
						chatController.opponentOnline(true); // <-- temporary for testing
					}
					break;
				case 'OPPONENT_OFFLINE':
                    chatController.opponentOnline(false);
                    break;

                case 'OPPONENT_ONLINE':
                    chatController.opponentOnline(true);
                    break;
				default:
					
					break;
			}
		}
	});

	return Chat;
});