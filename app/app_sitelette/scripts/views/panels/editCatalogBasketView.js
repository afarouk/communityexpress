/*global define*/

'use strict';

var template = require('ejs!../../templates/editCatalogBasket.ejs'), //
    loader = require('../../loader'), //
    PanelView = require('../components/panelView'), //
    ListView = require('../components/listView'),//
    EditCatalogBasketItem = require('../partials/edit_catalog_basket_item'),//
    h = require('../../globalHelpers');

var EditCatalogBasketView = PanelView.extend({

    template : template,

    addedEvents : {
        'click .cart_add_delete_item': 'addOrDeleteItem'
    },

    initialize : function(options) {
        this.options = options;
        options = options || {};
        this.changedItems = {};
        this.basket = this.model;

        this.itemTemplate = options.template;

        this.actions = options.actions;

        this.$el.attr({
            'id' : 'cmntyex_edit_favorites_panel'
        });

        this.addEvents(this.addedEvents);
        this.listenTo(this, 'close:all', this.saveBasket, this);
    },

    render : function(update) {
        var editable = true;

        this.$el.html(this.template({
            editable: editable
        }));
        this.$el.find('.cmntyex-list_container').html(new ListView({
            collection : this.collection,
            ListItemView : EditCatalogBasketItem,
            ListItemViewOptions : {
                template : this.itemTemplate
            },
            parent : this
        }).render().el);
        this.afterRender(); // call it for each panel if you replaced render
        return this;
    },

    saveBasket: function() {
        if (this.changedItems.length === 0) return;
        _.each(this.changedItems, _.bind(function(item) {
            if (item.model.get('hasVersions')) {
                this.basket.changeVersionItem(item.model);
            } else {
                this.basket.changeItem(item.model, item.count);
            }
        }, this));
    },

    _update : function() {
        this.render(true);
        this.enhance();
    }

});

module.exports = EditCatalogBasketView;
