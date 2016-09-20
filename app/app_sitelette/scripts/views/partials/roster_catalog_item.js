/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_catalog_item.ejs'), //
    ownComboItemsTpl = require('ejs!../../templates/partials/own_combo_items.ejs'),
    sidesItemsTpl = require('ejs!../../templates/partials/sides_items.ejs'),
    Vent = require('../../Vent'),//
    h = require('../../globalHelpers');

var RosterCatalogItemView = Backbone.View.extend({
    template : template,
    tagName : 'li',
    className : 'cmtyx_roster_catalog_item menuItem build_combo',
    events : {
        'click .roster_catalog_item_add_button' : 'showCatalogLocal',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity'
    },
    /* each catalog row is initialized with its own CatalogBasketModel */
    initialize : function(options) {
        this.options = options || {};
        this.basket = options.basket;
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.showCatalog = options.showCatalog;
        //this.catalogId=options.catalogId;
        //this.catalogDisplayText=options.catalogDisplayText;
    },

    render : function() {
        this.$el.html(this.template({
            catalog : this.model
        }));
        if (this.options.model && this.options.model.id === 'BUILDYOURCOMBO') {
            this.renderOwnComboItems();
        } else {
            this.renderSidesItems();
        }
        return this;
    },

    renderOwnComboItems: function() {
        var ownCombosList = _.where(this.basket.catalogs.models, 
            {'id': 'BUILDYOURCOMBO'});
        _.each(ownCombosList, function(item){
            item.itemsList = _.pluck(item.models, 'itemName').join(',');
        });
        if (ownCombosList.length > 0) {
            this.$('.combo_items_container').html(ownComboItemsTpl({list:ownCombosList}));
            debugger;
        }
    },

    renderSidesItems: function() {

    },

    showCatalogLocal : function() {
        this.showCatalog();
    },

    addToCart: function(e, action){
        var ownCombosList = _.where(this.basket.catalogs.models, 
            {'id': 'BUILDYOURCOMBO'}),
            comboIndex = $(e.target).data('owncombo'),
            combo_quantity = parseInt(this.$('#ownCombo_'+comboIndex).text()),
            count = (action == 'add') ? combo_quantity + 1 : combo_quantity - 1;

        this.$('#ownCombo_'+comboIndex).text(count);
        ownCombosList[comboIndex].quantity = count;
        
        // catalog = this.basket.getCatalog(this.model);
        // catalog = this.basket.getCatalog(this.model);
        // if (catalog) {
        //     catalog.off('change').on('change', _.bind(this.changeCount, this));
        // }

        $('.cart_items_number').text(this.basket.getComboCount());

        $('#ComboItemCount_'+catalogId).text(count);

        return;
    },

    incrementQuantity: function (e) {
        this.addToCart(e, 'add');
    },

    decrementQuantity: function (e) {
        this.addToCart(e, 'remove');
    },

    changeCount: function() {
        //TODO temporary solution
        var count = this.basket.getCatalogQuantity(this.model);
        this.$el.find('select').val('num' + count);
    },

});

module.exports = RosterCatalogItemView;
