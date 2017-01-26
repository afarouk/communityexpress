/*global define*/

'use strict';

var regularTemplate = require('ejs!../../templates/partials/catalog-item.ejs'),
    versionsTemplate = require('ejs!../../templates/partials/catalog-versions-item.ejs'),
    VersionsView = require('./catalog_item_versions'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var CatalogItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-catalog-item sides_extras_container color1 sides_extras_color',

    events: {
        'click': 'onClick',
        'click .catalog_item_counter': 'preventClick',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails',
        'click .versions_buttons': 'preventClick',
        'change .versions_buttons select': 'updateAddVersionButton',
        'click .plus_version_button': 'onVersionAdded',
    },

    initialize: function (options) {
        this.quantity = 0;
        this.onClick = function () {
            options.onClick(this);
        }.bind(this);
        this.color = options.color;
        this.basket = options.basket;
        this.updateQuantity();
        this.catalogId = options.catalogId;
        this.groupId = options.groupId;
        this.groupDisplayText=options.groupDisplayText;
        this.catalogDisplayText=options.catalogDisplayText;
        this.withExpandedDetails = false;

        this.versions = [];

        this.listenTo(this.basket, 'reset change add remove', this.updateQuantity, this);
    },

    render: function() {
        var hasVersion = this.model.get('hasVersions'),
            template = hasVersion ? versionsTemplate : regularTemplate;
        console.log(this.model.toJSON());
        this.$el.html(template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity || 0,
            selectorVersions: hasVersion ? this.getSelectorVersions() : null
        })));
        if (hasVersion) this.updateAddVersionButton();
        return this;
    },

    onClick: function() {
        this.onClick();
    },

    preventClick: function() {
        return false;
    },

    getSelectorVersions: function() {
        var selectorOptions = this.model.get('selectorOptions'),
            length = Object.keys(selectorOptions).length,
            versions = [];
        _.each(selectorOptions, function(version){
            if (version.second && version.second.length > 0) {
                versions.push(version.second);
            }
        });
        return versions;
    },

    updateAddVersionButton: function() {
        var itemVersions = this.model.get('itemVersions'),
            $selectors = this.$('.versions_buttons select'),
            $selected = $selectors.find(':selected'),
            search = {},
            exists,
            selectedValues = [];
        $selected.each(function(){
            selectedValues.push(this.value);
        });
        for (var i = 1; i <= selectedValues.length; i++) {
            search['version' + i + 'DisplayText'] = selectedValues[i - 1];
        }
        exists = _.findWhere(itemVersions, search);
        if (exists) {
            if(this.isAlreadyAdded(exists)) {
                this.$('.plus_version_button').addClass('disabled');
            } else {
                this.$('.plus_version_button').removeClass('disabled');
                this.savedVersion = {
                    version: exists,
                    selected: selectedValues,
                    quantity: 1
                };
            }
        } else {
            this.$('.plus_version_button').addClass('disabled');
        }
    },

    isAlreadyAdded: function(version) {
        var exists = _.find(this.versions, {version: version});
        return exists ? true : false;
    },

    onRemoveVersion: function() {
        this.updateAddVersionButton();
    },

    onVersionAdded: function() {
        this.versions.push(this.savedVersion);
        this.renderVersions();
        this.$('.plus_version_button').addClass('disabled');
    },

    renderVersions: function() {
        var versionsContainer = this.$('.sides_extras_item_added_versions');
        if (!this.versionsView) {
            this.versionsView = new VersionsView({
                el: versionsContainer,
                basket: this.basket,
                catalogId: this.catalogId,
                groupId: this.groupId,
                model: this.model
            });
            this.versionsView.listenTo(this.versionsView, 'removeVersion', this.onRemoveVersion.bind(this));
        }
        this.versionsView.render(this.versions)
    },

    expandDetails: function() {
        this.$('.sides_extras_detailed').slideDown();
        this.withExpandedDetails = true;
    },

    collapseDetails: function() {
        this.$('.sides_extras_detailed').slideUp();
        this.withExpandedDetails = false;
    },

    incrementQuantity: function () {

        h().playSound('addToCart');

        this.addItem = true;
        this.quantity = this.quantity + 1;
        this.addToBasket();
        return false;
    },

    decrementQuantity: function () {
        this.addItem = false;
        var qty = this.quantity;

        if (qty === 0) return false;

        h().playSound('removeFromCart');

        this.quantity = this.quantity - 1;
        this.addToBasket();
        return false;
    },

    updateQuantity: function () {
        if (this.basket.length === 0) {
            this.$('.quantity').text(0);
            this.quantity = 0;
        } else {
            var modelChanged = this.basket.get(this.model.get('uuid'));
            if (modelChanged) {
                this.quantity = modelChanged.get('quantity');
                this.$('.order_price').text('$' + (this.model.get('price') * (this.quantity === 0 ? 1 : this.quantity)).toFixed(2));
            } else {
                this.quantity = 0;
                this.$('.order_price').text('$' + this.model.get('price'));
            }
        }
        this.model.set('quantity', this.quantity);
        this.$('.quantity').text(this.quantity);
    },

    addToBasket: function () {
    	var count;
        this.addItem ? count = 1 : count = -1;
        this.model.set('quantity', this.model.get('quantity') + count);
        this.basket.addItem(this.model, count, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemView;
