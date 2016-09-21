/*global define*/

'use strict';

var Vent = require('../Vent');

var PromotionView = Backbone.View.extend({
  name: 'promotion',
  el: '#cmtyx_promotion_block',

  events: {
    'click .header': 'toggleCollapse'
  },

  //TODO functionality

  initialize: function(options) {
    this.options = options || {};
  },

  toggleCollapse: function() {
    var $el = this.$('.body');
    $el.slideToggle('slow', function(){
        var visible = $(this).is(':visible');
        if (visible) {
            $(this).parent().find('.collapse_btn').removeClass('down');
        } else {
            $(this).parent().find('.collapse_btn').addClass('down');
        }
    });
  }

});

module.exports = PromotionView;
