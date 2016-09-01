/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/post.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var PostView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-review',

    template: template,

    events: {
        'click .comment_button': 'onCommentClick',
        'click .like_button': 'onLikeClick'
    },

    initialize: function (options) {
        this.onComment = options.onComment;
        this.onLike = options.onLike;
        this.listenTo(this.model, 'change', this.render, this);
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    onCommentClick: function () {
        this.onComment(this.model);
    },

    onLikeClick: function () {
        this.onLike(this.model);
    }
});

module.exports = PostView;
