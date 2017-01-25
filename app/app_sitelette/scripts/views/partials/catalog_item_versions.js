/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog-versions.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var CatalogItemVersionsView = Backbone.View.extend({

    tagName: 'li',

    className: '',

    events: {
        'click .catalog_item_counter': 'preventClick',
        'click .incrementQuantity': 'incrementQuantity',
        'click .decrementQuantity': 'decrementQuantity'
    },

    initialize: function () {
    },

    render: function(versions) {
        var templateData = {
            versions: versions
        };
        this.versions = versions;
        this.$el.html(template(templateData));
        return this;
    },

    preventClick: function() {
        return false;
    },

    updateIndex: function(itemVersion, quantity) {
        this.$('.quantity[data-version="' + itemVersion + '"]').text(quantity);
    },
    
    incrementQuantity: function (e) {
        var $target = $(e.currentTarget),
            versionIndex = $target.data('version'),
            version = this.versions[versionIndex];
        h().playSound('addToCart');
        version.quantity ++;
        this.updateIndex(versionIndex, version.quantity);
        // this.addItem = true;
        // this.quantity = this.quantity + 1;
        // this.addToBasket();
        // return false;
    },

    decrementQuantity: function (e) {
        var $target = $(e.currentTarget),
            versionIndex = $target.data('version'),
            version = this.versions[versionIndex];

        if (version.quantity === 1) {
            this.versions.splice(versionIndex, 1);
            this.render(this.versions);
            this.trigger('removeVersion');
        } else {
            version.quantity --;
            this.updateIndex(versionIndex, version.quantity);
        }

        // this.addItem = false;
        // var qty = this.quantity;

        // if (qty === 0) return false;

        h().playSound('removeFromCart');

        // this.quantity = this.quantity - 1;
        // this.addToBasket();
        // return false;
    },

    updateQuantity: function () {
        // if (this.basket.length === 0) {
        //     this.$('.quantity').text(0);
        //     this.quantity = 0;
        // } else {
        //     var modelChanged = this.basket.get(this.model.get('uuid'));
        //     if (modelChanged) {
        //         this.quantity = modelChanged.get('quantity');
        //         this.$('.order_price').text('$' + (this.model.get('price') * (this.quantity === 0 ? 1 : this.quantity)).toFixed(2));
        //     } else {
        //         this.quantity = 0;
        //         this.$('.order_price').text('$' + this.model.get('price'));
        //     }
        // }
        // this.model.set('quantity', this.quantity);
        // this.$('.quantity').text(this.quantity);
    },

    addToBasket: function () {
    	// var count;
     //    this.addItem ? count = 1 : count = -1;
     //    this.model.set('quantity', this.model.get('quantity') + count);
     //    this.basket.addItem(this.model, count, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemVersionsView;
