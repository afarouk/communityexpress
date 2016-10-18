/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
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
        'click .prev': 'prevPage',
        'click .cancel_review': 'closeNewReview',
        'click .submit_review': 'onSendReview'
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
        this.trigger('hide');
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

    onHide: function() {
        this.closeNewReview();
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

    initializeRating: function() {
        this.$('.my-rating').starRating({
            initialRating: this.rating || 0,
            emptyColor: '#464646',
            strokeColor: '#EECB49',
            activeColor: '#EECB49',
            hoverColor: '#EECB49',
            strokeWidth: 45,
            starSize: 20,
            useGradient: false,
            useFullStars: true,
            disableAfterRate: false,
            callback: function(currentRating, $el) {
                this.rating = currentRating;
                this.$('.rating_error').slideUp();
                this.$('.set_rating').text(currentRating);
                this.$('.my-rating').starRating('setRating', currentRating);
            }.bind(this)
        });
        this.$('.set_rating').text(this.rating || 0);
    },

    openNewReview: function() {
        this.rating = null;
        this.$('.new_review_body').slideDown('fast', _.bind(this.initializeRating, this));
    },

    closeNewReview: function() {
        this.$('.new_review_body').slideUp();
    },

    onSendReview: function() {
        this.file = 'null';
        this.title = '';
        var message = this.$('.input_container textarea').val(),
            rating = this.rating;
        if (!this.isValid(message, rating)) return;
        loader.show('adding review');
        return reviewActions.addReview(this.restaurant.sa(), this.restaurant.sl(), this.file, this.title, message, rating)
            .then(_.bind(function(review) {
                loader.hide();
                this.closeNewReview();
                this.collection.add(review);
                return review;
            }, this), function(e) {
                loader.hide();
                var text = h().getErrorMessage(e, 'error adding review');
                popupController.textPopup({text: text});
            });
    },

    isValid: function(message, rating) {
        var errors = [];
        if (!message) {
            this.$('.message_error').slideDown('fast', _.bind(function() {
                this.$('.message_error').siblings('textarea').on('focus', _.bind(function() {
                    this.$('.message_error').slideUp();
                }, this));
            }, this));
            errors.push(false);
        }
        if (rating === null) {
            this.$('.rating_error').slideDown();
            errors.push(false);
        }
        var isValid = errors.length > 0 ? false : true;
        return isValid;
    }

});

module.exports = ReviewsView;
