/*global define*/

'use strict';

var Vent = require('../../Vent');

var PromotionView = Backbone.View.extend({
  name: 'promotion',
  el: '#cmtyx_promotion_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .share_btn_block': 'showShareBlock'
  },

  //TODO functionality

  initialize: function(options) {
    this.options = options || {};

    //slick init
    this.$el.find('.body ul').slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        fade: false,
        cssEase: 'linear',
        slidesToShow: 1
    });
    this.$el.find('button.slick-arrow').css("top", $('#cmtyx_promotion_block .body ul').height() / 2 - 24 + "px");
    this.$el.find('button.slick-prev.slick-arrow').text('').css("border-right-color", $('.cmtyx_color_3').css('background-color'));
    this.$el.find('button.slick-next.slick-arrow').text('').css("border-left-color", $('.cmtyx_color_3').css('background-color'));;
  },

  showShareBlock: function(e) {
    var $target = $(e.currentTarget),
        $el = $target.parent().parent().next();
    $el.slideToggle('slow');
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
  }

});

module.exports = PromotionView;
