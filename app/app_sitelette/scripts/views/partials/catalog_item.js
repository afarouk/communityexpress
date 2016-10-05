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
        'click': 'onClick',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails'
    },

    showAddToBusketView: function() {
        this.onClick();
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

        this.listenTo(this.basket, 'reset change add remove', this.updateQuantity, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity || 0
        })));
        return this;
    },

    onClick: function() {
        this.onClick();
    },

    expandDetails: function() {
        this.$('.sides_extras_detailed').slideDown();
        this.$('.sides_extras_expand_icon').text('▲');
        this.withExpandedDetails = true;
    },

    collapseDetails: function() {
        this.$('.sides_extras_detailed').slideUp();
        this.$('.sides_extras_expand_icon').text('▼');
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
            var modelChanged = this.basket.get(this.model.get('uUID'));
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
