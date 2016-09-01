/*global define*/

'use strict';

var template = require('ejs!../../templates/notification.ejs'),
    PanelView = require('../components/panelView'),
    NotificationView = require('../partials/notificationView'),
    ListView = require('../components/listView'),
    communicationActions = require('../../actions/communicationActions');

var NotificationsView = PanelView.extend({

    template: template,

    id: 'cmntyex_notification_panel',

    initialize: function(options){
        options = options || {};

        this.addEvents({
            'click .close-panel-button': 'shut',
            'panelopen': 'markAsRead'
        });
    },

    render: function() {
        this.$el.html(this.template());
        this.$('.cmntyex-list_container').append(new ListView({
            collection: this.collection,
            update: false,
            ListItemView: NotificationView,
            parent: this
        }).render().el);
        return this;
    },

    markAsRead: function() {
        this.collection.each(function (notification) {
            communicationActions.markAsRead(notification.get('communicationId'), notification.get('offset'));
        }.bind(this));
    }

});

module.exports = NotificationsView;
