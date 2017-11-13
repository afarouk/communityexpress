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
		onStart: function() {
			return this;
		},
		chatStart: function(user) {
			this.started = true;
			socketController.start(user.UID);
		},
		chatStop: function() {
			if (this.started) {
				this.started = false;
			}
		},
		onSocketConnected: function() {
			var main = this.getRegion();
			// chatController.create(main);
		},
		onMessage: function() {

		}
	});

	return Chat;
});