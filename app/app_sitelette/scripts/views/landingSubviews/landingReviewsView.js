/*global define*/

'use strict';

var Vent = require('../../Vent'),
    userController = require('../../controllers/userController');

var LandingReviewsView = Backbone.View.extend({
  name: 'landing_reviews',
  el: '#cmtyx_reviews_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .show_more_reviews_btn': 'showMoreReviews'
  },

  initialize: function(options) {
    this.options = options || {};

    this.$el.find('.my-rating').starRating({
        initialRating: 5,
        emptyColor: '#464646',
        strokeColor: '#EECB49',
        activeColor: '#EECB49',
        hoverColor: '#EECB49',
        strokeWidth: 45,
        starSize: 20,
        useGradient: false,
        useFullStars: true
    });
    this.$el.find('.current_rating')
      .text($('.my-rating').starRating('getRating')[0]);
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

  showMoreReviews: function() {
    Vent.trigger('viewChange', 'reviews', [window.community.serviceAccommodatorId, window.community.serviceLocationId] );
  }

});

module.exports = LandingReviewsView;
