/*global define*/

'use strict';

var Vent = require('../../Vent'),
  sessionActions = require('../../actions/sessionActions.js'),
  loyaltyActions = require('../../actions/loyaltyActions.js'),
  template = require('ejs!../../templates/landingSubviews/loyaltyCardView.ejs');

var LoyaltyCardView = Backbone.View.extend({
  name: 'loyalty_card',
  el: '#cmtyx_loyalty_program_block',

  qrCode: '.qr_code_block',
  no_qrCode: '.no_qr_code_block',
  prize: '.prize_container',
  status: '.loyalty_status',

  events: {
    'click .refresh_button_style1': 'refresh',
    'click .header': 'toggleCollapse'
  },

  initialize: function(options) {
    var loyaltyProgram = saslData.loyaltyProgram || {};
    this.options = options || {};
    Vent.on('login_success', this.onLogin, this);
    Vent.on('logout_success', this.onLogout, this);
    // loyaltyProgram.hasLoyaltyProgram = false;
    // loyaltyProgram.status  = 'You have made 3 of 10 purchases';
    this.render(loyaltyProgram);
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

  onLogin: function() {
    var uid = this.getUID();
    this.retrieveLoyaltyStatus(uid);
  },

  onLogout: function() {
    this.$(this.qrCode).slideUp('slow');
    this.$(this.no_qrCode).slideDown('slow');
    this.$(this.status).text('');
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
        this.$(this.qrCode).find('.qr_code_container').html('<img src="' + 
          resp.qrcodeURL + '" alt="" style="width:100%">');
        this.$(this.qrCode).slideDown('slow');
        this.$(this.no_qrCode).slideUp('slow');
        this.$(this.qrCode).find('.qr_code_title.title').text(resp.qrCodeBlockLine1);
        this.$(this.qrCode).find('.qr_code_title.info').text(resp.qrCodeBlockLine2);
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
  }

});

module.exports = LoyaltyCardView;
