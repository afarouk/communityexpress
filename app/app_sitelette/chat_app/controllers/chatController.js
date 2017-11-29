/*global define */

'use strict';

define([
	'../../scripts/appCache.js',
	'../APIGateway/chatService',
    '../views/chat',
    '../views/chatMobile',
    '../views/chatUsersModal',
    '../views/chatAddContact',
    '../views/chatMessagesModal',
    '../models/usersCollection',
    '../models/messagesCollection'
    ], function(appCache, service,
    	ChatView, ChatMobileView, ChatUsersModalView, ChatAddContactView, 
    	ChatMessagesModalView, UsersCollection, MessagesCollection){
    var ChatController = Mn.Object.extend({
    	initialize: function() {
    		this.chatProxy = this._chatProxy();
    	},
		create: function(device, region) {
			this.device = device;
			if (device === 'mobile') {
				this.view = new ChatMobileView();
				this.listenTo(this.view, 'chat:show', this.onChatShow.bind(this));
			} else {
				this.view = new ChatView();
				this.listenTo(this.view, 'chat:show', this.onChatShow.bind(this));
				this.listenTo(this.view, 'chat:scroll', this.scrollBottom.bind(this));
			}
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
			if ( this._super.isChatApp() ) {
				this.getUserFriends();
			} else {
				this.onGetConversation();
			}
		},

		showLoader: function() {
			this.view.ui.loader.addClass('show');
		},

		hideLoader: function() {
			this.view.ui.loader.removeClass('show');
		},

		//.........
		getUserFriends: function(friend) {
			this.showLoader();
			service.getUserFriends({
				forChat: true
			}).then(function(response){
				this.hideLoader();
                // if (response.count > 0) {
                this.createChatUsersModal(response, friend);
                // } else {
                // 	//TODO ask Alamgir if this case is possible
                //     // this.showEmptyList('leftList', 'No users are present.');
                // }
            }.bind(this), function(xhr){
            	this.hideLoader();
            }.bind(this));
		},
		createChatUsersModal: function(response, friend) {
			// response.users = []; //for testing
			var users = new UsersCollection(response.users),
				modal = new ChatUsersModalView({
					collection: users
				});
			this.view.showChildView( 'users', modal );
			this.listenTo(modal, 'user:selected', this.onUserSelected.bind(this, users));
			this.listenTo(modal, 'user:add', this.onAddContact.bind(this, users));
			this.chatProxy.set('users', this.messageFromUser.bind(this, users));
			// this.updateUnreadTotal(users);
			if (friend) {
				//start conversation with new friend
				var model = users.findWhere({userName: friend.userName});
				model.trigger('select');
			}
		},
		messageFromUser: function(users, message) {
			var messageFrom = message.messageFromUserToUser,
				author = users.findWhere({
					uid: messageFrom.authorId
				}),
				lastMessageState = author ? author.get('lastMessageState') : null,
				unReadMessageCount = author ? author.get('unReadMessageCount') : null;
			if (messageFrom.authorId === appCache.get('user').getUID()) return;
			if (author) {
				author.set({
					lastMessage: messageFrom.messageBody,
					timeOfLastMessage: messageFrom.timeStamp,
					unReadMessageCount: ++unReadMessageCount
				});
				lastMessageState.enumText = 'UNREAD';
				lastMessageState.displayText = 'UNREAD';
			}
			// this.updateUnreadTotal(users);
		},
		onUserSelected: function(users, model) {
			var otherUserName = model.get('userName');
			this.registerForPresenceSignals(model);
			this.showLoader();
			service.getConversationBetweenUsers({
				otherUserName: otherUserName
			}).then(function(conversation){
				this.hideLoader();
                var messages = new MessagesCollection(conversation.messages);
                this.createMessagesModal(messages, otherUserName, users);
            }.bind(this), function(xhr){
            	this.hideLoader();
                // this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		registerForPresenceSignals: function(model) {
			var otherUID = model.get('uid');
			service.registerForPresenceSignals(otherUID)
				.then(function(friend){
					//.........
	            }.bind(this), function(xhr){
	            	//.........
	            }.bind(this));
		},
		//.........
		onAddContact: function(users) {
			var addContactView = new ChatAddContactView();
			users.trigger('unselect');//unselect selected conversation
			this.view.showChildView( 'modal', addContactView );
			this.listenTo(addContactView, 'chat:send:mobile', this.onMobileSend.bind(this));
			this.listenTo(addContactView, 'chat:send:email', this.onEmailSend.bind(this));
		},
		onMobileSend: function(number, callback) {
			console.log(number);
			this.inviteAndRegister({
				email: null,
				mobile: number
			}, callback);
		},
		onEmailSend: function(email, callback) {
			console.log(email);
			this.inviteAndRegister({
				email: email,
				mobile: null
			}, callback);
		},

		inviteAndRegister: function(payload, callback) {
			this.showLoader();
			service.inviteAndRegister(payload)
				.then(function(friend){
					this.hideLoader();
	                this.getUserFriends(friend);
	            }.bind(this), function(xhr){
	            	this.hideLoader();
	            	callback(xhr);
	                // this.publicController.getModalsController().apiErrorPopup(xhr);
	            }.bind(this));
		},
		//........

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
		createMessagesModal: function(messages, otherUserName, users) {
			this.modal = new ChatMessagesModalView({
					otherUserName: otherUserName ? otherUserName : appCache.get('saslData').saslName,
					collection: messages
				});

			this.view.showChildView( 'modal', this.modal );
			this.listenTo(this.modal, 'chat:send', this.onMessageSend.bind(this, messages, otherUserName));
			this.listenTo(this.modal, 'chat:scrolled', this.onChatScrolled.bind(this, messages));
			this.listenTo(this.modal, 'chat:typing', this.onChatTyping.bind(this, otherUserName, users));
			this.chatProxy.set('messages', this.addMessage.bind(this, messages));
			this.modal.triggerMethod('scrollBottom');
			if (this._super.isChatApp() && this.device === 'mobile') {
				this.modal.triggerMethod('showMobile');
			}
		},
		onChatTyping: function(otherUserName, users){
			if (otherUserName && users.length > 0) {
				var otherUser = users.findWhere({userName: otherUserName});
				if (!otherUser) return;
				service.notifyOnActivity(otherUser.get('uid'), 'TYPING')
					.then(function(friend){
						//.........
		            }.bind(this), function(xhr){
		            	//.........
		            }.bind(this));
			}
		},
		onMarkAsRead: function(messages, forMark) {
			var payload,
				markService = this._super.isChatApp() ? service.markAsReadUser : service.markAsReadSASLUser,
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
			
			markService({
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
				if (model.get('type') === 'no-messages') return;
				var unread = model.get('state').enumText === 'UNREAD',
					$def = $.Deferred();
				if (unread && !model.get('fromUser') && model.get('authorId') !== appCache.get('user').getUID()) {
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
			var chatApp = this._super.isChatApp(),
				from = chatApp ? message.messageFromUserToUser : message.messageFromSASLToUser;
			if (from.authorId === appCache.get('user').getUID()) return;
			from.fromUser = false;
			from.state = {
				enumText: from.state //tweak wrong socket signal 
			};
			messages.add(from);
			this.updateUnreadTotal(messages);
		},
		onMessageSend: function( messages, otherUserName, view) {
			this.showLoader();
			var message = view.ui.input.val(),
				chatApp = this._super.isChatApp(),
				sendService = chatApp ? service.sendMessageFromUserToUser : service.sendMessageToSASL,
				params;
			if (!message) return;
			if (chatApp) {
				params = {
					// simulate: true,
					payload: {
						messageBody: message,
					    urgent: false,
					    userName: otherUserName
					} 
				};
			} else {
				params = message;
			}
			sendService(params)
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
			var handler = {
				'users': function(){},
				'messages': function(){}
			};
			return {
				set: function(n, h) {
					handler[n] = h;
				},
				handle: function(message) {
					handler['users'](message);
					handler['messages'](message);
				}
			}
		},
		onChatMessage: function(message) {
			this.chatProxy.handle(message);
		},
		onOpponentTyping: function() {
			this.modal.triggerMethod('opponentTyping');
		},
		opponentOnline: function(online) {
			this.modal.triggerMethod('opponentOnline', online);
		}
    });

    return new ChatController();
});
