/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog-item.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var CatalogItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-catalog-item sides_extras_container color1 sides_extras_color',

    template: template,

    events: {
        // 'click': 'showAddToBusketView'
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity'
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

        this.listenTo(this.quantity, 'change:value', this.updateQuantity, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity.get('value')
        })));
        return this;
    },

    incrementQuantity: function () {
        this.quantity.set('value', this.quantity.get('value') + 1);
    },

    decrementQuantity: function () {
        var qty = this.quantity.get('value');

        if (qty === 0) return;

        this.quantity.set('value', this.quantity.get('value') - 1);
    },

    updateQuantity: function () {
        this.$('.quantity').text(this.quantity.get('value'));
        this.quantity.get('value') === 0
        ? this.$('.order_price').text('$' + this.model.get('price'))
        : this.$('.order_price').text('$' + this.model.get('price')*this.quantity.get('value'));
    }
});

module.exports = CatalogItemView;
