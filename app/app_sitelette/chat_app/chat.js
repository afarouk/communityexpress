'use strict';

define([
    '../scripts/appCache.js',
    './controllers/socketController',
    './controllers/chatController',
    '../scripts/controllers/userController'
	], function(appCache, socketController, chatController, userController) {

	var Chat = Mn.Application.extend({
		region: '#cmtyx_chat_block',
		initialize: function() {
			socketController._super = this;
			chatController._super = this;
		},
		//different type of application MEDICURIS or MOBILEVOTE APP
		checkSecurity: function() {
			return window.saslData.domainEnum === 'MEDICURIS' ||
		            window.saslData.domainEnum === 'MOBILEVOTE';
		},
		checkMessagingService: function() {
			return true;//window.saslData.services.messagingService.masterEnabled; //temporary, must get from sasl
		},
		chackIfChatAvailable: function() {
			return this.checkSecurity() && this.checkMessagingService();
		},
		onStart: function() {
			return this;
		},
		chatStart: function(user) {
			if (this.chackIfChatAvailable()) {
				this.started = true;
				socketController.start(user.UID);
			}
		},
		chatStop: function() {
			if (this.started && this.chackIfChatAvailable()) {
				this.started = false;
				chatController.chatDestroy();
			}
		},
		onSocketConnected: function() {
			var main = this.getRegion();
			chatController.create(main);
		},
		onReconnectAllowed: function () {
			var user = appCache.get('user');
			return user && user.getUID() ? true : false;
		},
		onMessage: function(message) {
			switch (message.signal) {
				case 'FORCED_LOGOUT':
					this.dispatcher.get('popups').onForceLogout();
					break;
				default:
					
					break;
			}
		}
	});

	return Chat;
});