/*global define*/

'use strict';

var Vent = require('../../Vent'),
  loader = require('../../loader'),
  contactActions = require('../../actions/contactActions'),
  sessionActions = require('../../actions/sessionActions.js'),
  loyaltyActions = require('../../actions/loyaltyActions.js'),
  template = require('ejs!../../templates/landingSubviews/loyaltyCardView.ejs'),
  Cookies = require('../../../../vendor/scripts/js.cookie');

var LoyaltyCardView = Backbone.View.extend({
  name: 'loyalty_card',
  el: '#cmtyx_loyalty_program_block',

  qrCode: '.qr_code_block',
  no_qrCode: '.no_qr_code_block',
  prize: '.prize_container',
  status: '.loyalty_status',

  events: {
    'click .refresh_button_style1': 'refresh',
    'click .header': 'toggleCollapse',
    'click .share_btn_block': 'showShareBlock',
    'click .sms_block': 'showSMSInput',
    'click .sms_send_button': 'onSendSMS'
  },

  initialize: function(options) {
    this.loyaltyProgram = saslData.loyaltyProgram || {};
    this.options = options || {};
    this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
    Vent.on('login_success', this.onLogin, this);
    Vent.on('logout_success', this.onLogout, this);
    this.render(this.loyaltyProgram);
    this.setShareLinks();
  },

  render: function(loyaltyProgram) {
    this.$el.html(template(loyaltyProgram));
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

  afterTriedToLogin: function() {
    var uid = this.getUID();
    if (!uid) {
      this.resolved();
    }
  },

  onLogin: function() {
    var uid = this.getUID();
    this.retrieveLoyaltyStatus(uid);
  },

  onLogout: function() {
    this.$(this.qrCode).slideUp('slow');
    this.$(this.no_qrCode).slideDown('slow');
    this.$(this.status).text('');
    $('#loyalty-bar-code').removeClass('visible').html('');
    $('#cmtyx_header_qrCode_button').removeClass('visible pulse');
  },

  retrieveLoyaltyStatus: function(uid) {
    loyaltyActions.updateLoyaltyStatus(uid).then(_.bind(function(resp) {
        /*
        * regardless of loyalty program, update the qr code block since we may use
        * this for other things.
        */
        if (resp.hasLoyaltyProgram) {
          var content = '<div>'+ resp.loyaltyBlockLine1 +'</div><div>'+
            resp.loyaltyBlockLine2 +'</div><div>' + resp.loyaltyBlockLine3 + '</div>';
          this.$(this.status).html(content);
        }
        $('#cmtyx_header_qrCode_button').addClass('visible pulse');

        $('#loyalty-bar-code').html('<img src="' +
          resp.qrcodeURL + '" alt="" >');
        this.$(this.qrCode).slideDown('slow', function(){
          this.resolved();
        }.bind(this));
        this.$(this.no_qrCode).slideUp('slow');
        this.$(this.qrCode).find('.qr_code_title.title').text(resp.qrCodeBlockLine1);
        this.$(this.qrCode).find('.qr_code_title.info').text(resp.qrCodeBlockLine2);
        if (!Cookies.get('cmxQrCodeExpanded')) {
          $('#cmtyx_header_qrCode_button').click();
          Cookies.set('cmxQrCodeExpanded', true);
        }
    }, this));

  },

  getUID: function () {
    return sessionActions.getCurrentUser().getUID();
  },

  refresh: function(options) {
    Vent.trigger('forceSignin');
    /* handler for refresh button.
      if user is not logged in, show login
      popup, then call retrieveLoyaltyStatus above */
    console.log("loyalty card refresh button clicked");
  },

  showShareBlock: function() {
      var $el = this.$el.find('.share_block');
      $el.slideToggle('slow');
  },

  showSMSInput: function() {
      var $el = this.$el.find('.sms_input_block');
      $el.slideToggle('slow');
      $el.find('input').mask('(000) 000-0000');
  },

  getLinks: function() {
      var demo = window.community.demo ? 'demo=true&' : '',
        shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
          '?' + demo + 't=y&u=' + this.loyaltyProgram.loyaltyUUID),
        links = [
            '',
            'mailto:?subject=&body=' + shareUrl,
            'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
            'https://twitter.com/intent/tweet?text=' + shareUrl
        ];
      return links;
  },

  setShareLinks: function() {
      var $block = this.$el.find('.share_block'),
        links = this.getLinks(),
        $links = $block.find('a');

      $links.each(function(index){
        var link = $(this);
        link.attr('href', links[index]);
      });
  },

  onSendSMS: function(e) {
      var $el = this.$el.find('.sms_input_block'),
          $target = $(e.currentTarget),
          uuid = this.loyaltyProgram.loyaltyUUID,
          demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.location.href.split('?')[0] + 
            '?' + demo + 't=p&u=' + uuid,
          val = $target.prev().val(); //(650) 617-3439

      loader.showFlashMessage('Sending message to... ' + val);
      $el.slideUp('slow');
      contactActions.shareURLviaSMS('LOYALTY', this.sasl.serviceAccommodatorId, 
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

});

module.exports = LoyaltyCardView;
