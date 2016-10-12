/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/message.ejs'),
    h = require('../../globalHelpers'),
    moment = require('moment');

var MessageView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'chat_message',

    moment: moment,

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.toTimeString = this.moment(viewModel.timeStamp).format('LT');
        viewModel.timeStamp = this.moment(viewModel.timeStamp).format('ll');
        // viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template( viewModel ));
        this.addClasses();
        return this;
    },

    addClasses: function() {
        this.model.get('fromUser') ? this.$el.addClass('my_message') : this.$el.addClass('friend_message');
        // if ( !this.model.get('fromUser') || this.model.get('fromUser') === 'false' ){
        //     this.$el.addClass('restaurant');
        // }else{
        //     this.$el.addClass('user');
        // }
    }

});

module.exports = MessageView;
