/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/message.ejs'),
    h = require('../../globalHelpers');

var MessageView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'chat_message',

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template( viewModel ));
        this.addClasses();
        return this;
    },

    addClasses: function() {
        if ( !this.model.get('fromUser') || this.model.get('fromUser') === 'false' ){
            this.$el.addClass('restaurant');
        }else{
            this.$el.addClass('user');
        }
    }

});

module.exports = MessageView;
