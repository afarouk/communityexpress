/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog-versions.ejs'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
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

        this.addToBasket(versionIndex, 1);
    },

    decrementQuantity: function (e) {
        var $target = $(e.currentTarget),
            versionIndex = $target.data('version'),
            version = this.versions[versionIndex];

        this.addToBasket(versionIndex, -1);
        if (version.quantity === 1) {
            this.versions.splice(versionIndex, 1);
            this.render(this.versions);
            this.trigger('removeVersion');
        } else {
            version.quantity --;
            this.updateIndex(versionIndex, version.quantity);
        }

        h().playSound('removeFromCart');

    },

    updateQuantity: function (modelChanged) {
        var inModelVersions = this.basket.getBasketVersions(this.model);
        _.each(this.versions, function(version, index){
            var itemVersion = version.version.get('itemVersion'),
                itemId = version.version.get('itemId');
            if (modelChanged.get('itemVersion') === itemVersion &&
                modelChanged.get('itemId') === itemId) {
                var quantity = modelChanged.get('quantity');
                if (quantity === 0) {
                    this.versions.splice(index, 1);
                    this.trigger('removeVersion');
                } else {
                    version.quantity = quantity;
                }
            }
        }.bind(this));
        this.render(this.versions);
    },

    getVersions: function() {
        var versions = {
            totalPrice: 0,
            totalQuantity: 0,
            selectedVersions: []
        };
        _.each(this.versions, function(version) {
            var longVersion = _.extend(version, {
                displayText: version.selected.join(' ,')
            });
            versions.selectedVersions.push(longVersion);
            versions.totalPrice += longVersion.version.get('price') * longVersion.quantity;
            versions.totalQuantity += longVersion.quantity;
        });
        return versions;
    },

    addToBasket: function (versionIndex, count) {
        var index = versionIndex === undefined ? this.versions.length - 1 : versionIndex,
            versions = this.getVersions(),
            uuid = this.model.get('uuid'),
            basketItem = this.versions.length > 0 ? this.versions[index].version : null;

        this.basket.setBasketVersions(this.model, versions);
        if (!basketItem) return;
        basketItem.set('isVersion', true, {silent: true});
        basketItem.set('itemName', this.model.get('itemName'), {silent: true});
        basketItem.set('uuid', uuid + '_' + basketItem.get('itemVersion'), {silent: true});
        this.basket.addItem(basketItem, count || 1,this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemVersionsView;
