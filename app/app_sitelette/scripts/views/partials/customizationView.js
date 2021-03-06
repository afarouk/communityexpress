/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    template = require('ejs!../../templates/partials/customization.ejs'),
    popupController = require('../../controllers/popupController');

var CustomizationView = Backbone.View.extend({

    name: 'customization',

    id: 'cmtyx_customizationView',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.options = options;
        console.log(options);
        this.on('show', this.onShow, this);
        this.render();
        this.options.basket.on('change', this.changeItemsNumber.bind(this));

        this.price = this.options.model.get('hasVersions') ? 
            this.options.version.get('originalPrice') : this.options.model.get('originalPrice');
    },

    render: function() {
        this.$el.html(template(this.serializeData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    serializeData: function() {
        return {
            itemName: this.options.model.get('itemName'),
            subItems: this.options.subItems,
            price: this.price
        };
    },

    renderContent: function() {
        return this.$el;
    },

    onShow:  function () {
        if (this.options.subItems.length === 0) {
            this.goBack();
            return;
        }
        this.checkRadio();
        this.addEvents({
            'click .back': 'goBack',
            'change input.combo_item_input': 'onSelected',
            'click .done-btn': 'onDone',
            'click .basket_icon_container' : 'openEditPanel'
        });
    },

    changeItemsNumber: function() {
        var number = this.options.basket.getItemsNumber();
        $('.cart_items_number').text(number);
    },

    onSelected: function (e) {
        var $target = $(e.currentTarget),
            checked = $target.is(':checked'),
            subId = $target.data('subid'),
            subSubId = $target.data('subsubid'),
            subItems = this.options.subItems;
        var subItem = _.findWhere(subItems, {
            subItemId: subId
        });
        if (subItem.selectorType.enumText === "CHECKBOX") {
            var selected = this.$('input[type="checkbox"]:checked[data-subid="' + subId + '"]');
            var noChecked = this.$('input:checkbox:not(:checked)[data-subid="' + subId + '"]');
            var $row = noChecked.parents('.cmntyex-catalog-item');
            var $subItem = noChecked.parents('[name="customize_subitem"]');
            if (selected.length === subItem.maxSubSubCount) {
                $row.addClass('not-allow');
            } else {
                $row.removeClass('not-allow');
            }
            if (selected.length >= subItem.minSubSubCount) {
                $subItem.addClass('allow');
            } else {
                $subItem.removeClass('allow');
            }
        } else {
            var selected = this.$('input[type="radio"]:checked[data-subid="' + subId + '"]');
            var $subItem = selected.parents('[name="customize_subitem"]');
            if (selected.length === subItem.minSubSubCount) {
                $subItem.addClass('allow');
            } else {
                $subItem.removeClass('allow');
            }
        }
        this.changeSelectedState();
        e.preventDefault();
        e.stopPropagation();
        return false;
    },

    checkRadio: function() {
        var selected = this.$('input[type="radio"]:checked');
        var $subItem = selected.parents('[name="customize_subitem"]');
        $subItem.addClass('allow');
        this.checkCheckbox();
        this.changeSelectedState();
    },

    checkCheckbox: function() {
        var subItems = this.options.subItems;

        _.each(subItems, function(subItem) {
            var subItemId = subItem.subItemId;
            var selected = this.$('input[type="checkbox"]:checked[data-subid="' + subItemId + '"]');
            var checkbox = this.$('input[type="checkbox"][data-subid="' + subItemId + '"]');
            var $subItem = checkbox.parents('[name="customize_subitem"]');
            if (selected.length >= subItem.minSubSubCount) {
                $subItem.addClass('allow');
            }
        }.bind(this));
    },

    changeSelectedState: function() {
        var $allowed = this.$('[name="customize_subitem"].allow'),
            $doneBtns = this.$('.done-btn'); 
        if ($allowed.length === this.options.subItems.length) {
            $doneBtns.attr('disabled', false);
        } else {
            $doneBtns.attr('disabled', true);
        }
        this.changePrice();
    },

    changePrice: function() {
        var subItems = this.getSubItems(),
            price = this.price;

        _.each(subItems, function(subItem){
            _.each(subItem.selected, function(selected){
                price += selected.priceAdjustment;
            })
        });
        this.$('.total-price').text('$ ' + price);
    },

    onDone: function() {
        var subItems = this.getSubItems(),
            model = this.options.version || this.options.model,
            customizationNote = this.options.model.get('itemName'),
            adjustedPrice = this.price;
        customizationNote += '[';
        _.each(subItems, function(subItem) {
            var selected = subItem.selected,
                displayText = subItem.displayText;
            customizationNote += displayText + ':';
            customizationNote += _.reduce(selected, function(first, second){
                var first = first || '';
                return first + '+ ' + second.displayText + '(' + second.priceAdjustment.toFixed(2) + '),'; 
            }, 0);
            customizationNote = customizationNote.slice(0, -1);
            customizationNote += '; ';
            adjustedPrice += _.reduce(_.pluck(selected, 'priceAdjustment'), function(a, b) {return a+b;});
        });
        customizationNote = customizationNote.slice(0, -2);
        customizationNote += ']';
        var iModel = model;
        iModel.set('wasCustomized', true);
        iModel.set('hasSubItems', true);
        iModel.set('customizationNote', customizationNote);
        iModel.set('price', adjustedPrice);
        iModel.set('subItems', subItems);
        this.options.showCustomizationMark();
        this.goBack();
    },

    getSubItems: function() {
        var selected = {};
        this.$('input:checked').each(function(index, item){
            var $item = $(item),
                subId = $item.data('subid'),
                subSubId = $item.data('subsubid'),
                subItems = this.options.subItems,
                subItem = _.findWhere(subItems, {
                    subItemId: subId
                }),
                subSubItem = _.findWhere(subItem.subSubItems, {
                    subSubItemId: subSubId
                });
            if (selected[subId]) {
                selected[subId].selected.push(subSubItem);
            } else {
                var found = _.findWhere(this.options.subItems, {subItemId: subId});
                selected[subId] = {
                    displayText: found.displayText,
                    selected: [subSubItem]
                };
            }
        }.bind(this));
        return selected;
    },

    openEditPanel: function() {
        popupController.editCatalogBasketView(this, this.options.basket, {
            actions: {
                removeItem: function(selected) {
                    _(selected).each(function(item) {
                        this.options.basket.removeItem(item);
                    }.bind(this));
                }.bind(this)
            },
            template: require('ejs!../../templates/partials/edit_catalog_basket_item.ejs')
        });
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: this.catalogId,
            backToCatalog: true,
            backToCatalogs:false,
            backToRoster:false,
            fromCustomization: true
         } );
    }
});

module.exports = CustomizationView;
