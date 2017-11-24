/*global define */

'use strict';

define([
	'../../scripts/appCache.js',
	'../APIGateway/chatService',
    '../views/chat',
    '../views/chatUsersModal',
    '../views/chatMessagesModal',
    '../models/usersCollection',
    '../models/messagesCollection'
    ], function(appCache, service,
    	ChatView, ChatUsersModalView, ChatMessagesModalView, UsersCollection, MessagesCollection){
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
			if ( this._super.isChatApp() ) {
				this.getChatUsers();
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
                var resp = '{"users":[{"userName":"member0","uid":"user20.781305772384780045","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":2,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member1","uid":"user21.7578346144526449638","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":2,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member2","uid":"user22.6662439130873646901","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member3","uid":"user23.3461576254527693463","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":0,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member4","uid":"user24.5128921143405809408","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":0,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member5","uid":"user25.6477315059918792364","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":4,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member6","uid":"user26.7804416392944027503","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":4,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member7","uid":"user27.6119357015922301005","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":4,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member8","uid":"user28.8988186142143867652","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":0,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member9","uid":"user29.7840256569276561209","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":3,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member10","uid":"user30.3821758555792807572","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member11","uid":"user31.355177705204454505","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member13","uid":"user33.6986583253764309891","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member14","uid":"user34.5492526087766429635","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member15","uid":"user35.8261657968494859314","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":1,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member16","uid":"user36.6050055426457441958","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":"This is a random message...","lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":2,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member17","uid":"user37.5312849002850936947","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":3,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member18","uid":"user38.4163954949559135759","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":1,"enumText":"UNREAD","displayText":"Unread"},"unReadMessageCount":2,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"},{"userName":"member19","uid":"user39.498401029833846712","presence":"UNDEFINED","imageURL":"https://communitylive.co/apptsvc/static/images/placeholder_200x200.png","email":null,"telephone":null,"lastMessage":null,"lastMessageState":{"id":3,"enumText":"READ","displayText":"Read"},"unReadMessageCount":0,"timeOfLastMessage":"2017-11-24T08:05:18:UTC"}],"count":19}';
                var parsed = JSON.parse(resp);
                this.createChatUsersModal(parsed);
            }.bind(this));
		},
		createChatUsersModal: function(response) {
			var users = new UsersCollection(response.users),
				modal = new ChatUsersModalView({
					collection: users
				});
			this.view.showChildView( 'users', modal );
			this.listenTo(modal, 'user:selected', this.onUserSelected.bind(this, users));
			this.chatProxy.set('users', this.messageFromUser.bind(this, users));
			// this.updateUnreadTotal(users);
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
			// this.updateUnreadTotal(users);
		},
		onUserSelected: function(users, model) {
			var otherUserName = model.get('userName');
			this.showLoader();
			service.getConversationBetweenUsers({
				otherUserName: otherUserName
			}).then(function(conversation){
				this.hideLoader();
                var messages = new MessagesCollection(conversation.messages);
                // this.createMessagesModal(users, otherUserName, messages);
                this.createMessagesModal(messages, otherUserName);
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
		createMessagesModal: function(messages, otherUserName) {
			this.modal = new ChatMessagesModalView({
					otherUserName: otherUserName ? otherUserName : appCache.get('saslData').saslName,
					collection: messages
				});

			this.view.showChildView( 'modal', this.modal );
			this.listenTo(this.modal, 'chat:send', this.onMessageSend.bind(this, messages, otherUserName));
			this.listenTo(this.modal, 'chat:scrolled', this.onChatScrolled.bind(this, messages));
			this.chatProxy.set('messages', this.addMessage.bind(this, messages));
			this.modal.triggerMethod('scrollBottom');
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
			var chatApp = this._super.isChatApp(),
				from = chatApp ? message.messageFromUserToUser : message.messageFromSASLToUser;
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
					payload: {
						messageBody: message,
					    urgent: false,
					    userName: otherUserName,
					    // simulate: true
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
		onChatSignal: function(message) {
			this.chatProxy.handle(message);
		}
    });

    return new ChatController();
});
