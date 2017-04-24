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
        console.log(options.subItems);
        this.on('show', this.onShow, this);
        this.render();
        //TODO update basket items number on change
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
            basketItemsNumber: this.options.basket.getItemsNumber()
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
            'change input': 'onSelected',
            'click .done-btn': 'onDone',
            'click .basket_icon_container' : 'openEditPanel'
        });
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
            var selected = this.$('input[type="checkbox"]:checked');
            var noChecked = this.$('input:checkbox:not(:checked)');
            var $row = noChecked.parents('.cmntyex-catalog-item');
            var $subItem = noChecked.parents('[name="customize_subitem"]');
            if (selected.length === subItem.maxSubSubCount) {
                $row.addClass('not-allow');
                $subItem.addClass('allow');
            } else {
                $row.removeClass('not-allow');
                $subItem.removeClass('allow');
            }
        } else {
            var selected = this.$('input[type="radio"]:checked');
            var $subItem = selected.parents('[name="customize_subitem"]');
            if (selected.length === subItem.maxSubSubCount) {
                $subItem.addClass('allow');
            } else {
                $subItem.removeClass('allow');
            }
        }
        this.changeSelectedState();
    },

    checkRadio: function() {
        var selected = this.$('input[type="radio"]:checked');
        var $subItem = selected.parents('[name="customize_subitem"]');
        $subItem.addClass('allow');
        this.changeSelectedState();
    },

    changeSelectedState: function() {
        var $allowed = this.$('[name="customize_subitem"].allow'),
            $doneBtns = this.$('.done-btn'); 
        if ($allowed.length === this.options.subItems.length) {
            $doneBtns.attr('disabled', false);
        } else {
            $doneBtns.attr('disabled', true);
        }
    },

    onDone: function() {
        debugger;
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
            backToRoster:false
         } );
    }
});

module.exports = CustomizationView;
