/*global define*/

'use strict';

var Vent = require('../Vent'),
 loader = require('../loader');

var LoyaltyCardView = Backbone.View.extend({
 name: 'loyalty_card',
 el: '#cmtyx_loyalty_program_block',

 events: {
  'click .refresh_button_style1': 'refresh',

 },

 initialize: function(options) {
  options = options || {};
 },
 render: function(data) {
  return this;
 },

 /* TODO */
 retrieveLoyaltyStatus: function(options) {
  /* Check if user is logged in.
    If user is logged in then
    make API call to get custom QR code and
    uer status related to this SASL. */

 },

 refresh: function(options) {
  /* handler for refresh button.
    if user is not logged in, show login
    popup, then call retrieveLoyaltyStatus above */
    console.log("loyalty card refresh button clicked");
 }

});

module.exports = LoyaltyCardView;
