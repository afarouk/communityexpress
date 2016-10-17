/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    template = require('ejs!../templates/content/reviews_content.ejs'),
    popupController = require('../controllers/popupController'),
    ListView = require('./components/listView'),
    ReviewView = require('./partials/reviewView'),
    reviewActions = require('../actions/reviewActions');

var ReviewsView = Backbone.View.extend({

    name: 'reviews',

    id: 'cmntyex_reviews',

    events: {
        'click .navbutton_write_review': 'openNewReview',
        'click .next': 'nextPage',
        'click .prev': 'prevPage'
    },

    initialize: function(options) {
        options = options || {};
        this.restaurant = options.restaurant;
        this.getReviews();
        this.pagination = new Backbone.Model();
        this.pagination.set('hasNextReviews', false);
        this.pagination.set('hasPreviousReviews', false);
        this.hideTitle = true;

        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        this.render();

        this.listenTo(this.pagination, 'change', this.updateButtons, this);
    },

    render: function() {
        this.$el.html(template());
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    goBack: function() {
        Vent.trigger('viewChange', 'restaurant', this.restaurant.getUrlKey(), {
            reverse: true
        });
    },

    onShow: function(){
        // this.addEvents({
        //     'click .back': 'triggerLandingView',
        //     'click .navbutton_write_review': 'openNewReview',
        //     'click .next': 'nextPage',
        //     'click .prev': 'prevPage'
        // });
        this.renderReviews();
    },

    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', this.restaurant.getUrlKey(), { reverse: true });
    },

    updateButtons: function () {
        var next = this.$('.next');
        var prev = this.$('.prev');

        if (this.pagination.get('hasNextReviews')) {
            next.show();
        } else {
            next.hide();
        }

        if (this.pagination.get('hasPreviousReviews')) {
            prev.show();
        } else {
            prev.hide();
        }
    },

    getReviews: function (prevId, prevOffset, nextId, nextOffset) {
        loader.show();
        return reviewActions.getReviewsBySASL(this.restaurant.sa(), this.restaurant.sl(), prevId, prevOffset, nextId, nextOffset)
            .then( function (reviews) {
                this.collection.set(reviews.collection.models);
                this.pagination.set('hasNextReviews', reviews.data.hasNextReviews);
                this.pagination.set('hasPreviousReviews', reviews.data.hasPreviousReviews);
                loader.hide();
            }.bind(this), loader.hide);
    },

    prevPage: function () {
        var nextId = this.collection.at(0).get('communicationId');
        var nextOffset = this.collection.at(0).get('offset');
        this.getReviews(null, null, nextId, nextOffset);
    },

    nextPage: function () {
        var prevId = this.collection.at(this.collection.length - 1).get('communicationId');
        var prevOffset = this.collection.at(this.collection.length - 1).get('offset');
        this.getReviews(prevId, prevOffset);
    },

    renderReviews: function() {
        this.$('.cmntyex-reviews_placeholder').html(new ListView({
            ListItemView: ReviewView,
            className: 'cmntyex-review_list',
            collection: this.collection,
            dataRole: 'none',
            update: true,
            parent: this
        }).render().el);
    },

    openNewReview: function () {
        popupController.requireLogIn(null, function() {
            popupController.newReview(this, this.restaurant, {
                action: function (sa, sl, file, title, message, rating) {
                    return reviewActions.addReview(sa, sl, file, title, message, rating)
                        .then(function (review) {
                            this.collection.add(review);
                            return review;
                        }.bind(this));
                }.bind(this),
                imageOptional: true
            });
        }.bind(this));
    }

});

module.exports = ReviewsView;
