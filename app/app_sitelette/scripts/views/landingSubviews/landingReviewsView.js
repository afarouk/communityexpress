/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    h = require('../../globalHelpers'),
    popupController = require('../../controllers/popupController'),
    reviewActions = require('../../actions/reviewActions'),
    userController = require('../../controllers/userController');

var LandingReviewsView = Backbone.View.extend({
  name: 'landing_reviews',
  el: '#cmtyx_reviews_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .add_review_btn': 'showLeaveReviewBlock',
    // 'click .show_more_reviews_btn': 'showMoreReviews',
    'click .show_more_block': 'showMoreReviews',
    'click .send_review': 'onSendReview',
    'keyup #review_text': 'resizeTextarea',
    'click .add_new_photo_btn': 'onClickAddNewPhoto',
    'click .cancel_review': 'closeNewReview'
  },

  initialize: function(options) {
    this.options = options || {};
    this.rating = 10;

    this.$('.review-rating').starRating({
        initialRating: this.$('.review-rating').attr('initial-rating')/2,
        emptyColor: '#464646',
        strokeColor: '#EECB49',
        activeColor: '#EECB49',
        hoverColor: '#EECB49',
        strokeWidth: 45,
        starSize: 20,
        useGradient: false,
        useFullStars: true,
        readOnly: true
    });
    this.$('.review_current_rating').text(this.$('.review-rating').attr('initial-rating')/2);

    this.initializeMyRating();
  },

  initializeMyRating: function() {
      this.$el.find('.my-rating').starRating({
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
              this.$('.current_rating').text(currentRating);
          }.bind(this)
      });
      this.$el.find('.current_rating').text(5);
  },

  showLeaveReviewBlock: function() {
      this.$('.add_review_btn').slideUp(400, _.bind(function() {
          this.$('.leave_review_block').slideDown();
        //   this.initUploader();
      }, this));
  },

  closeNewReview: function() {
      this.$('.new_review_error').hide();
      this.$('#review_text').val('');
      this.$el.find('.upload_photo').hide();
      this.$('.add_new_block').show();
      this.resizeTextarea();
      this.$('.btn-del').trigger('click');
      this.$('.btn-cancel').trigger('click');
      this.$('.leave_review_block').slideUp(400, _.bind(function() {
          this.$('.add_review_btn').slideDown();
      }, this));
  },

  onClickAddNewPhoto: function(e) {
      this.$('.add_new_block').hide();
      this.$el.find('.upload_photo').show();
      this.initUploader();
  },

  hideLeaveReviewBlock: function() {
      this.refreshReview();
      this.$('.leave_review_block').slideUp(400, _.bind(function() {
          this.$('.add_review_btn').slideDown();
      }, this));
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

  toggleCollapse: function() {
    var $el = this.$('.body');
    $el.slideToggle('slow', function(){
        var visible = $(this).is(':visible');
        if (visible) {
            $(this).parent().find('.collapse_btn').html('&#9650;');
        } else {
            $(this).parent().find('.collapse_btn').html('&#9660;');
        }
    });
  },

  onSendReview: function() {
      this.title = '';
      var message = this.$('#review_text').val(),
          rating = this.rating;
      if (!this.isValid(message, rating)) return;
      popupController.requireLogIn({}, _.bind(function() {
          loader.show('adding review');
          return reviewActions.addReview(window.community.serviceAccommodatorId, window.community.serviceLocationId, this.file, this.title, message, rating)
              .then(_.bind(function(review) {
                  loader.hide();
                  var text = 'Review successfully added',
                      callback = _.bind(this.hideLeaveReviewBlock, this);
                  popupController.textPopup({ text: text }, callback);
              }, this), function(e) {
                  loader.hide();
                  var text = h().getErrorMessage(e, 'error adding review');
                  popupController.textPopup({text: text});
              });
      }, this));
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
      return isValid;
  },

  refreshReview: function() {
      this.$('#review_text').val('');
      this.resizeTextarea();
      this.$('.btn-del').trigger('click');
      this.$('.btn-cancel').trigger('click');
  },

  resizeTextarea: function() {
      this.$('#review_text').css('height', 0);
      var height = this.$('#review_text')[0].scrollHeight + 36;
      this.$('#review_text').css({
          overflow: 'hidden',
          height: height + 'px'
      });
  },

  showMoreReviews: function() {
    Vent.trigger('viewChange', 'reviews', [window.community.serviceAccommodatorId, window.community.serviceLocationId] );
  }

});

module.exports = LandingReviewsView;
