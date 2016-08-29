/*global define*/

'use strict';

var Vent = require('../Vent'),
    viewFactory = require('../viewFactory'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    MessageView = require('./partials/messageView'),
    communicationActions = require('../actions/communicationActions');

var ChatView = PageLayout.extend({

    name: 'chat',

    initialize: function(options) {
        options = options || {};

        this.user = options.user;
        this.restaurant = options.restaurant;

        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    onShow:  function() {
        this.addEvents({
            'click .back': 'triggerLandingView',
            'click .navbutton_write_review': 'openNewMessage'
        });

        this.renderMessages();
        this.listenTo( Vent, 'logout_success', this.triggerLandingView, this);
        this.startPolling();
    },

    onHide: function() {
        this.stopPolling();
    },

    renderMessages: function() {
        communicationActions.getConversation(this.restaurant.sa(), this.restaurant.sl(), this.user.getUID())
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

    openNewMessage: function () {
        this.withLogIn(function () {
            this.openSubview('newMessage', this.restaurant, {
                onSubmit: function (form) {
                    return communicationActions.sendMessage(this.restaurant.sa(), this.restaurant.sl(), form.messageBody);
                }.bind(this)
            });
        }.bind(this));
    },

    triggerLandingView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.restaurant.getUrlKey(), { reverse: true } );
    },

    startPolling: function() {
        console.log('start polling');
        this.runTimer();
    },

    runTimer: function() {
        var self = this;
        this.pollTimer = setTimeout( function() {
                self.poll();
                self.runTimer();
            } ,10000);
    },

    stopPolling: function() {
        console.log('stop polling');
        clearInterval(this.pollTimer);
    },

    poll: function() {
        console.log('polling');
        communicationActions.getConversation(this.restaurant.sa(), this.restaurant.sl(), this.user.getUID());
    },


});

module.exports = ChatView;
