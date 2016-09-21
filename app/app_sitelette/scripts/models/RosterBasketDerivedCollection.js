/*global define*/

'use strict';

var RosterBasketDerivedItem = require('../models/RosterBasketDerivedItem'); //


var RosterBasketDerivedCollection = Backbone.Collection.extend({

    model: RosterBasketDerivedItem,

    initialize: function(models, options) {
        var self = this;
        var ownComboItemText;
        this.basket = options.basket; /* real roster model */
        _(this.basket.catalogs.models).each(function(catalog, ii, ll) {
            /*if COMBO, one entry per combo */

            if (typeof catalog.quantity === 'undefined') {
                /* COMBO orders, just get the catalog price */
                //totalPrice=totalPrice+(catalog.get('price')*catalog.get('quantity')) ;
                var catalogId = catalog.id;
                var entryItem = new RosterBasketDerivedItem({
                    rosterEntryType: 'COMBO',
                    uuid: catalogId,
                    itemId: "", //groupId,
                    groupId: "", //groupId,
                    catalogId: catalogId,
                    displayText: catalog.get('catalogDisplayText'),
                    quantity: catalog.get('quantity'), //item.quantity,
                    price: catalog.get('price'),
                    ownComboItemText:  "",
                    removeItem: function() {
                        console.log("removing " + catalogId);
                    }
                });
                self.add(entryItem);
            } else {
                console.log("From " + catalog.id + ", type:" + catalog.catalogType);
                if(catalog.id == 'BUILDYOURCOMBO'){
                    var ownComboItemArray = new Array();
                    $.each(ll[ii].models, function(key,val) {
                        if(val.itemName){
                            ownComboItemArray.push(val.itemName);
                        }
                    });
                    ownComboItemText = ownComboItemArray.toString();
                }
                /* A la carte (ITEMZIED) catalog items. NOTE: model = item */
                if (catalog.catalogType === 'COMBO') {
                    //_(catalog.models).each(function(item, index, list) {
                    //if(item.collection && item.collection.catalogType==='COMBO'){
                    var catalogId = catalog.id;

                    var entryItem = new RosterBasketDerivedItem({
                        rosterEntryType: 'COMBO',
                        uuid: catalogId,
                        itemId: "", //groupId,
                        groupId: "", //groupId,
                        catalogId: catalogId,
                        displayText: catalog.catalogDisplayText,
                        quantity: catalog.quantity, //get('quantity'), //item.quantity,
                        price: catalog.price, //get('price'),
                        ownComboItemText: ownComboItemText,
                        removeItem: function() {
                            console.log("removing " + catalogId);
                        }
                    });
                    self.add(entryItem);
                } else {
                    _(catalog.models).each(function(item, index, list) {
                        //if (item.collection && item.collection.catalogType === 'COMBO') {

                        var entryItem = new RosterBasketDerivedItem({
                            rosterEntryType: 'ITEMIZED',
                            uuid: item.get('uUID'),
                            itemId: item.get('itemId'),
                            groupId: item.get('groupId'),
                            catalogId: item.get('catalogId'),
                            displayText: item.get('itemName'),
                            quantity: item.get('quantity'),
                            price: item.get('price'),
                            removeItem: function() {
                                console.log("removing " + catalogId);
                            }
                        });
                        self.add(entryItem);

                    });
                }
            }
        });
        var sides = [];
        var combos = [];
        this.each(function(model, index) {
            if (model && model.get('catalogId') === 'SIDES') {
                sides.push(model);
            } else {
                combos.push(model);
            }
        });
        if (combos.length !== 0) {
            this.set(combos);
        }
        if (sides.length !== 0) {
            sides[0].set('title', 'SIDES/EXTRAS');
            this.add(sides);
        }
        console.log("model entries: " + self.size());
    },

    reset: function() {

    }

});

module.exports = RosterBasketDerivedCollection;
