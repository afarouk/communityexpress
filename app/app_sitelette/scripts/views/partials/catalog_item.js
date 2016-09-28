/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog-item.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var CatalogItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'cmntyex-catalog-item sides_extras_container color1 sides_extras_color',

    events: {
        // 'click': 'showAddToBusketView'
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails'
    },

    showAddToBusketView: function() {
        this.onClick();
    },

    initialize: function (options) {
        this.quantity = new Backbone.Model({
            value: 0
        });
        this.onClick = function () {
            options.onClick(this.model);
        }.bind(this);
        this.color = options.color;
        this.basket = options.basket;
        var itemId = this.model.get('itemId');
        if (typeof this.basket !== 'undefined') {
            this.basket.each(_.bind(function(item) {
                if (item.get('itemId') === itemId) {
                    this.quantity.set('value', item.get('quantity'));
                }
            }, this));
        }
        this.catalogId = options.catalogId;
        this.groupId = options.groupId;
        this.groupDisplayText=options.groupDisplayText;
        this.catalogDisplayText=options.catalogDisplayText;

        this.listenTo(this.quantity, 'change:value', this.updateQuantity, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity.get('value')
        })));
        return this;
    },

    openItemDetails: function() {
        // TODO how should we show item details (accordion or left panel)
    },

    incrementQuantity: function () {
        this.addItem = true;
        this.quantity.set('value', this.quantity.get('value') + 1);
    },

    decrementQuantity: function () {
        this.addItem = false;
        var qty = this.quantity.get('value');

        if (qty === 0) return;

        this.quantity.set('value', this.quantity.get('value') - 1);
    },

    updateQuantity: function () {
        this.$('.quantity').text(this.quantity.get('value'));
        this.quantity.get('value') === 0
        ? this.$('.order_price').text('$' + this.model.get('price'))
        : this.$('.order_price').text('$' + this.model.get('price')*this.quantity.get('value'));
        this.addToBasket();
    },

    addToBasket: function () {
    	var count;
        this.addItem ? count = 1 : count = -1;
        this.basket.addItem(this.model, count, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    }
});

module.exports = CatalogItemView;
