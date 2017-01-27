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
        console.log('update qantity');
        var inModelVersions = this.model.get('versions'),
            selected = inModelVersions.selectedVersions;
        _.each(this.versions, function(version, index){
            var itemVersion = version.version.itemVersion,
                itemId = version.version.itemId,
                changed = _.find(selected, function(item) {
                    return item.version.itemVersion === itemVersion &&
                           item.version.itemId === itemId;
                });
            console.log(changed);
            if (changed) {
                if (changed.quantity === 0) {
                    this.versions.splice(index, 1);
                    this.trigger('removeVersion');
                } else {
                    version.quantity = changed.quantity;
                }
            }
        }.bind(this));
        this.render(this.versions);
        this.addToBasket();
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
            versions.totalPrice += longVersion.version.price * longVersion.quantity;
            versions.totalQuantity += longVersion.quantity;
        });
        console.log(versions);
        return versions;
    },

    addToBasket: function () {
    	console.log(this.model.toJSON());
        this.model.set('versions', this.getVersions());
        this.basket.addVersionItem(this.model, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemVersionsView;
