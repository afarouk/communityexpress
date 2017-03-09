/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/edit_catalog_basket_item.ejs'),
    versionTemplate = require('ejs!../../templates/partials/edit_catalog_basket_version_item.ejs'),
    h = require('../../globalHelpers');

var EditCatalogBasketItem = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click .incrementQuantity': 'incrementQuantity',
        'click .decrementQuantity': 'decrementQuantity',
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.quantity = this.model.get('quantity');
        this.changedItems = this.parent.parent.changedItems;
        this.basket = options.parent.parent.basket;
        this.template = options.template || template;
        if (this.model.get('isVersion')) {
            this.template = versionTemplate;
            var t1 = this.model.get('version1DisplayText'),
                t2 = this.model.get('version2DisplayText'),
                t3 = this.model.get('version3DisplayText');

            this.versionText = (t1 ? t1 : '') + (t2 ? ' ,' + t2 : '') + (t3 ? ' ,' + t3 : '');
            this.totalPrice = this.model.get('quantity') * this.model.get('price');
        } 
        this.editable = this.basket.catalogType === 'COMBO' ? false : true;
        this.listenTo(this.model, 'change:quantity', this.updateQuantity, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            editable: this.editable,
            versionText: this.versionText || '',
            totalPrice: this.totalPrice || 0
        })));
        return this;
    },

    incrementQuantity: function() {
        h().playSound('addToCart');
        this.quantity = this.quantity + 1;
        this.count = 1;
        this.updateQuantity();
    },

    decrementQuantity: function() {
        if (this.quantity === 0) return;
        h().playSound('removeFromCart');
        this.quantity = this.quantity - 1;
        this.count = -1;
        this.updateQuantity();
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
        if (this.basket.catalogType === 'UNDEFINED' || this.basket.catalogType === 'ITEMIZED' || !this.basket.catalogType) {
            this.changedItems[this.model.get('uuid')] = changedItem;
            this.changedItems.onChanged();
        }
    }

});

module.exports = EditCatalogBasketItem;
