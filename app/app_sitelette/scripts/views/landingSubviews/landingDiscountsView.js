/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    contactActions = require('../../actions/contactActions');

var DiscountsView = Backbone.View.extend({
  name: 'discounts',
  el: '#cmtyx_promocodes_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .share_btn_block': 'showShareBlock',
    'click .sms_block': 'showSMSInput',
    'click .sms_send_button': 'onSendSMS',
    'click .promoCode-buybutton': 'onGoToShop'
  },

  initialize: function(options) {
    this.options = options || {};
    this.sasl = window.saslData;
    this.initSlick();
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

  initSlick: function() {
    //slick init
    this.$el.find('.body ul').slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        fade: false,
        cssEase: 'linear',
        slidesToShow: 1,
        adaptiveHeight: true
    });
    this.$el.find('button.slick-arrow.slick-prev').wrap( "<div class='slick-arrow-container left'></div>" );
    this.$el.find('button.slick-arrow.slick-next').wrap( "<div class='slick-arrow-container right'></div>" );
    this.$el.find('button.slick-arrow').text('');
  },

  onShow: function() {
    var $el = this.$el.find('.body ul.gallery');
    $el.find('.slick-arrow-container').remove();
    $el.slick('unslick');
    this.initSlick();
  },

  onGoToShop: function() {
    var $el = this.$('.promoCode-buybutton');
    var promocode = $el.data('promocode');
    console.log(promocode);
  }

});

module.exports = DiscountsView;