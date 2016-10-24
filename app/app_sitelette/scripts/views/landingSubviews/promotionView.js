/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    appCache = require('../../appCache'),
    popupController = require('../../controllers/popupController'),
    saslActions = require('../../actions/saslActions'),
    catalogActions = require('../../actions/catalogActions'),
    CatalogBasketModel = require('../../models/CatalogBasketModel'),
    contactActions = require('../../actions/contactActions');

var PromotionView = Backbone.View.extend({
  name: 'promotion',
  el: '#cmtyx_promotion_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .share_btn_block': 'showShareBlock',
    'click .sms_block': 'showSMSInput',
    'click .sms_send_button': 'onSendSMS',
    'click .promotions-buybutton': 'onBuyItem'
  },

  initialize: function(options) {
    this.options = options || {};
    this.sasl = window.saslData;

    this.initSlick();
    Vent.on('openPromotionByShareUrl', this.openPromotionByShareUrl, this);
    this.setLinksForEachPromotion();
    $( ".promotion_block .header #flag" ).before( "<style>.promotion_block #flag:after { border-bottom-color:" + $('.cmtyx_color_3').css('background-color') + "}</style>" );
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
        slidesToShow: 1
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

  openPromotionByShareUrl: function(uuid) {
    var el = this.$el.find('li[data-uuid="' + uuid + '"]').first(),
        index = el.data('slick-index');

    this.$el.find('.body ul').slick('slickGoTo', index);
    Vent.trigger('scrollToBlock', '.promotion_block');
  },

  showShareBlock: function(e) {
    var $target = $(e.currentTarget),
        $el = $target.parent().parent().next();
    $el.slideToggle('slow');
  },

  showSMSInput: function(e) {
    var $target = $(e.currentTarget),
        $el = $target.parent().find('.sms_input_block');
    $el.slideToggle('slow');
    $el.find('input').mask('(000) 000-0000');
  },

  getLinks: function(uuid) {
      var demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + '?' + demo + 't=p&u=' + uuid),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
      return links;
  },

  setShareLinks: function($promotion) {
      var $block = $promotion.find('.promotion-share-block'),
          uuid = $block.data('uuid'),
          links = this.getLinks(uuid),
          $links = $block.find('a');

      $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
      });
  },

  setLinksForEachPromotion: function() {
      var $promotions = this.$el.find('.promotions-item');
      $promotions.each(function(index, el){
        var $promotion = $(el);
        this.setShareLinks($promotion);
      }.bind(this));
  },

  onSendSMS: function(e) {
    var $el = this.$el.find('.sms_input_block'),
        $target = $(e.currentTarget),
        uuid = $target.parent().parent().data('uuid'),
        demo = window.community.demo ? 'demo=true&' : '',
        shareUrl = window.location.href.split('?')[0] +
          '?' + demo + 't=p&u=' + uuid,
        val = $target.prev().find('.sms_input').val();

    loader.showFlashMessage('Sending message to... ' + val);
    $el.slideUp('slow');
    contactActions.shareURLviaSMS('PROMOTION', this.sasl.serviceAccommodatorId,
      this.sasl.serviceLocationId, val, uuid, shareUrl)
      .then(function(res){
        loader.showFlashMessage('Sending message success.');
      }.bind(this))
      .fail(function(res){
        if (res.responseJSON && res.responseJSON.error) {
          loader.showFlashMessage(res.responseJSON.error.message);
        }
      }.bind(this));
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

  onBuyItem: function(e) {
      Vent.trigger('viewChange', 'singleton', {
          type: 'PROMO',
          uuid: $(e.target).data('uuid'),
          backToRoster: false,
          backToCatalogs: false,
          backToCatalog: false,
          backToSingleton: true
      });
  },

  triggerOrder : function(sasl) {
      popupController.requireLogIn(this.sasl, function() {
          Vent.trigger('viewChange', 'address', {
              id: sasl.getUrlKey(),
              catalogId: 'CATALOG',
              backToCatalog: false,
              backToCatalogs: false,
              backToRoster: false
          }, {
              reverse : true
          });
      }.bind(this));
  }

});

module.exports = PromotionView;
