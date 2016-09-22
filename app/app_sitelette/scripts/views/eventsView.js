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
    $el.slideToggle('slow', function(){
        var visible = $(this).is(':visible');
        if (visible) {
            $(this).parent().find('.collapse_btn').html('&#9650;');
        } else {
            $(this).parent().find('.collapse_btn').html('&#9660;');
        }
    });
  }

});

module.exports = EventsView;
