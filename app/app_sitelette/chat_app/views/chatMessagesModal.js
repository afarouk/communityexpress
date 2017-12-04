/*global define */

'use strict';

define([
	'ejs!../templates/chatMessagesModal.ejs',
	'ejs!../templates/chatMessagesMobileModal.ejs',
	'./chatMessages'
	], function(desktopTemplate, mobileTemplate, ChatMessagesView){
	var ChatMessagesModalView = Mn.View.extend({
		getTemplate: function() {
			if (this.options.device === 'mobile') {
				return mobileTemplate;
			} else {
				return desktopTemplate;
			}
		},
		regions: {
			messages: '[name="chat-messages"]'
		},
		ui: {
			close: 'button.close',
			messagesContainer: '[name="chat-messages"]',
			message: '[name="message"]',
			send: '[name="send"]',
			input: '.message-input',
			text: '.message-text',
			typing: '.user-typing',
			presence: '.user-presence',
			back: '.back-arrow'
		},
		events: {
			'keydown @ui.input': 'onKeyPressed',
			'paste @ui.input': 'onKeyPressed',
			'cut @ui.input': 'onKeyPressed',
			'click @ui.back': 'onBackMobile',
			'blur @ui.input': 'tweakChangeOverflow'
		},
		triggers: {
			'click @ui.close': 'chat:close',
			'click @ui.send': 'chat:send'
		},
		initialize: function() {
		},
		serializeData: function() {
			return {
				otherUserName: this.options.otherUserName
			};
		},
		onRender: function() {
			this.onShowMessages();
		},
		onShowMessages: function() {
			var messages = new ChatMessagesView({
					collection: this.options.collection
				});
			this.showChildView( 'messages', messages );
		},

		onShowMobile: function() {
			$('#cmtyx_landingView').addClass('fullscreen-view');
			this.$el.parent().addClass('active');
			this.overflowInterval = setInterval(function(){
				this.tweakChangeOverflow();
			}.bind(this), 1000);
		},

		tweakChangeOverflow: function() { //tweak for mobile safary issue;
			var overflow = $('#cmtyx_landingView').css('overflow-y');
			if (overflow === 'auto') {
				overflow = 'scroll';
			} else {
				overflow = 'auto';
			}
			// console.log(overflow);
			$('#cmtyx_landingView').css('overflow-y', overflow);
		},

		onBackMobile: function() {
			$('#cmtyx_landingView').removeClass('fullscreen-view');
			this.$el.parent().removeClass('active');
			clearInterval(this.overflowInterval);
		},

		onScrollBottom: function() {
			var $container = this.ui.messagesContainer,
				$ul = $container.find('.chat-messages');

            if ($container.height() > $ul.height()) {
            	this.trigger('chat:scrolled');
            } else {
				$container.scrollTop($ul.height());
				this.ui.messagesContainer.bind('scroll', this.onScroll.bind(this));
			}
		},

		onScroll: function() {
			var $container = this.ui.messagesContainer;

			//trigger only after scroll was stopped
			if (this.chatTimeout) clearTimeout(this.chatTimeout)
			this.chatTimeout = setTimeout(function() {
				this.trigger('chat:scrolled');
			}.bind(this), 1000);
		},

		//expand input hight until 5 rows
		//prepare behavior from it
		onKeyPressed: function() {
			setTimeout(function() {
				var val = this.ui.input.val();
				if (val) {
					this.ui.send.attr('disabled', false);
				} else {
					this.ui.send.attr('disabled', true);
				}
				if (this.device !== 'mobile') {
					this.ui.text.html(val.replace(/\n/g, '<br/>'));
					var lht = parseInt(this.ui.text.css('lineHeight'), 10);
					var lines = Math.round(this.ui.text.prop('scrollHeight') / lht) || 1;
					if (val.slice(-1) === '\n') lines++;
					if (lines > 5) {
						this.ui.message.addClass('long');
					} else {
						this.ui.message.removeClass('long');
					}
					this.ui.message.css('height', lines * 20 + 'px');
				}
				this.onTyping();
			}.bind(this), 10);
			return true;
		},
		//notify other user that typing
		onTyping: function() {
			this.activity = 'TYPING';
			if (this.activityTimeout) {
				clearTimeout(this.activityTimeout);
			}
			this.activityTimeout = setTimeout(function(){
				this.activity = 'IDLING';
			}.bind(this), 2000);

			if (!this.notificationTimeout && this.activity === 'TYPING') {
				this.sendTypingNotification();
			}
		},
		sendTypingNotification: function() {
			if (this.activity === 'TYPING') {
				this.trigger('chat:typing');
				this.notificationTimeout = setTimeout(function(){
					this.sendTypingNotification();
				}.bind(this), 2000);
			} else {
				clearTimeout(this.notificationTimeout);
				this.notificationTimeout = null;
			}
		},
		onOpponentTyping: function() {
			this.ui.typing.addClass('typing');
			if (this.otherTyping) clearTimeout(this.otherTyping);
			this.otherTyping = setTimeout(function(){
				this.ui.typing.removeClass('typing');
			}.bind(this), 2000);
		},
		onOpponentOnline: function(online) {
			if (online) {
				this.ui.presence.addClass('online');
			} else {
				this.ui.presence.removeClass('online');
			}
		}
	});
	return ChatMessagesModalView;
});