/*global define */

'use strict';

define([
	'../../scripts/appCache.js',
	'../APIGateway/chatService',
    '../views/chat',
    '../views/chatMessagesModal',
    '../models/messagesCollection'
    ], function(appCache, service, 
    	ChatView, ChatMessagesModalView, MessagesCollection){
    var ChatController = Mn.Object.extend({
    	initialize: function() {
    		this.chatProxy = this._chatProxy();
    	},
		create: function(region) {
			this.view = new ChatView();
			this.listenTo(this.view, 'chat:show', this.onChatShow.bind(this));
			region.show( this.view );
		},
		chatDestroy: function() {
			if (this.view) {
				this.view.destroy();
			}
		},
		resetPosition: function() {
			this.view.triggerMethod('resetPosition');
		},

		onChatShow: function() {
			this.onGetConversation();
		},

		showLoader: function() {
			this.view.ui.loader.addClass('show');
		},

		hideLoader: function() {
			this.view.ui.loader.removeClass('show');
		},

		updateUnreadTotal: function(messages, minus) {
			var total = messages.reduce(function(sum, message){
				var unread = message.get('state').enumText === 'UNREAD' ? 1 : 0;
				return sum + unread;
			}, 0);
			total = total - ( minus || 0 );
			this.view.triggerMethod('updateTotal', total);
		},
		messageFromUser: function(users, message) {
			var messageFrom = message.messageFromUserToUser,
				autor = users.findWhere({
					uid: messageFrom.authorId
				}),
				lastMessageState = autor.get('lastMessageState'),
				unReadMessageCount = autor.get('unReadMessageCount');
			autor.set({
				lastMessage: messageFrom.messageBody,
				timeOfLastMessage: messageFrom.timeStamp,
				unReadMessageCount: ++unReadMessageCount
			});
			lastMessageState.enumText = 'UNREAD';
			lastMessageState.displayText = 'UNREAD';
			this.updateUnreadTotal(users);
		},
		onGetConversation: function() {
			this.showLoader();
			service.getConversationBetweenUserSASL()
				.then(function(conversation){
					this.hideLoader();
	                var messages = new MessagesCollection(conversation.messages);
	                this.createMessagesModal(messages);
	                this.updateUnreadTotal(messages);
	            }.bind(this), function(xhr){
	            	this.hideLoader();
	                // this.publicController.getModalsController().apiErrorPopup(xhr);
	            }.bind(this));
		},
		createMessagesModal: function(messages) {
			var modal = new ChatMessagesModalView({
					otherUserName: appCache.get('saslData').saslName,
					collection: messages
				});

			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'chat:send', this.onMessageSend.bind(this, messages));
			this.listenTo(modal, 'chat:scrolled', this.onChatScrolled.bind(this, messages));
			this.chatProxy.set(this.addMessage.bind(this, messages));
			modal.triggerMethod('scrollBottom');
		},
		onMarkAsRead: function(messages, forMark) {
			var payload,
				idList;
			idList = forMark.map(function(model){
				return {
					communicationId: model.get('communicationId'),
					messageId: model.get('messageId')
				}
			});
			if (forMark.length > 1) {
				payload = {
					idList: idList
				};
			} else {
				payload = {
					communicationId: idList[0].communicationId,
    				messageId: idList[0].messageId,
				};
			}

			service.markAsReadUser({
				payload: payload
			}).then(function(response){
				forMark.forEach(function(model){
					var state = model.get('state');
					state.enumText = 'READ';
					state.displayText = 'Read';
				});
				this.updateUnreadTotal(messages, forMark.length);
            }.bind(this), function(xhr){
                // this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		onChatScrolled: function(messages) {
			var allDefs = [];
			messages.each(function(model){
				var unread = model.get('state').enumText === 'UNREAD',
					$def = $.Deferred();
				if (unread) {
					allDefs.push($def);
					model.trigger('check:unread', $def);
				}
			});
			//mark bunch of messages
			$.when.apply(this, allDefs).done(function(){
				var forMark = [];
				for (var i = 0; i < arguments.length; i++) {
					var model = arguments[i];
					if (model) {
						forMark.push(model);
					};
				}
				//get from models
				if (forMark.length) {
					this.onMarkAsRead(messages, forMark);
				}
			}.bind(this));
		},
		addMessage: function(messages, message) {
			messages.add(message.messageFromUserToUser);
		},
		onMessageSend: function( messages, view) {
			this.showLoader();
			var message = view.ui.input.val();
			if (!message) return;
			service.sendMessageToSASL(message)
				.then(function(response){
					this.hideLoader();
	                messages.add(response);
	                view.ui.input.val('').keydown();
	                view.triggerMethod('scrollBottom');
	            }.bind(this), function(xhr){
	            	this.hideLoader();
	                // this.publicController.getModalsController().apiErrorPopup(xhr);
	            }.bind(this));

		},
		_chatProxy: function(){
			var handler = function(){};
			return {
				set: function(h) {
					handler = h;
				},
				handle: function(message) {
					handler(message);
				}
			}
		},
		onChatSignal: function(message) {
			switch (message.signal) {
				case 'MESSAGE_RECEIVED':
					this.chatProxy.handle(message);
					break;
			}
		}
    });

    return new ChatController();
});
