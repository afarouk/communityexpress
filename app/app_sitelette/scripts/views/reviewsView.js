/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
    template = require('ejs!../templates/content/reviews_content.ejs'),
    popupController = require('../controllers/popupController'),
    ListView = require('./components/listView'),
    ReviewView = require('./partials/reviewView'),
    reviewActions = require('../actions/reviewActions');

var ReviewsView = Backbone.View.extend({

    name: 'reviews',

    id: 'cmntyex_reviews',

    events: {
        'click .add_new_photo_btn': 'onClickAddNewPhoto',
        'click .navbutton_write_review': 'openNewReview',
        'click .next': 'nextPage',
        'click .prev': 'prevPage',
        'click .cancel_review': 'closeNewReview',
        'click .submit_review': 'onSendReview',
        'keyup .input_container textarea': 'resizeTextarea'
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
            initialRating: 5,
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
                this.rating = currentRating * 2;
                this.$('.rating_error').slideUp();
                this.$('.set_rating').text(currentRating);
            }.bind(this)
        });
        this.$('.set_rating').text(5);
    },

    openNewReview: function() {
        this.rating = 10;
        var template = '<div class="my-rating"></div><div class="rating_number"><span class="set_rating"></span><span>/5</span></div>';
        this.$('.rating_block').html(template);
        this.$('.navbutton_write_review').slideUp(400, _.bind(function() {
            this.$('.new_review_body').slideDown(400, _.bind(this.initializeRating, this));
        }, this));
    },

    closeNewReview: function() {
        this.$('.new_review_error').hide();
        this.$('.input_container textarea').val('');
        this.$el.find('.upload_photo').hide();
        this.$('.add_new_block').show();
        this.resizeTextarea();
        this.$('.btn-del').trigger('click');
        this.$('.btn-cancel').trigger('click');
        this.$('.new_review_body').slideUp(400, _.bind(function() {
            this.$('.navbutton_write_review').slideDown();
        }, this));
    },

    resizeTextarea: function() {
        this.$('.input_container textarea').css('height', 0);
        var height = this.$('.input_container textarea')[0].scrollHeight + 22;
        this.$('.input_container textarea').css({
            overflow: 'hidden',
            height: height + 'px'
        });
    },

    onClickAddNewPhoto: function(e) {
        this.addNewPhoto = true;
        this.$('.add_new_block').hide();
        this.$el.find('.upload_photo').show();
        this.initUploader();
    },

    initUploader: function() {
        var that = this;
        this.$el.find('.dropzone').html5imageupload({
            ghost: false,
            save: false,
            canvas: true,
            data: {},
            resize: false,
            onSave: this.onSaveImage.bind(this),
            onAfterSelectImage: function(){
                $(this.element).addClass('added');
            },
            onToolsInitialized: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterProcessImage: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterCancel: function() {
                $(this.element).removeClass('added').css('height', '100px');
                that.file = null;
            }
        });
    },

    onSaveImage: function(image) {
        this.file = h().dataURLtoBlob(image.data);
    },

    onSendReview: function() {
        // this.file = 'null';
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
        var isValid = true;
        if (!message) {
            this.$('.message_error').slideDown('fast', _.bind(function() {
                this.$('.message_error').siblings('textarea').on('focus', _.bind(function() {
                    this.$('.message_error').slideUp();
                }, this));
            }, this));
            isValid = false;
        }
        if (rating === null) {
            this.$('.rating_error').slideDown();
            isValid = false;
        }
        return isValid;
    }

});

module.exports = ReviewsView;
