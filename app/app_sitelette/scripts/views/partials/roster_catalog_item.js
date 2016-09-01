/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_catalog_item.ejs'), //
    Vent = require('../../Vent'),//
    h = require('../../globalHelpers');

var RosterCatalogItemView = Backbone.View.extend({
    template : template,
    tagName : 'li',
    className : 'cmtyex_roster_catalog_item',
    events : {
        'click .roster_catalog_item_add_button' : 'showCatalogLocal'
    },
    /* each catalog row is initialized with its own CatalogBasketModel */
    initialize : function(options) {
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.showCatalog = options.showCatalog;
        //this.catalogId=options.catalogId;
        //this.catalogDisplayText=options.catalogDisplayText;
    },

    render : function() {
        this.$el.html(this.template({
            catalog : this.model
        }));
        return this;
    },

    showCatalogLocal : function() {
        this.showCatalog();
    }

});

module.exports = RosterCatalogItemView;
