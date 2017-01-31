/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog_item_from_roster.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var SidesCatalogItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'cmntyex-catalog-item sides_extras_container color1 cmtyx_color_3',

    events: {
        'click': 'onClick',
        'click .catalog_item_counter': 'preventClick',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails'
    },

    showAddToBusketView: function() {
        this.onClick();
    },

    initialize: function (options) {
        // this.quantity = new Backbone.Model({
        //     value: 0
        // });
        this.quantity = 0;
        this.onClick = function () {
            options.onClick(this);
        }.bind(this);
        this.color = options.color;
        this.basket = options.basket;
        var itemId = this.model.get('itemId');
        if (typeof this.basket.SIDES !== 'undefined') {
            this.basket.SIDES.each(_.bind(function(item) {
                if (item.get('itemId') === itemId) {
                    // this.quantity.set('value', item.get('quantity'));
                    this.quantity = item.get('quantity');
                }
            }, this));
        }
        this.catalogId = options.catalogId;
        this.groupId = options.groupId;
        this.groupDisplayText=options.groupDisplayText;
        this.catalogDisplayText=options.catalogDisplayText;
        this.withExpandedDetails = false;

        this.listenTo(this.basket, 'reset change add remove', this.setQuantity, this);
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

    preventClick: function() {
        return false;
    },

    expandDetails: function() {
        this.$('.sides_extras_detailed').slideDown();
        // this.$('.sides_extras_expand_icon').text('▲');
        this.withExpandedDetails = true;
    },

    collapseDetails: function() {
        this.$('.sides_extras_detailed').slideUp();
        // this.$('.sides_extras_expand_icon').text('▼');
        this.withExpandedDetails = false;
    },

    incrementQuantity: function() {

        h().playSound('addToCart');

        this.addItem = true;
        this.quantity = this.quantity + 1;
        this.addToBasket();
        return false;
    },

    decrementQuantity: function() {
        this.addItem = false;
        var qty = this.quantity;

        if (qty === 0) return false;

        h().playSound('removeFromCart');

        this.quantity = this.quantity - 1;
        this.addToBasket();
        return false;
    },

    setQuantity: function() {
        this.$('.quantity').text(this.model.get('quantity') || 0);
        var itemId = this.model.get('itemId');
        if (typeof this.basket.SIDES !== 'undefined') {
            if (this.basket.SIDES.length === 0) {
                this.$('.quantity').text(0);
                this.quantity = 0;
            } else {
                var modelChanged = this.basket.SIDES.find(_.bind(function(item) {
                    return item.get('itemId') === this.model.get('itemId');
                }, this));
                if (modelChanged) {
                    this.quantity = modelChanged.get('quantity');
                } else {
                    this.quantity = 0;
                }
            }
        }
        this.model.set('quantity', this.quantity);
        this.$('.quantity').text(this.quantity);
    },

    // updateQuantity: function () {
    //     // this.$('.quantity').text(this.quantity);
    //     // this.quantity === 0
    //     // ? this.$('.order_price').text('$' + this.model.get('price'))
    //     // : this.$('.order_price').text('$' + this.model.get('price')*this.quantity);
    //     this.addToBasket();
    // },

    addToBasket: function () {
    	var count;
        this.addItem ? count = 1 : count = -1;
        this.model.set('quantity', this.model.get('quantity') + count);
        this.basket.addSidesItem(this.model, count, this.groupId, this.groupDisplayText, this.catalogId, this.catalogDisplayText);
    }
});

module.exports = SidesCatalogItemView;
