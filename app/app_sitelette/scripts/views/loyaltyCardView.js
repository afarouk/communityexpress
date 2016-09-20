/*global define*/

'use strict';

var Vent = require('../Vent'),
  sessionActions = require('../actions/sessionActions.js'),
  loyaltyActions = require('../actions/loyaltyActions.js'),
  template = require('ejs!../templates/loyaltyCardView.ejs');

var LoyaltyCardView = Backbone.View.extend({
  name: 'loyalty_card',
  el: '#cmtyx_loyalty_program_block',

  qrCode: '.qr_code_block',
  no_qrCode: '.no_qr_code_block',
  prize: '.prize_container',

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
    if (this.collapsed) {
      $el.slideDown('slow', _.bind(function(){
        this.$('.collapse_btn').removeClass('down');
        this.collapsed = false;
      }, this));
    } else {
      $el.slideUp('slow', _.bind(function(){
        this.$('.collapse_btn').addClass('down');
        this.collapsed = true;
      }, this));
    }
  },

  onLogin: function() {
    var uid = this.getUID();
    this.retrieveLoyaltyStatus(uid);
  },

  onLogout: function() {
    this.$(this.qrCode).slideUp('slow');
    this.$(this.no_qrCode).slideDown('slow');
  },

  retrieveLoyaltyStatus: function(uid) {
    loyaltyActions.updateLoyaltyStatus(uid).then(_.bind(function(resp) {
        /*
        * regardless of loyalty program, update the qr code block since we may use
        * this for other things.
        */
        this.$(this.qrCode).find('.qr_code_container').html('<img src="' + 
          resp.qrcodeURL + '" alt="" style="width:100%">');
        this.$(this.qrCode).slideDown('slow');
        this.$(this.no_qrCode).slideUp('slow');
        this.$(this.qrCode).find('.qr_code_title').text(resp.qrCodeBlockLine1);
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
