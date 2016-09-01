/*global define*/

'use strict';

var template = require('ejs!../../templates/addToRosterBasket.ejs'),
    PanelView = require('../components/panelView');

var AddToRosterBasketView = PanelView.extend({

    template: template,
    catalogId : null,
    catalogDisplayText:null,


    initialize: function(options) {
        options = options || {};
        this.$el.attr('id', 'cmntyex_add-to-basket_panel' );
        this.quantity = new Backbone.Model({
            value: 1
        });
        this.basket = options.basket;
        this.catalogId = options.catalogId;
        this.catalogType=options.catalogType;
        this.catalogDisplayText=options.catalogDisplayText;

        this.addEvents({
            'click .plus_button': 'incrementQuantity',
            'click .minus_button': 'decrementQuantity',
            'click .add_button': 'addToBasket'
        });

        this.listenTo(this.quantity, 'change:value', this.updateQuantity, this);
    },

    incrementQuantity: function () {
        this.quantity.set('value', this.quantity.get('value') + 1);
    },

    decrementQuantity: function () {
        var qty = this.quantity.get('value');

        if (qty === 1) return;

        this.quantity.set('value', this.quantity.get('value') - 1);
    },

    updateQuantity: function () {
        $('.quantity').text(this.quantity.get('value'));
    },

    addToBasket: function () {
    	var count=this.quantity.get('value');

        this.basket.addCatalog(this.model, count,  this.catalogId,this.catalogDisplayText);
        this.shut();
    },

    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    }

});

module.exports = AddToRosterBasketView;
