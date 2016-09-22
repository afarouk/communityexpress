/*global define*/

'use strict';

var Vent = require('../../Vent');

var PromotionView = Backbone.View.extend({
  name: 'promotion',
  el: '#cmtyx_promotion_block',

  events: {
    'click .header': 'toggleCollapse',
    'click .share_btn_block': 'showShareBlock'
  },

  //TODO functionality

  initialize: function(options) {
    this.options = options || {};
  },

  showShareBlock: function() {
    var $el = this.$('.promotion-share-block');
    $el.slideToggle('slow');
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

module.exports = PromotionView;
