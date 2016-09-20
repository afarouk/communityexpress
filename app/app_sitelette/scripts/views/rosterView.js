/*global define*/

'use strict';

var Vent = require('../Vent'), //
    loader = require('../loader'), //
    appCache = require('../appCache.js'),
    template = require('ejs!../templates/content/roster_content.ejs'),
    RosterBasketModel = require('../models/RosterBasketModel'), //
    RosterBasketDerivedCollection = require('../models/RosterBasketDerivedCollection'),//
    CatalogBasketModel = require('../models/CatalogBasketModel'), //
    orderActions = require('../actions/orderActions'), //
    RosterComboItemView = require('./partials/roster_combo_item.js'), //
    RosterCatalogItemView = require('./partials/roster_catalog_item.js'), //
    popupController = require('../controllers/popupController'),
    ListView = require('./components/listView');

var RosterView = Backbone.View.extend({

    name: 'roster',
    id: 'cmtyx_roster',

    addEvents: function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    },

    onShow: function(options) {
        this.addEvents({
            'click .order_button': 'triggerOrder',
            'click .edit_button': 'openEditPanel'
        });

        /* if launched from URL, hide back button*/
        // if (typeof this.launchedViaURL !== 'undefined' && this.launchedViaURL === true) {
        //     $(this.el).find('.navbutton_back').hide();
        // } else {
        //     $(this.el).find('.navbutton_back').show();
        // };

        var comboCount = this.basket.getComboCount();
        var nonComboCount = this.basket.getNonComboItemCount();
        if (comboCount === 0 && nonComboCount === 0) {
            $('#roster_order_button').prop('disabled', true);
        } else {
            $('#roster_order_button').prop('disabled', false);
        };
        this.updateBasket();
        // this.checkIfOpened();
        //$('.select').select2();
    },

    // check if user can make an order at this time
    checkIfOpened: function() {
        //this.roster.isOpen = !Math.round(Math.random());
        //this.roster.isOpen = true; // remove this row when param will be available !!!
        if (!this.roster.isOpen) {
            this.openSubview('textPopup',
                { text: this.isOpenWarningMessage },
                this.goBack);
            // I don't know, exactly, what should be when I click OK
            // right now we return to the restaurant
            // is it correct ???
        }
    },

    initialize: function(options) {
        this.roster = options.roster.collection;
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.backToRoster = options.backToRoster;
        this.rosterId = options.rosterId;
        this.rosterType = options.roster.data.rosterType.enumText;
        this.rosterDisplayText = options.roster.data.displayText;
        this.isOpenWarningMessage = options.roster.data.isOpenWarningMessage;
        this.launchedViaURL = options.launchedViaURL;
        this.on('show', this.onShow, this);
        this.render();
    },

    render: function() {
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));

        this.renderItems();
        this.listenTo(this.basket, 'reset change add remove', this.updateBasket, this);
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    /*used to initialie roster_content.ejs template */
    renderData: function() {
        return {
            basket: this.basket
        };
    },

    /* used to update the roster view created originally */
    updateBasket: function() {
        this.$('.cart_items_number').text(this.basket.getItemsNumber());
        this.$('.total_price').text('$ ' + this.basket.getTotalPrice());
        var comboCount = this.basket.getComboCount();
        var nonComboCount = this.basket.getNonComboItemCount();
        if (comboCount === 0 && nonComboCount === 0) {
          $('#roster_order_button').prop('disabled', true);
        } else {
            $('#roster_order_button').prop('disabled', false);
        }
        this.$('#cmtyx_roster_cart_comboCount').text(comboCount + " x");
        this.$('#cmtyx_roster_cart_nonComboCount').text(nonComboCount + " x");
    },

    goBack: function() {
        this.triggerRestaurantView();
    },

    triggerRestaurantView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), {
            reverse: true
        });
    },

    /* used for showing the flyout for combo items */
    openAddToBasketView: function(model, catalogId, catalogDisplayText,catalogType) {
        popupController.addToRosterBasket(model, {
            basket: this.basket,
            catalogId: catalogId,
            catalogDisplayText: catalogDisplayText,
            catalogType:catalogType,
            launchedViaURL:this.launchedViaURL
        });
    },


    triggerOrder: function() {

        var editModel= new RosterBasketDerivedCollection ([], {basket:this.basket});

        popupController.requireLogIn(this.sasl, function() {
            Vent.trigger('viewChange', 'address', {
                id: this.sasl.getUrlKey(),
                rosterId: this.rosterId,
                backToCatalog: true, // /* This will always be true */
                backToCatalogs: this.backToCatalogs,
                editModel : editModel,
                /*
                 * not used by order,
                 * but passed back to
                 * catalog view
                 */
                backToRoster: true,
                launchedViaURL: this.launchedViaURL,
                navbarView: this.navbarView
            }, {
                reverse: true
            });
        }.bind(this));
    },

    openEditPanel: function() {
        var editModel= new RosterBasketDerivedCollection ([], {basket:this.basket});
        popupController.editRosterView(this, editModel, {
            actions: {
                removeItem: function(selected) {
                    _(selected).each(function(item) {
                        this.basket.removeItem(item);
                    }.bind(this));
                }.bind(this)
            },
            template: require('ejs!../templates/partials/edit_roster_view_item.ejs')
        });
    },

    renderItems: function() {

        switch (this.rosterType) {
            case 'COMBO':
                /*
                 * add the ul
                 */
                var $ul = $('<ul></ul>');
                /* sort the catalogs by index */
                this.roster.catalogs=_.sortBy(this.roster.catalogs,function(catalog){
                      return catalog.indexInRoster;
                });
                _(this.roster.catalogs).each(
                    function(catalog, i) {
                        var catalogType = catalog.catalogType.enumText;
                        var catalogId = catalog.catalogId;
                        var catalogDisplayText = catalog.displayText;
                        switch (catalogType) {
                            case 'COMBO':
                                var showOneClickOrder = true;
                                _(catalog.groups).each(function(group, ii, ll) {
                                    if (_(group.unSubgroupedItems).size() > 1) {
                                        showOneClickOrder = false;
                                    }
                                });
                                if (showOneClickOrder) {
                                    var li = new RosterComboItemView({
                                        onClick: function(model) {
                                            //this.$('#cmtyx_roster_cart_summary').fadeIn('slow');
                                            this.openAddToBasketView(model, catalogId, catalogDisplayText, catalogType);
                                        }.bind(this),
                                        model: catalog,
                                        parent: this
                                    }).render().el;
                                    $ul.append(li);
                                } else {
                                    var li = new RosterCatalogItemView({
                                        showCatalog: function(model) {
                                            this.triggerCatalogView(catalog, catalogId, catalogDisplayText,catalogType);
                                        }.bind(this),
                                        model: catalog,
                                        basket: this.basket,
                                        parent: this
                                    }).render().el;
                                    $ul.append(li);
                                }
                                break;
                            case 'ITEMIZED':
                            case 'UNDEFINED':
                            default:

                                var li = new RosterCatalogItemView({
                                    showCatalog: function(model) {
                                        this.triggerCatalogView(catalog, catalogId, catalogDisplayText,catalogType);
                                    }.bind(this),
                                    model: catalog,
                                    parent: this
                                }).render().el;
                                $ul.append(li);

                        }

                    }.bind(this));
                this.$('.cmntyex-items_placeholder').append($ul);
                break;
            case 'ITEMIZED':
            case 'UNDEFINED':
            default:
        }

        //$('.select').select2();
    },

    triggerCatalogView: function(catalog, catalogId, catalogDisplayText) {
        /*
         did we create the catalog in our basket already? If not create it now, and set it
         in appcache for catalog dialog to fine.
         */
        var tempCatalogBasket = this.basket[catalogId];
        if (typeof tempCatalogBasket === 'undefined') {
            var catalogDetails = {
                catalogUUID: catalog.catalogId,
                catalogDisplayText: catalog.displayText,
                catalogType: catalog.catalogType.enumText,
                price: catalog.price,
                quantity: 0
            };
            tempCatalogBasket = new CatalogBasketModel();
            tempCatalogBasket.setCatalogDetails(catalogDetails);
            this.basket[catalogId] = tempCatalogBasket;
            /* push this specific catalog model to app cache */
            appCache.set(this.sasl.sa() + ':' + this.sasl.sl() + ':' + catalogId + ':catalogbasket', this.basket[catalogId]);
        }


        Vent.trigger('viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: catalogId,
            backToCatalog: true,
            backToCatalogs: false,
            backToRoster: true,
            rosterId: this.rosterId,
            launchedViaURL: this.launchedViaURL,
            navbarView: this.navbarView
        }, {
            reverse: false
        });
    },

    modelChanged:function(){
       this.updateBasket();
    }

});

module.exports = RosterView;
