/*global define*/

'use strict';

var template = require('ejs!../../templates/myMessages.ejs'),
    PanelView = require('../components/panelView'),
    MyMessagesItem = require('../partials/myMessages_item');

var MymessagesView = PanelView.extend({

    template: template,

    initialize: function(options){

        this.user = options.user;
        this.$el.attr('id', 'cmntyex_myMessages_panel' );

        this.addEvents({
            'click .back_button': 'openSettings'
        });
    },

    render: function() {
        var self = this;
        this.$el.html(this.template({ pageId: this.pageId }));

        if(this.collection.length < 1){
            this.$el.find('.no_items_message').show();
        }

        var frg = document.createDocumentFragment();
        this.collection.each(function(model){
            frg.appendChild(self.renderItem(model));
        });
        this.$el.find('.my_messages').append(frg);
        return this;
    },

    renderItem: function(item) {
        var li = new MyMessagesItem({ model: item });
        return li.render().el;
    }

});

module.exports = MymessagesView;
