/*global define*/

'use strict';

var Vent = require('../Vent'), //
    loader = require('../loader'), //
    h = require('../globalHelpers'),
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
        'click .catalog_item_main_view': 'expandCollapseDetails',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
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
        this.item = options.item;
        this.sasl = options.sasl;
        this.allowPickup = this.sasl.attributes.services.catalog.paymentOnlineAccepted;
        this.basket = options.basket;
        this.backToCatalog = options.backToCatalog;
        this.backToCatalogs = options.backToCatalogs;
        this.backToRoster = options.backToRoster;
        this.backToSingleton = options.backToSingleton;
        this.isOpen = options.isOpen;
        this.isOpenWarningMessage = options.isOpenWarningMessage;
        this.withExpandedDetails = false;
        this.colors = [ 'cmtyx_color_1', 'cmtyx_color_2', 'cmtyx_color_3', 'cmtyx_color_4' ];
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        this.render();
    },

    renderData : function() {
        return {
            basket: this.basket,
            item: this.basket.models[0].toJSON()
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
                backToRoster: this.backToRoster,
                backToSingleton: this.backToSingleton
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
        this.$('.quantity').text(this.basket.models[0].get('quantity'));
        this.basket.getItemsNumber() === 0 ?
        this.$('#roster_order_button').prop('disabled', true) :
        this.$('#roster_order_button').prop('disabled', false);
    },

    expandCollapseDetails: function(view) {
        this.withExpandedDetails ? this.collapseDetails() : this.expandDetails();
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

    incrementQuantity: function() {

        h().playSound('addToCart');

        this.addItem = true;
        this.item.quantity = this.item.quantity + 1;
        this.addToBasket();
        return false;
    },

    decrementQuantity: function() {
        this.addItem = false;
        var qty = this.item.quantity;

        if (qty === 0) return false;

        h().playSound('removeFromCart');

        this.item.quantity = this.item.quantity - 1;
        this.addToBasket();
        return false;
    },

    addToBasket: function() {
        var currentQuantity = this.basket.models[0].get('quantity');
        this.addItem ?
        this.basket.models[0].set('quantity', currentQuantity + 1) :
        this.basket.models[0].set('quantity', currentQuantity - 1);
    }

});

module.exports = SingletonView;
