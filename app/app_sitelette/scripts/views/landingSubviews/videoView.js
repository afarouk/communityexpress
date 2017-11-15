/*global define*/
'use strict';

var VideoView = Backbone.View.extend({
  name: 'video',
  el: '#cmtyx_video_block',

  events: {
    'click .header': 'toggleCollapse'
  },

  initialize: function(options) {
    this.options = options || {};
    this.sasl = window.saslData;
    
    var $el = this.$('.body'),
      visible = $el.is(':visible');
    this.slicked = false;
    if (visible) this.initSlick();

    this.secureType = window.saslData.domainEnum === 'MEDICURIS' ||
        window.saslData.domainEnum === 'MOBILEVOTE' ? window.saslData.domainEnum : false;

    this.resolved();
  },

  afterTriedToLogin: function() {
    if (this.secureType) {
      setTimeout(this.toggleCollapse.bind(this), 200);
    }
  },

  toggleCollapse: function() {
    var $el = this.$('.body');
    $el.slideToggle('slow', _.bind(function(){
        var visible = $el.is(':visible');
        if (visible) {
            $el.parent().find('.collapse_btn').html('&#9650;');
            if (!this.slicked) this.initSlick();
        } else {
            $el.parent().find('.collapse_btn').html('&#9660;');
        }
    }, this));
  },

  onShow: function() {
    this.unslick();

    var $el = this.$('.body'),
      visible = $el.is(':visible');

    this.slicked = false;
    if (visible) this.initSlick();
  },

  unslick: function() {
    var $el = this.$el.find('.body ul'),
        initialized = $el.hasClass('slick-initialized');
    if (!initialized) return;
    $el.find('.slick-arrow-container').remove();
    $el.slick('unslick');
  },

  initSlick: function() {
    this.slicked = true;
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
    this.$el.find('button.slick-arrow.slick-prev').wrap( "<div class='slick-arrow-container left'></div>" );
    this.$el.find('button.slick-arrow.slick-next').wrap( "<div class='slick-arrow-container right'></div>" );
    this.$el.find('button.slick-arrow').text('');
  },

});

module.exports = VideoView;
