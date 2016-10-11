/*global define*/

'use strict';

var Vent = require('../Vent'), //
loader = require('../loader'), //
CatalogBasketModel = require('../models/CatalogBasketModel'), //
orderActions = require('../actions/orderActions'), //
template = require('ejs!../templates/content/singleton_content.ejs'),
GroupView = require('./partials/groupView'), //
ComboGroupView = require('./partials/comboGroupView'), //
CatalogItemView = require('./partials/catalog_item'),
SidesCatalogItemView = require('./partials/sides_catalog_item'),
popupController = require('../controllers/popupController'),
RosterBasketDerivedCollection = require('../models/RosterBasketDerivedCollection'),
ListView = require('./components/listView');

var SingletonView = Backbone.View.extend({

    name : 'singleton',

    id: 'cmtyx_singleton',

    events: {
        'click .back' : 'goBack',
        'click .order_button' : 'triggerOrder',
        'click .basket_icon_container' : 'openEditPanel'
    },

    onShow: function() {
        this.checkIfOpened();
        this.$('.sub_header').show();
        this.listenTo(this.basket, 'reset change add remove', this.updateBasket, this);
    },

    checkIfOpened: function() {
        if (!this.isOpen) {
            popupController.textPopup({ text: this.isOpenWarningMessage }, _.bind(this.goBack, this));
        }
    },

    initialize : function(options) {
        debugger;
        this.item = options.item;
        this.sasl = options.sasl;
        this.allowPickup = this.sasl.attributes.services.catalog.paymentOnlineAccepted;
        this.basket = options.basket;
        this.backToCatalog = options.backToCatalog;
        this.backToCatalogs = options.backToCatalogs;
        this.backToRoster = options.backToRoster;
        this.isOpen = options.isOpen;
        this.isOpenWarningMessage = options.isOpenWarningMessage;
        this.colors = [ 'cmtyx_color_1', 'cmtyx_color_2', 'cmtyx_color_3', 'cmtyx_color_4' ];
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        this.render();
    },

    renderData : function() {
        return {
            basket: this.basket,
            item: this.item
        };
    },

    render: function() {
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    goBack : function() {
        this.triggerRestaurantView();
    },

    triggerRestaurantView : function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), {
            reverse : true
        });
    },

    triggerOrder : function() {
        popupController.requireLogIn(this.sasl, function() {
            this.$('.sub_header').hide();
            Vent.trigger('viewChange', 'address', {
                id : this.sasl.getUrlKey(),
                catalogId: this.item.uUID,
                backToCatalog: this.backToCatalog,
                backToCatalogs: this.backToCatalogs,
                backToRoster: this.backToRoster
            }, {
                reverse : true
            });
        }.bind(this));
    },

    openEditPanel: function() {
        popupController.editCatalogBasketView(this, this.basket, {
            actions: {
                removeItem: function(selected) {
                    _(selected).each(function(item) {
                        this.basket.removeItem(item);
                    }.bind(this));
                }.bind(this)
            },
            template: require('ejs!../templates/partials/edit_catalog_basket_item.ejs')
        });
    },

    updateBasket: function() {
        this.$('.cart_items_number').text(this.basket.getItemsNumber());
        this.$('.total_price').text('$ ' + this.basket.getTotalPrice().toFixed(2));
        this.basket.getItemsNumber() === 0 ?
        this.$('#roster_order_button').prop('disabled', true) :
        this.$('#roster_order_button').prop('disabled', false);
    },

    expandCollapseDetails: function(view) {
        if (!view.withExpandedDetails) {
            view.expandDetails();
            if (this.viewWithExpandedDetails) {
                this.viewWithExpandedDetails.collapseDetails();
            }
            this.viewWithExpandedDetails = view;
        } else {
            view.collapseDetails();
            this.viewWithExpandedDetails = false;
        }
    },

    renderItems : function() {

        this.updateBasket();

        var ItemView = this.backToRoster ? SidesCatalogItemView : CatalogItemView;

        var catalogType = this.catalogType.enumText;
        var catalogId = this.catalogId;
        var catalogDisplayText = this.catalogDisplayText;

        switch (catalogType) {
        case 'COMBO':

            _(this.items.groups).each(function(group, i) {
                if (group.unSubgroupedItems.length === 0)
                    return;

                var groupType = group.groupType.enumText;
                var groupId = group.groupId;
                var groupDisplayText = group.groupDisplayText;

                switch (groupType) {
                case 'COMBO':
                    /*
                     * use radio boxes
                     */
                    var el = new ComboGroupView({
                        onChange : function(model) {
                            this.toggleBasketComboEntry(model, groupId, groupDisplayText,catalogId,catalogDisplayText);
                        }.bind(this),
                        color : this.generateColor(i),
                        model : group,
                        parent : this
                    }).render().el;
                    this.$('.cmntyex-items_placeholder').append(el);
                    /*
                     * now add the first item for combos, but only if basket
                     * does not already have an item from this group. (remember,
                     * back button results in view being built again with
                     * existing basket).
                     */
                    var currentItemId=this.basket.isComboGroupRepresented(groupId);
                    if (typeof currentItemId==='undefined') {
                        var firstItem = group.unSubgroupedItems[0];
                        this.basket.addItemRaw(firstItem, 1, groupId, groupDisplayText, catalogId, catalogDisplayText);
                        this.updateBasket();
                    } else {
                        /*
                         * highlight that radio button then
                         */
                        $(el).find('#'+currentItemId).prop("checked", true)
                    }
                    break;
                case 'ITEMIZED':
                case 'UNDEFINED':
                default:
                    /*
                     * TODO: Convert these to check boxes.
                     */
                    var el = new GroupView({
                        onClick: function(model) {
                            this.openAddToBasketView(model, groupId, groupDisplayText, catalogId, catalogDisplayText);
                        }.bind(this),
                        color : this.generateColor(i),
                        model : group,
                        parent : this
                    }).render().el;
                    this.$('.cmntyex-items_placeholder').append(el);
                }
            }.bind(this));
            break;
        case 'ITEMIZED':
        case 'UNDEFINED':
        default:
            _(this.items.groups).each(function(group, i) {
                if (group.unSubgroupedItems.length === 0)
                    return;

                var groupType = group.groupType.enumText;
                var groupDisplayText = group.groupDisplayText;
                var groupId = group.groupId;

                var el = new GroupView({
                    // onClick : function(model) {
                    //     this.openAddToBasketView(model, groupId, groupDisplayText, catalogId, catalogDisplayText);
                    // }.bind(this),
                    onClick : function(view) {
                        this.expandCollapseDetails(view);
                    }.bind(this),
                    color : this.generateColor(i),
                    model : group,
                    parent : this,
                    basket: this.basket,
                    itemView: ItemView
                }).render().el;

                this.$('.cmntyex-items_placeholder').append(el);

            }.bind(this));
        }
    }

});

module.exports = SingletonView;
