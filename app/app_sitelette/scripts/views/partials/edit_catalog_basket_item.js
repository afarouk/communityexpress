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
        'click .incrementVersionQuantity': 'incrementVersionQuantity',
        'click .decrementVersionQuantity': 'decrementVersionQuantity'
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.quantity = this.model.get('quantity');
        this.changedItems = this.parent.parent.changedItems;
        this.basket = options.parent.parent.basket;
        this.template = options.template || template;
        if (this.model.get('hasVersions')) {
            this.template = versionTemplate;
        } 
        this.editable = this.basket.catalogType === 'COMBO' ? false : true;
        this.listenTo(this.model, 'change:quantity', this.updateQuantity, this);
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
        }
    },

    incrementVersionQuantity: function(e) {
        var $target = $(e.currentTarget),
            index = $target.data('index');
        h().playSound('addToCart');
        
        this.updateVersionQuantity(index, 1);
    },

    decrementVersionQuantity: function(e) {
        var $target = $(e.currentTarget),
            index = $target.data('index');
        h().playSound('removeFromCart');
        
        this.updateVersionQuantity(index, -1);
    },

    getVersionsPrice: function() {
        var versions = this.model.get('versions'),
            totalPrice = 0;
        _.each(versions.selectedVersions, function(version){
            totalPrice += version.version.price * version.quantity;
        });
        return totalPrice;
    },

    updateVersionQuantity: function(index, quantity) {
        var version = this.model.get('versions').selectedVersions[index],
            vQuantity = version.quantity;
        version.quantity = vQuantity === 0 && quantity === -1 ? 0 : version.quantity + quantity;
        this.$('.order_price').text('$' + this.getVersionsPrice());
        this.$('.quantity[data-index="' + index + '"]').text(version.quantity);
        this.addToVersionBasket();
    },

    addToVersionBasket: function() {
        var changedItem = {
            model: this.model
        }
        if (this.basket.catalogType === 'UNDEFINED' || this.basket.catalogType === 'ITEMIZED' || !this.basket.catalogType) {
            this.changedItems[this.model.get('uuid')] = changedItem;
        }
    },

});

module.exports = EditCatalogBasketItem;
