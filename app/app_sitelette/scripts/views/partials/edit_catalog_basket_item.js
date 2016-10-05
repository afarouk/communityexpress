/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/edit_catalog_basket_item.ejs'),
    h = require('../../globalHelpers');

var EditCatalogBasketItem = Backbone.View.extend({

    tagName: 'li',

    events: {
        // 'click': 'toggleSelected',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity'
    },

    initialize: function (options) {
        // debugger;
        this.parent = options.parent;
        this.quantity = this.model.get('quantity');
        this.changedItems = this.parent.parent.changedItems;
        this.basket = options.parent.parent.basket;
        this.template = options.template || template;
        this.editable = this.basket.catalogType === 'COMBO' ? false : true;
        this.listenTo(this.model, 'change:quantity', this.updateQuantity, this);
        // this.listenTo(this.model, 'change:selected', this._update, this);
        // this.listenTo(this.parent, 'close:all', this.remove, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            editable: this.editable
        })));
        return this;
    },

    incrementQuantity: function() {
        h().playSound('addToCart');
        this.quantity = this.quantity + 1;
        this.count = 1;
        this.updateQuantity();
        // this.model.set('quantity', this.model.get('quantity') + 1);
    },

    decrementQuantity: function() {
        // var quantity = this.model.get('quantity');
        if (this.quantity === 0) return;
        h().playSound('removeFromCart');
        this.quantity = this.quantity - 1;
        this.count = -1;
        this.updateQuantity();
        // this.model.set('quantity', this.model.get('quantity') - 1);
    },

    updateQuantity: function() {
        this.$('.order_price').text('$' + (this.quantity * this.model.get('price')).toFixed(2));
        this.$('.quantity').text(this.quantity);
        this.addToBasket();
    },

    addToBasket: function() {
        var changedItem = {
            model: this.model,
            count: this.quantity
        }
        if (this.basket.catalogType === 'UNDEFINED' || this.basket.catalogType === 'ITEMIZED') {
            this.changedItems[this.model.get('uUID')] = changedItem;
        }
        // var catalog = this.model.toJSON(),
        //     quantity = this.model.get('quantity'),
        //     catalogId = this.model.get('catalogId');
        // var changedCatalog = {
        //     catalog: catalog,
        //     quantity: quantity,
        //     catalogId: catalogId
        // };
        // if (catalogId === 'BUILDYOURCOMBO') {
        //     this.changedCatalogs[catalog.ownComboItemText] = changedCatalog;
        // } else if (catalogId === 'SIDES') {
        //     this.changedCatalogs[catalog.displayText] = changedCatalog;
        // } else {
        //     this.changedCatalogs[catalogId] = changedCatalog;
        // }
    },

    // toggleSelected: function () {
    //     this.model.set('selected', !this.model.get('selected'));
    // },

    // _update: function () {
    //     this.$('a').toggleClass('ui-icon-delete', 'ui-icon-none');
    // },

});

module.exports = EditCatalogBasketItem;
