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
        'click .cart_add_delete_item': 'addOrDeleteItem',
        'click .order_btn': 'triggerOrder'
    },

    initialize : function(options) {
        this.options = options;
        options = options || {};
        this.createChangeItems();
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
        this.$('.total_price').text('$ ' + this.basket.getTotalPrice().toFixed(2));
        return this;
    },

    //  we need this strange logic because in other case we should make serious changes in our application 
    //  it can take a lot of time
    createChangeItems: function() {
        function ChangedItems() {

        }
        ChangedItems.prototype.onChanged = this.updateTotalPrice.bind(this);
        this.changedItems = new ChangedItems();
    },

    updateTotalPrice: function() {
        var temporaryBasket = this.basket.getBasketItemsForSubtotal(this.changedItems);
        var subTotalPrice = 0;
        _.each(temporaryBasket, function(item) {
            subTotalPrice += item.quantity * item.price;
        })
        this.$('.total_price').text('$ ' + subTotalPrice.toFixed(2));
    },
    // end

    saveBasket: function() {
        if (this.changedItems.length === 0) return;
        _.each(this.changedItems, _.bind(function(item) {
            if (item.model.get('isVersion')) {
                this.basket.changeVersionItem(item.model, item.count);
            } else {
                this.basket.changeItem(item.model, item.count);
            }
        }, this));
    },

    _update : function() {
        this.render(true);
        this.enhance();
    },

    triggerOrder: function() {
        this.saveBasket();
        this.parent.triggerOrder();
    }
});

module.exports = EditCatalogBasketView;
