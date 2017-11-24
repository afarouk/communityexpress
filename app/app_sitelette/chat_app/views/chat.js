/*global define */

'use strict';

define([
	'ejs!../templates/chat.ejs',
	'ejs!../templates/chatBlock.ejs',
	], function(chatModal, chatBlock){
	var ChatView = Mn.View.extend({
		getTemplate: function(){
		    if ( this.isChatApp() ){
		      return chatBlock;
		    } else {
		      return chatModal;
		    }
		},
		regions: {
			users: '#chat-users',
			modal: '#chat-modal'
		},
		ui: {
			container: '.chat-container',
			chatBtn: '[name="chat-btn"]',
			messages: '[name="new_messages_number"]',
			modal: '.modal-content',
			loader: '.chat-loader'
		},
		events: {
			'click @ui.container': 'clickChatBtn'
		},
		onRender: function() {
			this.trigger('chat:show', this);
			if ( !this.isChatApp() ) {
				this.ui.modal.draggable({
					containment: $('#cmtyx_landingView')
				});
			}
		},
		isChatApp: function() {
			return window.saslData.domainEnum === 'SECURECHAT';
		},
		onUpdateTotal: function(total) {
			if (total > 0) {
				this.ui.messages.text(total).addClass('shown');
			}
		},
		clickChatBtn: function() {
			this.ui.modal.show('slow');
			if ( !this.isChatApp() ) {
				$('#cmtyx_chat_block').addClass('chat-hide');
			}
			this.trigger('chat:scroll', this);
			// this.ui.container.hide();
		},
		onChildviewChatClose: function() {
			this.ui.modal.hide('slow');
			$('#cmtyx_chat_block').removeClass('chat-hide');
		},
		onChildviewChatBack: function() {
			this.trigger('chat:show', this);
		},
		onResetPosition: function() {
			setTimeout(function(){
				//force reset position
				this.ui.modal
					.hide('slow')
					.css({
						'top': 0,
						'left': 0
					});
				this.ui.chatBtn.show();
			}.bind(this), 100);
		}
	});
	return ChatView;
});