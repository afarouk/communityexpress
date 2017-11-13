'use strict';

define([
    '../scripts/appCache.js',
    './controllers/socketController'
	], function(appCache, SocketController) {

	var Chat = Mn.Object.extend({
		initialize: function() {

		},
		onStart: function(user) {
			this.started = true;
			// SocketController.start(user);
		},
		onStop: function() {
			if (this.started) {
				this.started = false;
			}
		},
	});

	return Chat;
});