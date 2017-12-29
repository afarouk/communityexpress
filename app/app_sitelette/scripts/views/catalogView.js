/*global define*/

'use strict';

var Vent = require('../Vent'), //
loader = require('../loader'), //
CatalogBasketModel = require('../models/CatalogBasketModel'), //
orderActions = require('../actions/orderActions'), //
template = require('ejs!../templates/content/catalog_content.ejs'),
GroupView = require('./partials/groupView'), //
ComboGroupView = require('./partials/comboGroupView'), //
CatalogItemView = require('./partials/catalog_item'),
SidesCatalogItemView = require('./partials/sides_catalog_item'),
popupController = require('../controllers/popupController'),
RosterBasketDerivedCollection = require('../models/RosterBasketDerivedCollection'),
ListView = require('./components/listView'),
moment = require('moment');

var CatalogView = Backbone.View.extend({

    moment: moment,

    name : 'catalog',

    id: 'cmtyx_catalogView',

    events: {
        'click .back' : 'goBack',
        // 'click .order_button' : 'triggerOrder',
        'click .order_button' : 'openEditPanel', //new requirement
        'click .add_combo_button' : 'goBackAndSendCatalogInfo',
        'click .basket_icon_container' : 'openEditPanel'
    },

    onShow: function() {
        this.checkIfOpened();
        $(this.$('.firstItem a')[0]).trigger('click');
        //TODO --> check listenTo part after jquery.mobile will be fixed
        this.listenTo(this.basket, 'reset change add remove', this.updateBasket, this);
        if(this.backToRoster === true){
          /* hide the order button */
        //   this.$('.cart_items_number').text(this.rosterBasket.getItemsNumber());
          this.$('.order_button').hide();
          this.$('.edit_button').hide();
          if (this.catalogType.enumText === 'COMBO' || this.catalogType === 'COMBO') {
            this.$('.add_combo_button').show();
            $("#catalog_items_row").css("visibility", "hidden");
            $("#catalog_extras_row").css("visibility", "hidden");
          } else {
            // this.$('.add_combo_button').hide();
            this.$('.back_next_btns').hide();
          }
        } else {
          this.$('.order_button').show();
          this.$('.back_next_btns').hide();
        //   this.$('.add_combo_button').hide();
        }
    },

    checkIfOpened: function() {
        if (!this.isOpen) {
            popupController.textPopup({ text: this.isOpenWarningMessage }, _.bind(this.goBack, this));
        }
    },

    initialize: function(options) {
        var colors = [ 'cmtyx_color_1', 'cmtyx_color_3' ];
        this.options = options || {};
        this.items = options.catalog.collection;
        this.sasl = options.sasl;
        this.allowPickup = this.sasl.attributes.services.catalog.paymentOnlineAccepted;
        this.basket = options.basket;
        this.rosterBasket = options.rosterBasket;
        this.backToCatalogs = options.backToCatalogs;
        this.backToRoster = options.backToRoster;
        this.rosterId = options.rosterId;
        this.catalogId = options.catalog.data.catalogId;
        this.catalogType = options.catalog.data.catalogType;
        this.catalogDisplayText = options.catalog.data.displayText;
        this.isOpen = options.isOpen;
        this.isOpenWarningMessage = options.isOpenWarningMessage;
        this.promoCode = options.promoCode;
        this.colors = colors;
        /* add catalog name to basket */
        this.basket.catalogDisplayText = options.catalog.collection.displayText;
        this.launchedViaURL = options.launchedViaURL;

        this.preopenAllPictures = this.options.catalog.data ?
            this.options.catalog.data.preExpandItemsOnUI : null;
        this.direction = this.options.catalog.data ?
            this.options.catalog.data.scrollDirection.enumText : null;
console.log('Preopen: ', this.preopenAllPictures);
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        this.render();
    },

    renderData: function() {
        return {
            basket : this.basket
        };
    },

    render: function() {
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        this.renderItems();
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    goBack: function() {
        if ( this.backToRoster) {
          this.triggerRosterView( );
        } else if(this.backToCatalogs) {
            this.triggerCatalogsView();
        } else {
            this.triggerRestaurantView();
        }
    },

    goBackAndSendCatalogInfo: function(){
        this.triggerRosterViewWithCatalog();
    },

    triggerRosterView: function() {
      Vent.trigger('viewChange', 'roster', {
          sasl: this.sasl.id,
          id: this.rosterId,
          backToRoster: true, /* bad design: should be using reverse true */
          rosterId: this.rosterId,
          cloneCatalogAndAdd: false,
          catalogId: this.catalogId,
          catalogType: this.catalogType.enumText,
          catalogDisplayText: this.catalogDisplayText,
          launchedViaURL: this.launchedViaURL
       }, { reverse: true });
    },

    triggerRosterViewWithCatalog: function() {
        Vent.trigger('viewChange', 'roster', {
            sasl: this.sasl.id,
            id: this.rosterId,
            backToRoster: true, /* bad design: should be using reverse true */
            rosterId: this.rosterId,
            cloneCatalogAndAdd: true,
            catalogId: this.catalogId,
            catalogType: this.catalogType.enumText,
            catalogDisplayText: this.catalogDisplayText,
            launchedViaURL: this.launchedViaURL
        }, { reverse: true });

    },

    triggerCatalogsView: function() {
        Vent.trigger('viewChange', 'catalogs', this.sasl.getUrlKey());
    },

    triggerRestaurantView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), {
            reverse : true
        });
    },

    openAddToBasketView: function(model, groupId, groupDisplayText, catalogId, catalogDisplayText) {
        // console.log("CatalogView:openAddToBasketView
        // :"+model.attributes.itemName+", "+groupId+", "+catalogId);
        this.openSubview('addToCatalogBasket', model, {
            basket : this.basket,
            groupId : groupId,
            groupDisplayText : groupDisplayText,
            catalogId : catalogId,
            catalogDisplayText : catalogDisplayText,
            launchedViaURL:this.launchedViaURL
        });
    },

    toggleBasketComboEntry: function(model, groupId, groupDisplayText,catalogId,catalogDisplayText) {
        // console.log("CatalogView:toggleBasketComboEntry
        // :"+model.attributes.itemName+", "+groupId+", "+catalogId);
        this.basket.changeItemInCombo(model, groupId, groupDisplayText,catalogId,catalogDisplayText);
    },

    triggerOrder: function() {
        this.basket.getItemsNumber() === 0 ?
        this.showNoItemsPopup() :
        popupController.requireLogIn(this.sasl, function() {
            this.$('.sub_header').hide();
            Vent.trigger('viewChange', 'address', {
                id : this.sasl.getUrlKey(),
                promoCode: this.promoCode,
                catalogId : this.catalogId,
                deliveryPickupOptions: this.options.catalog.collection.deliveryPickupOptions,
                backToCatalog : true,// /* This will always be true */
                backToCatalogs : this.backToCatalogs, /*
                                                         * not used by order,
                                                         * but passed back to
                                                         * catalog view
                                                         */
                launchedViaURL:this.launchedViaURL,
                navbarView : this.navbarView
            }, {
                reverse : true
            });
        }.bind(this));
    },

    showNoItemsPopup: function() {
        popupController.textPopup({
            text: 'Please, select at least one item'
        });
    },

    openEditPanel: function() {
        if (this.rosterBasket) {
            this.openRosterBasketEditPanel();
        } else {
            this.openBasketEditPanel();
        }
    },

    openRosterBasketEditPanel: function() {
        var editModel= new RosterBasketDerivedCollection ([], {basket:this.rosterBasket});
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

    openBasketEditPanel: function() {
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

    updateBasket: function(model, unneeded, status) {
        if (this.rosterBasket && this.catalogId === 'BUILDYOURCOMBO') {
            this.$('.cart_items_number').text(this.rosterBasket.getItemsNumber());
            this.$('.total_price').text('$ ' + this.rosterBasket.getTotalPrice().toFixed(2));
        } else {
            this.$('.cart_items_number').text(this.basket.getItemsNumber());
            this.$('.total_price').text('$ ' + this.basket.getTotalPrice().toFixed(2));
        }

        //add items animation
        if (model && model.get('quantity')) {
            var $animElement = this.$('[name="cart-item-added"]');
            //reset animation on fasl click add item
            $animElement.addClass('stop');
            setTimeout(function(){
                $animElement.removeClass('stop');
            }, 0);
            //.................
            $animElement.off('animationend').on('animationend', function(){
                $animElement.removeClass('changed').removeClass('added');
            });
            if (status) {
                if (status.add) {
                    //animation on add
                    $animElement.removeClass('changed').addClass('added').text('Item added');
                }
            } else {
                // animation quantity changed
                $animElement.removeClass('added').addClass('changed').text('Item quantity changed');
            }
        }
    },

    expandCollapseDetails: function(view) {
        if (this.direction === 'HORIZONTAL') return;
        if (!view.withExpandedDetails) {
            view.expandDetails();
            if (this.viewWithExpandedDetails && !this.preopenAllPictures) {
                this.viewWithExpandedDetails.collapseDetails();
            }
            this.viewWithExpandedDetails = view;
        } else {
            view.collapseDetails();
            this.viewWithExpandedDetails = false;
        }
    },

    generateColor: function(index) {
        return this.colors[index % this.colors.length];
    },

    getValidGroups: function(groups) {
        //filter groups by isValidSomeTimeOnly
        var filtered = _.filter(groups, function(group){
                if (!group.isValidSomeTimeOnly) {
                    return group;
                } else {
                    var validity = group.groupValidityTimeSlots, //hasValidTime
                        startTime = (this.moment()).hour(validity.timeSlot.hour).minute(validity.timeSlot.minute),
                        endTime = (this.moment()).hour(validity.timeSlot.endHour).minute(validity.timeSlot.endMinute),
                        isBetween = this.moment().isBetween(startTime, endTime);
                    if (isBetween) return group;
                }
            }.bind(this));
        return filtered;
    },

    renderItems: function() {

        this.updateBasket();

        var ItemView = this.backToRoster ? SidesCatalogItemView : CatalogItemView;

        var catalogType = this.catalogType.enumText;
        var catalogId = this.catalogId;
        var catalogDisplayText = this.catalogDisplayText;

        var groups = this.getValidGroups(this.items.groups);

        switch (catalogType) {
        case 'COMBO':

            _(groups).each(function(group, i) {
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
            _(groups).each(function(group, i) {
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
                    itemView: ItemView,
                    preopenAllPictures: this.preopenAllPictures
                }).render().el;

                this.$('.cmntyex-items_placeholder').append(el);

            }.bind(this));
        }
    }

});

module.exports = CatalogView;
