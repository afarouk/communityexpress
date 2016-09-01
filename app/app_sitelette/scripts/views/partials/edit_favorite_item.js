/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/edit_favorite_item.ejs');

var EditFavoriteItemView = Backbone.View.extend({

  tagName: 'li',

  events: {
      'click': 'toggleSelected'
  },

  initialize: function (options) {
      this.parent = options.parent;
      this.template = options.template || template;

      this.listenTo(this.model, 'change:selected', this._update, this);
      this.listenTo(this.parent, 'close:all', this.remove, this);
  },

  render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
  },

  toggleSelected: function () {
      this.model.set('selected', !this.model.get('selected'));
  },

  _update: function () {
      this.$('a').toggleClass('ui-icon-delete', 'ui-icon-none');
  }

});

module.exports = EditFavoriteItemView;
