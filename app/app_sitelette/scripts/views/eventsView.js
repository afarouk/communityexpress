/*global define*/

'use strict';

var Vent = require('../Vent');

var EventsView = Backbone.View.extend({
  name: 'events',
  el: '#cmtyx_events_block',

  events: {
    'click .header': 'toggleCollapse'
  },

  initialize: function(options) {
    this.options = options || {};
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
  }

});

module.exports = EventsView;
