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
			this.listenTo(this.view, 'chat:scroll', this.scrollBottom.bind(this));
			region.show( this.view );
		},
		scrollBottom: function() {
			this.modal.triggerMethod('scrollBottom');
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

		//.........
		getChatUsers: function() {
			this.showLoader();
			service.getAvailableUsers({
				forChat: true
			}).then(function(response){
				this.hideLoader();
                if (response.count > 0) {
                    this.createChatUsersModal(response);
                } else {
                	//TODO ask Alamgir if this case is possible
                    // this.showEmptyList('leftList', 'No users are present.');
                }
            }.bind(this), function(xhr){
            	this.hideLoader();
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		createChatUsersModal: function(response) {
			var users = new UsersCollection(response.users),
				modal = new ChatUsersModalView({
					collection: users
				});
			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'user:selected', this.onUserSelected.bind(this, users));
			this.chatProxy.set(this.messageFromUser.bind(this, users));
			this.updateUnreadTotal(users);
		},
		onUserSelected: function(users, model) {
			var otherUserName = model.get('userName');
			this.showLoader();
			service.getConversationBetweenUsers({
				otherUserName: otherUserName
			}).then(function(conversation){
				this.hideLoader();
                var messages = new MessagesCollection(conversation.messages);
                this.createMessagesModal(users, otherUserName, messages);
            }.bind(this), function(xhr){
            	this.hideLoader();
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		//.........

		updateUnreadTotal: function(messages) {
			var total = messages.reduce(function(sum, message){
				var unread = message.get('state').enumText === 'UNREAD' && !message.get('fromUser') ? 1 : 0;
				return sum + unread;
			}, 0);
			this.view.triggerMethod('updateTotal', total);
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
			this.modal = new ChatMessagesModalView({
					otherUserName: appCache.get('saslData').saslName,
					collection: messages
				});

			this.view.showChildView( 'modal', this.modal );
			this.listenTo(this.modal, 'chat:send', this.onMessageSend.bind(this, messages));
			this.listenTo(this.modal, 'chat:scrolled', this.onChatScrolled.bind(this, messages));
			this.chatProxy.set(this.addMessage.bind(this, messages));
			this.modal.triggerMethod('scrollBottom');
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
			
			payload = {
				idList: idList
			};
			
			service.markAsReadSASLUser({
				payload: payload
			}).then(function(response){
				forMark.forEach(function(model){
					var state = model.get('state');
					state.enumText = 'READ';
					state.displayText = 'Read';
				});
				this.updateUnreadTotal(messages);
            }.bind(this), function(xhr){
                // this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		onChatScrolled: function(messages) {
			var allDefs = [];
			messages.each(function(model){
				var unread = model.get('state').enumText === 'UNREAD',
					$def = $.Deferred();
				if (unread && !model.get('fromUser')) {
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
			var fromSASL = message.messageFromSASLToUser;
			fromSASL.fromUser = false;
			fromSASL.state = {
				enumText: fromSASL.state //tweak wrong socket signal 
			};
			messages.add(fromSASL);
			this.updateUnreadTotal(messages);
		},
		onMessageSend: function( messages, view) {
			this.showLoader();
			var message = view.ui.input.val();
			if (!message) return;
			service.sendMessageToSASL(message)
				.then(function(response){
					this.hideLoader();
					response.fromUser = true;
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
			this.chatProxy.handle(message);
		}
    });

    return new ChatController();
});
