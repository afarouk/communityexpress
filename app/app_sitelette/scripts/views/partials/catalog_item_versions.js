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

    initialize: function (options) {
        this.basket = options.basket;
        this.catalogId = options.catalogId;
        this.groupId = options.groupId;
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

        this.addToBasket();
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

        h().playSound('removeFromCart');

        this.addToBasket();
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

    getVerions: function() {
        var versions = {
            totalPrice: 0,
            selectedVersions: []
        };
        _.each(this.versions, function(version) {
            var shortVersion = {
                itemId: version.version.itemId,
                itemVersion: version.version.itemVersion,
                price: version.version.price,
                priceId: version.version.priceId,
                quantity: version.quantity
            };
            versions.selectedVersions.push(shortVersion);
            versions.totalPrice += shortVersion.price * shortVersion.quantity;
        });
        console.log(versions);
        return versions;
    },

    addToBasket: function () {
    	console.log(this.model.toJSON());
        this.model.set('verions', this.getVerions());
        //this.basket.addItem(this.model, 1, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemVersionsView;
