/*global define */

'use strict';

define([
	'moment',
	'ejs!../templates/no-messages.ejs',
	'ejs!../templates/chatMessage.ejs'
	], function(moment, noMesssages, template){
	var NoMessagesView = Mn.View.extend({
		tagName: 'li',
		className: 'no-messages',
		template: noMesssages
	});
	var MessageView = Mn.View.extend({
		tagName: 'li',
		className: '',
		template: template,
		modelEvents: {
			'check:unread': 'onCheckUnread'
		},
		initialize: function(options) {
			//check if uid and authorId equal
			var me = this.model.get('authorId') === this.options.UID;
			if (me) this.$el.addClass('me');
		},
		onCheckUnread: function($def) {
			//check if message visible
			var blockHeight = 480,
				position = this.$el.position();
			if (position.top > 0 && position.top < blockHeight) {
				$def.resolve(this.model);
			} else {
				$def.resolve(false);
			}
		}
	});
	var ChatMessagesView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-messages',
		childView: function(model) {
			if (model.get('type') === 'no-messages') {
				return NoMessagesView;
			} else {
				return MessageView;
			}
		},
		childViewOptions: function() {
			return this.options;
		},
		onChildviewMarkAsRead: function(model) {
			this.trigger('markAsRead', model);
		}
	});

	return ChatMessagesView;
});