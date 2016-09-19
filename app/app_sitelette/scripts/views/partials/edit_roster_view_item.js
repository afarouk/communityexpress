/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/edit_roster_view_item.ejs');

var EditRosterViewItem = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click': 'toggleSelected'
    },

    initialize: function (options) {
        debugger;
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
    },

});

module.exports = EditRosterViewItem;
