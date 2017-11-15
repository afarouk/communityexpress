'use strict';

define([
    '../scripts/appCache.js',
    './controllers/socketController',
    './controllers/chatController'
	], function(appCache, socketController, chatController) {

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
		onMessage: function() {

		}
	});

	return Chat;
});