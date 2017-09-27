/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache');

var AppointmentsView = Backbone.View.extend({
  name: 'appointments_block',
  el: '#cmtyx_appointments_block',

  events: {
    'click .header': 'toggleCollapse',
  },

  initialize: function(options) {
    this.options = options || {};
    this.sasl = window.saslData;

    this.resolved();
  },

  onShow: function() {

  },

  toggleCollapse: function(callback) {
    var $el = this.$('.body');
    $el.slideToggle('slow', _.bind(function() {
        var visible = $el.is(':visible');
        if (visible) {
            $el.parent().find('.collapse_btn').html('&#9650;');
            if (typeof callback === 'function') callback();
        } else {
            $el.parent().find('.collapse_btn').html('&#9660;');
        }
    }, this));
  }

});

module.exports = AppointmentsView;
