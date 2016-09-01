/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_combo_item.ejs'), Vent = require('../../Vent'), h = require('../../globalHelpers');

var RosterComboItemView = Backbone.View.extend({

    template : template,
    tagName : 'li',
    className : 'cmtyex_roster_combo_item',
    events : {
        'click .roster_combo_item_add_button' : 'showAddToBusketView'
    },

    initialize : function(options) {
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.onClick = function () {
            options.onClick(this.model);
        }.bind(this);
        this.color = options.color;
    },

    /* we delegate to the method set via the initializer */
    showAddToBusketView: function() {
        this.onClick();
    },

    render : function() {
        this.$el.html(this.template({
            combo : this.model
        }));
        return this;
    }
});

module.exports = RosterComboItemView;
