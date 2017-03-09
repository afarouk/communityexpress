/*global define*/

'use strict';

var template = require('ejs!../../templates/editRosterView.ejs'), //
    loader = require('../../loader'), //
    PanelView = require('../components/panelView'), //
    ListView = require('../components/listView'),//
    EditRosterViewItem = require('../partials/edit_roster_view_item'),//
    h = require('../../globalHelpers');

var EditRosterView = PanelView.extend({

    template : template,

    addedEvents : {
        // 'click .plus_button': 'incrementQuantity',
        // 'click .minus_button': 'decrementQuantity',
        'click .cart_add_delete_item': 'addOrDeleteItem',
        'click .order_btn': 'triggerOrder'
    },

    initialize : function(options) {
        this.options = options;
        options = options || {};
        // this.changedCatalogs = {};
        this.createChangeCatalogs();
        this.basket = this.model.basket;

        this.itemTemplate = options.template;

        this.actions = options.actions;

        this.$el.attr({
            'id' : 'cmntyex_edit_favorites_panel'
        });

        this.addEvents(this.addedEvents);
        this.listenTo(this, 'close:all', this.saveBasket, this);
    },

    render : function(update) {
        var editable = true;

        this.$el.html(this.template({
            editable : editable
        }));
        this.$el.find('.cmntyex-list_container').html(new ListView({
            collection : this.collection,
            ListItemView : EditRosterViewItem,
            ListItemViewOptions : {
                template : this.itemTemplate
            },
            parent : this
        }).render().el);
        this.afterRender(); // call it for each panel if you replaced render
        this.$('.total_price').text('$ ' + this.basket.getTotalPrice().toFixed(2));
        return this;
    },

    //  we need this strange logic because in other case we should make serious changes in our application 
    //  it can take a lot of time
    createChangeCatalogs: function() {
        function ChangedCatalogs() {};
        ChangedCatalogs.prototype.onChanged = this.updateTotalPrice.bind(this);
        this.changedCatalogs = new ChangedCatalogs();
    },

    updateTotalPrice: function() {
        var temporaryBasket = this.basket.getBasketItemsForSubtotal(this.changedCatalogs);
        var subTotalPrice = 0;
        _.each(temporaryBasket, function(item) {
            subTotalPrice += item.quantity * item.price;
        })
        this.$('.total_price').text('$ ' + subTotalPrice.toFixed(2));
    },
    // end

    saveBasket: function() {
        if (this.changedCatalogs.length === 0) return;
        _.each(this.changedCatalogs, _.bind(function(catalog){
            this.basket.addCatalog(catalog.catalog, catalog.quantity, catalog.catalogId);
        }, this));
    },

    removeSelected : function(e) {

        loader.show('deleting items');
        var selected = this.collection.where({
            selected : true
        });
        $.when(this.actions.removeItem(selected)).then(function() {
            loader.hide();
        }.bind(this), function() {
            loader.showFlashMessage(h().getErrorMessage(e, 'error deleting'));
        });

        this.basket = this.options.parent.basket;
        console.log(this.basket.getComboCount());
        // $('.cart_items_number').text(this.basket.getComboCount());

        this.shut();

    },

    addOrDeleteItem: function(e, action) {
        var catalogId = e.target.attributes.catalogid.value;
        var catalog_quantity = parseInt($('#itemCount_'+catalogId).text());
        console.log(catalog_quantity);

        var count = (action == 'add') ? catalog_quantity + 1 : catalog_quantity - 1,
            currentModel;

        console.log(count);

        if(count === 0){
            $('#itemCount_'+catalogId).text(count);
            $('#ComboItemCount_'+catalogId).text(count);
            this.removeSelected(e);
        }
        else{
            console.log(this.options.parent);

            this.basket = this.options.parent.basket;
            var initialCnt=this.basket.getComboCount();

            this.catalogId = e.target.attributes.catalogid.value;

            console.log( this.catalogId);

            this.catalogDisplayText=e.target.attributes.catalogdisplaytext.value;

            currentModel = this.model.findWhere({catalogId: this.catalogId});
            this.basket.addCatalog(currentModel.toJSON(), count,  this.catalogId,this.catalogDisplayText);

            this.listenTo(initialCnt, 'change:value', initialCnt+count, this);

            console.log(this.basket.getComboCount());

            // $('.cart_items_number').text(this.basket.getComboCount());

            $('#itemCount_'+catalogId).text(count);
            $('#ComboItemCount_'+catalogId).text(count);

            return;
        }
    },

    incrementQuantity: function (e) {
        this.addOrDeleteItem(e, 'add');
    },

    decrementQuantity: function (e) {
        this.addOrDeleteItem(e, 'remove');
    },

    _update : function() {
        this.render(true);
        this.enhance();
    },

    triggerOrder: function() {
        this.parent.triggerOrder();
    }

});

module.exports = EditRosterView;
