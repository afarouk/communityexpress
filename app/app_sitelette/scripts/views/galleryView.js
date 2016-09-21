/*global define*/

'use strict';

var Vent = require('../Vent');

var GalleryView = Backbone.View.extend({
  name: 'gallery',
  el: '#cmtyx_gallery_block',

  events: {
    'click .header': 'toggleCollapse'
  },

  initialize: function(options) {
    this.options = options || {};

    //slick init
    this.$el.find('.gallery').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 700,
        fade: true,
        cssEase: 'linear',
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000
    });
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
  }

});

module.exports = GalleryView;
