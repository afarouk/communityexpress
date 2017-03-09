/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/edit_roster_view_item.ejs'),
    h = require('../../globalHelpers');

var EditRosterViewItem = Backbone.View.extend({

    tagName: 'li',

    events: {
        // 'click': 'toggleSelected',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity'
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.quantity = this.model.get('quantity');
        this.changedCatalogs = this.parent.parent.changedCatalogs;
        this.basket = options.parent.parent.basket;
        this.template = options.template || template;

        if (this.model.get('catalogId') === 'SIDES') {
            this.$el.addClass('without_border');
        }
        this.listenTo(this.model, 'change:quantity', this.updateQuantity, this);
        this.listenTo(this.model, 'change:selected', this._update, this);
        this.listenTo(this.parent, 'close:all', this.remove, this);
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    incrementQuantity: function() {
        h().playSound('addToCart');
        this.model.set('quantity', this.model.get('quantity') + 1);
    },

    decrementQuantity: function() {
        var quantity = this.model.get('quantity');
        if (quantity === 0) return;
        h().playSound('removeFromCart');
        this.model.set('quantity', this.model.get('quantity') - 1);
    },

    updateQuantity: function() {
        this.$('.order_price').text('$' + (this.model.get('quantity') * this.model.get('price')).toFixed(2));
        this.$('.quantity').text(this.model.get('quantity'));
        this.addToBasket();
    },

    addToBasket: function() {
        var catalog = this.model.toJSON(),
            quantity = this.model.get('quantity'),
            catalogId = this.model.get('catalogId');
        var changedCatalog = {
            catalog: catalog,
            quantity: quantity,
            catalogId: catalogId
        };
        if (catalogId === 'BUILDYOURCOMBO') {
            this.changedCatalogs[catalog.ownComboItemText] = changedCatalog;
            this.changedCatalogs.onChanged();
        } else if (catalogId === 'SIDES') {
            this.changedCatalogs[catalog.displayText] = changedCatalog;
            this.changedCatalogs.onChanged();
        } else {
            this.changedCatalogs[catalogId] = changedCatalog;
            this.changedCatalogs.onChanged();
        }
    },

    toggleSelected: function () {
        this.model.set('selected', !this.model.get('selected'));
    },

    _update: function () {
        this.$('a').toggleClass('ui-icon-delete', 'ui-icon-none');
    },

});

module.exports = EditRosterViewItem;
