/*global define*/

'use strict';

var Vent = require('../Vent'),
    userController = require('../controllers/userController');

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
        initialRating: 3.5,
        strokeColor: '#894A00',
        strokeWidth: 10,
        starSize: 25
    });
    
    this.$el.find('.current_rating')
      .text($('.my-rating').starRating('getRating'));
  },

  toggleCollapse: function() {
    var $el = this.$('.body');
    $el.slideToggle('slow', function(){
        var visible = $(this).is(':visible');
        if (visible) {
            $(this).parent().find('.collapse_btn').removeClass('down');
        } else {
            $(this).parent().find('.collapse_btn').addClass('down');
        }
    });
  },

  showMoreReviews: function() {
    // show more reviews
    var user = userController.getCurrentUser(),
        sasl = user.favorites.at(0);
    Vent.trigger('viewChange', 'reviews', sasl.getUrlKey() );
    // exists for http://localhost/cmt2_lefoodtruck?demo=true&desktopIframe=true
  }

});

module.exports = LandingReviewsView;
