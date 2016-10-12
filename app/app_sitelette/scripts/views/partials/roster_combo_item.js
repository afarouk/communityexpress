/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_combo_item.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var RosterComboItemView = Backbone.View.extend({

    template : template,
    tagName : 'li',
    className : 'cmtyx_roster_combo_item menuItem',
    events : {
        'click .roster_combo_item_add_button' : 'showAddToBusketView',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .combo_select_item': 'addToCart'
    },

    initialize : function(options) {
        this.options = options;
        this.basket = this.options.parent.basket;
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.onClick = function () {
            options.onClick(this.model);
        }.bind(this);
        this.color = options.color;

        // this.listenTo(this.basket, 'reset change add remove', _.bind(this.updateBasket, this));

    },

    render : function() {
        // we re-create roster view each time
        // and we should update model quantity from basket
        var inBasket = this.basket.getCatalog(this.model);
        if (inBasket) {
            // We need it when rerender view and change items in editBasketPanel
            inBasket.off('change remove').on('change remove', _.bind(this.changeCount, this));
            this.model.quantity = inBasket.get('quantity');
        }
        this.$el.html(this.template({
            combo : this.model
        }));
        return this;
    },

    /* we delegate to the method set via the initializer */
    showAddToBusketView: function() {
        this.onClick();
    },

    // updateBasket: function() {
    //     this.$('.quantity').text(this.model.quantity);
    // },

    addToCart: function(e, action) {
        // var catalogId = e.target.attributes.catalogid.value;
        // var catalog_quantity = parseInt($('#ComboItemCount_'+catalogId).text());
        var catalogId = this.model.catalogId,
            // quantity = parseInt(this.$('.quantity').text()),
            quantity = this.model.quantity,
            catalogDisplayText = this.model.displayText,
            count = (action == 'add') ? quantity + 1 : quantity - 1,
            catalog;

        console.log(count);
        this.model.quantity = count;
        // var initialCnt = this.basket.getComboCount();
        // this.catalogId = e.target.attributes.catalogid.value;
        // this.catalogDisplayText=e.target.attributes.catalogdisplaytext.value;
        this.basket.addCatalog(this.model, count, catalogId, catalogDisplayText);
        catalog = this.basket.getCatalog(this.model);
        if (catalog) {
            catalog.off('change remove').on('change remove', _.bind(this.changeCount, this));
        }

        this.$('.quantity').text(this.model.quantity);

        // $('.cart_items_number').text(this.basket.getComboCount());
        // $('#ComboItemCount_'+catalogId).text(count);

        return;
    },

    incrementQuantity: function (e) {
        h().playSound('addToCart');
        this.addToCart(e, 'add');
    },

    decrementQuantity: function (e) {
        if (this.model.quantity === 0) return;
        h().playSound('removeFromCart');
        this.addToCart(e, 'remove');
    },

    changeCount: function() {
        var count = this.basket.getCatalogQuantity(this.model);
        this.model.quantity = count;
        this.$('.quantity').text(count);
    }
});

module.exports = RosterComboItemView;
