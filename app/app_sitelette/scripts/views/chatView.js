/*global define*/

'use strict';

var Vent = require('../Vent'),
    viewFactory = require('../viewFactory'),
    loader = require('../loader'),
    template = require('ejs!../templates/content/chat_content.ejs'),
    popupController = require('../controllers/popupController'),
    ListView = require('./components/listView'),
    MessageView = require('./partials/messageView'),
    communicationActions = require('../actions/communicationActions');

var ChatView = Backbone.View.extend({

    name: 'chat',

    id: 'cmntyex_chat',

    events: {
        'click .send_message_button': 'sendMessage'
    },

    initialize: function(options) {
        options = options || {};

        this.user = options.user;
        this.restaurant = options.restaurant;

        this.on('show', this.onShow, this);
        this.render();
    },

    render: function() {
        this.$el.html(template());
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    onShow:  function() {
        this.renderMessages();
        this.listenTo( Vent, 'logout_success', this.goBack, this);
        this.startMessageListening();
        this.$el.bind('scroll', this.onScroll.bind(this));
        this.onScroll();
    },

    renderMessages: function() {
        communicationActions.getConversation(this.restaurant.sa(), this.restaurant.sl())
            .then( function (messages) {
                this.$('.cmntyex-messages_placeholder').html( new ListView({
                    ListItemView: MessageView,
                    className: 'cmntyex-message_list',
                    collection: messages,
                    dataRole: 'none',
                    parent: this
                }).render().el);
            }.bind(this));
    },

    sendMessage: function() {
        var $msg = this.$('.input_container input'),
            val = $msg.val();

        if (val.length <= 0) {
            popupController.textPopup({ text: 'Please, type your message'});
            return;
        }
        loader.show('sending message');
        communicationActions.sendMessage(this.restaurant.sa(), this.restaurant.sl(), val)
            .then(function() {
                $msg.val('');
                loader.hide();
                // popupController.textPopup({text: 'message sent'});
            }, function(e) {
                loader.hide();
                var text = h().getErrorMessage(e, 'Error sending message');
                popupController.textPopup({text: text});
            });
    },

    onScroll: function() {
        //trigger only after scroll was stopped
        if (this.chatTimeout) clearTimeout(this.chatTimeout)
        this.chatTimeout = setTimeout(function() {
            this.onCheckUnread();
        }.bind(this), 1000);
    },

    onCheckUnread: function() {
        //check if message visible
        var blockHeight = this.$el.height() - 50,
            $messages = this.$el.find('.chat_message'),
            unread = [],
            cachedMsgs = communicationActions.getMessages(this.restaurant.sa(), this.restaurant.sl());
        $messages.each(function(index, el){
            var $el = $(el),
                position = $el.position(),
                message = cachedMsgs.at(index);
            if (position.top > 0 && position.top < blockHeight) { //visible ???
                if (!message.get('fromUser') && message.get('state').enumText === 'UNREAD') { //unread from sasl
                    unread.push(cachedMsgs.at(index));
                }
            }
        });
        if (unread.length > 0) {
            this.onMarkAsRead(unread);
        } else {
            this.updateUnreadTotal();
        }
    },

    onMarkAsRead: function(unread) {
        var payload,
            idList;
        idList = unread.map(function(model){
            return {
                communicationId: model.get('communicationId'),
                messageId: model.get('messageId')
            }
        });
        
        payload = {
            idList: idList
        };
        
        communicationActions.markAsRead({
            payload: payload
        }).then(function(response){
            unread.forEach(function(model){
                var state = model.get('state');
                state.enumText = 'READ';
                state.displayText = 'Read';
            });
            this.updateUnreadTotal();
        }.bind(this), function(xhr){
            // this.publicController.getModalsController().apiErrorPopup(xhr);
        }.bind(this));
    },

    updateUnreadTotal: function() {
        var messages = communicationActions.getMessages(this.restaurant.sa(), this.restaurant.sl()),
            total = messages.reduce(function(sum, message){
                var unread = message.get('state').enumText === 'UNREAD' && !message.get('fromUser') ? 1 : 0;
                return sum + unread;
            }, 0);
        this.user.messageCount = total;
        Vent.trigger('update_message_count', total);
    },

    startMessageListening: function() {
        Vent.on('onChatMessage', this.onMessageReceived, this);
    },

    stopMessageListening: function() {
        Vent.off('onChatMessage', this.onMessageReceived);
    },

    onMessageReceived: function(message) {
        var fromSASL = message.messageFromSASLToUser;
        fromSASL.state = {
            enumText: fromSASL.state
        };
        communicationActions.onMessageReceived(this.restaurant.sa(), this.restaurant.sl(), message.messageFromSASLToUser);
        this.onScroll();
    },

    goBack: function() {
        this.stopMessageListening();
        Vent.trigger( 'viewChange', 'restaurant', this.restaurant.getUrlKey());
    }
});

module.exports = ChatView;
