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
        'click .catalog_item_counter': 'preventClick',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails',
        'click .versions_buttons': 'preventClick',
        'change .versions_buttons select': 'updateAddVersionButton',
        'click .plus_version_button': 'onVersionAdded',
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

        this.versions = [];

        this.listenTo(this.basket, 'reset change add remove', this.updateQuantity, this);
    },

    render: function() {
        console.log(this.model.toJSON());
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity || 0,
            selectorVersions: this.getSelectorVersions()
        })));
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
        for (var i = 1; i <= length; i++) {
            versions.push(selectorOptions['selectors' + i]);
        }
        return versions
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
            this.$('.plus_version_button').removeClass('disabled');
            this.savedVersion = {
                version: exists,
                selected: selectedValues
            };
        } else {
            this.$('.plus_version_button').addClass('disabled');
        }
    },

    onVersionAdded: function() {
        //TODO add item version
        console.log('add version');
        this.versions.push(this.savedVersion);
        this.renderVersions();
    },

    renderVersions: function() {
        //todo
        var versionsContainer = this.$('.sides_extras_item_added_versions'),
            template = '',
            //todo should be template for this
            //also manage + - buttons etc
            buttons = '<div class="float_right"><div class="select_container catalog_item_counter"><div class="ui-grid-b"><div class="ui-block-a quantity_minus decrementQuantity"><a class="right minus_button ui-btn ui-shadow ui-corner-all ui-nodisc-icon ui-alt-icon ui-icon-minus ui-btn-icon-notext" catalogid="COMBO3" catalogdisplaytext="Combo3"></a></div><div class="ui-block-b cmntyex-add_to_basket_quantity quantity_field"><span class="quantity">1</span></div><div class="ui-block-c quantity_plus incrementQuantity"><a class="left plus_button ui-btn ui-shadow ui-corner-all ui-nodisc-icon ui-alt-icon ui-icon-plus ui-btn-icon-notext" catalogid="COMBO3" catalogdisplaytext="Combo3"></a></div></div></div></div>';
        _.each(this.versions, function(version){
            var details = version.selected.join(' ,');
            template += '<div class="item_version"><span class="version-description">' + details + '</span>' + buttons + '</div>';
        });
        versionsContainer.html(template);
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
