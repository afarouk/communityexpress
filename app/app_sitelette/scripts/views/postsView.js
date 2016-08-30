/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    PostView = require('./partials/postView'),
    postActions = require('../actions/postActions'),
    h = require('../globalHelpers');

var PostsView = PageLayout.extend({

    name: 'posts',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.getPosts();
        this.on('show', this.onShow, this);
        this.pagination = new Backbone.Model();
        this.pagination.set('hasNext', false);
        this.pagination.set('hasPrevious', false);

        this.listenTo(this.pagination, 'change', this.updateButtons, this);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerRestaurantView',
            'click .next': 'nextPage',
            'click .prev': 'prevPage'
        });
        this.renderPosts();
    },

    updateButtons: function () {
        var next = this.$('.next');
        var prev = this.$('.prev');

        if (this.pagination.get('hasNext')) {
            next.show();
        } else {
            next.hide();
        }

        if (this.pagination.get('hasPrevious')) {
            prev.show();
        } else {
            prev.hide();
        }
    },

    getPosts: function (prevId, prevOffset, nextId, nextOffset) {
        loader.show();
        return postActions.getPostsBySASL(this.sasl.sa(), this.sasl.sl(),
                                         prevId, prevOffset, nextId, nextOffset)
            .then(function (posts) {
                this.collection.set(posts.posts);
                this.pagination.set('hasNext', posts.hasNext);
                this.pagination.set('hasPrevious', posts.hasPrevious);
                loader.hide();
            }.bind(this), loader.hide);
    },

    renderPosts: function() {
        this.$('.cmntyex-reviews_placeholder').html(new ListView({
            ListItemView: PostView,
            ListItemViewOptions: {
                onComment: this.openCommentPopup.bind(this),
                onLike: this.likePost.bind(this)
            },
            className: 'cmntyex-review_list',
            collection: this.collection,
            dataRole: 'none',
            update: true,
            parent: this
        }).render().el);
    },

    openCommentPopup: function (post) {
        this.withLogIn(function () {
            this.openSubview('upload', this.sasl, {
                hideTitle: true,
                action: function (sa, sl, file, title, message) {
                    return this.addComment(sa, sl, file, message, post);
                }.bind(this),
                imageOptional: true
            });
        }.bind(this));
    },

    prevPage: function () {
        var nextId = this.collection.at(0).get('communicationId');
        var nextOffset = this.collection.at(0).get('offset');
        this.getPosts(null, null, nextId, nextOffset);
    },

    nextPage: function () {
        var prevId = this.collection.at(this.collection.length - 1).get('communicationId');
        var prevOffset = this.collection.at(this.collection.length - 1).get('offset');
        this.getPosts(prevId, prevOffset);
    },

    addComment: function (sa, sl, file, message, post) {
        loader.show('adding comment');

        return postActions.postComment(sa, sl, file, message, post.get('communicationId'))
            .then(function (comment) {
                var comments = post.get('comments');
                comments.push(comment);
                post.set('comments', comments);
                post.trigger('change', post, {});
                loader.showFlashMessage('comment added');
            }.bind(this), function (e) {
                loader.showErrorMessage(e, 'error adding comment');
            });
    },

    likePost: function (post, callback) {
        this.withLogIn(function () {
            loader.show();
            return postActions.likePost(post.get('communicationId'), post.get('offset'))
                .then(function () {
                    loader.hide();
                }.bind(this), function (e) {
                    loader.showErrorMessage(e, 'error liking comment');
                });
        }.bind(this));
    },

    triggerRestaurantView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true });
    },

});

module.exports = PostsView;
