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
    this.setLinksForEachDiscount();
    Vent.on('openDiscountByShareUrl', this.openDiscountByShareUrl, this);
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
  },

  openDiscountByShareUrl: function(uuid) {
    var el = this.$el.find('li[data-uuid="' + uuid + '"]').first(),
        index = el.data('slick-index');

    this.$el.find('.body ul').slick('slickGoTo', index);
    Vent.trigger('scrollToBlock', '.promocodes_block');
  },

  showShareBlock: function(e) {
      if (this.animating) return;
      this.animating = true;
      var $target = $(e.currentTarget),
      $el = $target.parent().next(),
      visible = $el.is(':visible'),
      visibleSMS = $el.find('.sms_input_block').is(':visible'),
      height = 50;
      if (visible && visibleSMS) {
          this.$('.sms_input_block').hide();
          height = 120;
      }
      this.changeSlideHeight($el, height);
      $el.slideToggle('slow', _.bind(function() {
          this.animating = false;
      }, this));
  },

  showSMSInput: function(e) {
      if (this.animating) return;
      this.animating = true;
      var $target = $(e.currentTarget),
      $el = $target.parent().find('.sms_input_block');
      this.changeSlideHeight($el, 70);
      $el.find('input').mask('(000) 000-0000');
      $el.slideToggle('slow', _.bind(function() {
          this.animating = false;
      }, this));
  },

  changeSlideHeight: function($target, additional) {
      var $el = $target.parents('.slick-list[aria-live="polite"]'),
          height = $el.height(),
          visible = $target.is(':visible');
      if (visible) additional = -additional;
      $el.css('transition', '0.3s');
      $el.height(height + additional + 'px');
  },

  getLinks: function(uuid) {
      var demo = window.community.demo ? 'demo=true&' : '',
            shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
            '?' + demo + 't=d&u=' + uuid),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
      return links;
  },

  setShareLinks: function($discount) {
      var $block = $discount.find('.promoCode-share-block'),
          uuid = $block.data('uuid'),
          links = this.getLinks(uuid),
          $links = $block.find('a');

      $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
      });
  },

  setLinksForEachDiscount: function() {
      var $discounts = this.$el.find('.promoCode_item');
      $discounts.each(function(index, el){
        var $discount = $(el);
        this.setShareLinks($discount);
      }.bind(this));
  },

  onSendSMS: function(e) {
    console.log('send sms');
    // var $el = this.$el.find('.sms_input_block'),
    //     $target = $(e.currentTarget),
    //     uuid = $target.parent().parent().data('uuid'),
    //     demo = window.community.demo ? 'demo=true&' : '',
    //     shareUrl = window.location.href.split('?')[0] +
    //       '?' + demo + 't=e&u=' + uuid,
    //     val = $target.prev().find('.sms_input').val();

    // loader.showFlashMessage('Sending message to... ' + val);
    // $el.slideUp('slow');
    // contactActions.shareURLviaSMS('DISCOUNT', this.sasl.serviceAccommodatorId,
    //   this.sasl.serviceLocationId, val, uuid, shareUrl)
    //   .then(function(res){
    //     loader.showFlashMessage('Sending message success.');
    //   }.bind(this))
    //   .fail(function(res){
    //     if (res.responseJSON && res.responseJSON.error) {
    //       loader.showFlashMessage(res.responseJSON.error.message);
    //     }
    //   }.bind(this));
  },

});

module.exports = DiscountsView;