/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    reviewActions = require('../../actions/reviewActions'),
    userController = require('../../controllers/userController');

var LandingReviewsView = Backbone.View.extend({
  name: 'landing_reviews',
  el: '#cmtyx_reviews_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .show_more_reviews_btn': 'showMoreReviews',
    'click .send_review_btn': 'onSendReview'
  },

  initialize: function(options) {
    this.options = options || {};
    this.rating = 10;

    this.initializeRating();
  },

  initializeRating: function() {
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
                  this.refreshReview();
                  var text = 'Review successfully added',
                      callback = _.bind(this.showMoreReviews, this);
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
  },

  showMoreReviews: function() {
    Vent.trigger('viewChange', 'reviews', [window.community.serviceAccommodatorId, window.community.serviceLocationId] );
  }

});

module.exports = LandingReviewsView;
