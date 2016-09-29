/*global define*/

'use strict';

var CatalogBasketItem = require('../models/CatalogBasketItem'); //


var CatalogBasketModel = Backbone.Collection.extend({

    model : CatalogBasketItem,
    /* catalog uuid */
    idAttribute : 'uUID',

      id:0,
      quantity:0,
      price:0,

    initialize : function(models, options) {
       this.prices = new Backbone.Model();
       this.price=0;
       this.quantity=0;

    },

    setCatalogDetails : function(catalogDetails) {
        this.id=catalogDetails.catalogUUID;
        this.uUID=catalogDetails.catalogUUID;
        this.idAttribute = catalogDetails.catalogUUID;
        this.catalogDisplayText = catalogDetails.catalogDisplayText;
        this.catalogType = catalogDetails.catalogType;
        this.price=catalogDetails.price;
        this.quantity=catalogDetails.quantity;
    },

    changeItemInCombo : function(item, groupId, groupDisplayText,catalogId,catalogDisplayText) {

        /*
         * find item with same group in this. remove it. add new item.
         */
        var self = this;
        var foundElementToRemove = false;
        this.each(function(itemInCart, index, list) {
            if (typeof itemInCart === 'undefined') {
                console.log("itemInCart undefined, ignoring");
            } else {
                var quantity = itemInCart.get('quantity');
                var itemName = itemInCart.itemName;
                var group = itemInCart.groupId;
                if (group === groupId && foundElementToRemove === false) {
                    foundElementToRemove = true;
                    self.remove(itemInCart.get('uUID'));
                }
            }
        });
        /*
         * add the new item
         */
        var itemOptions = _.extend({}, item.attributes, {
            quantity : 1,
            groupId : groupId,
            catalogId : catalogId,
            groupDisplayText:groupDisplayText,
            catalogDisplayText:catalogDisplayText
        });

        /*
         * create basketItem model
         */

        var itemModel = new CatalogBasketItem(itemOptions);

        /*
         * add the itemModel to the collection
         */
        this.add(itemModel);

        this.dumpCartToConsole();

    },

    changeItem: function(item, count) {
        var itemModel = this.get(item.get('uUID'));
        itemModel.set('quantity', count);
        if (!itemModel.get('quantity') || itemModel.get('quantity') === 0) {
            this.removeItem(itemModel);
        }
    },

    addItem : function(item, count, groupId, groupDisplayText,catalogId,catalogDisplayText) {
        // console.log("BasketModel:addItem::"+item.get('itemName')+",
        // "+groupId+", "+catalogId);
        var itemModel = this.get(item.get('uUID'));
        if (itemModel) {
            itemModel.add(count);
            if (!itemModel.get('quantity') || itemModel.get('quantity') === 0) {
                this.removeItem(itemModel);
            }
        } else {
            /*
             * create item options, pass groupId, catalogId
             */
            var itemOptions = _.extend({}, item.attributes, {
                quantity : count || 1,
                groupId : groupId,
                groupDisplayText:groupDisplayText,
                catalogId : catalogId,
                catalogDisplayText:catalogDisplayText
            });

            /*
             * create basketItem model
             */

            var itemModel = new CatalogBasketItem(itemOptions);

            /*
             * add the itemModel to the collection
             */
            this.add(itemModel);
        }
        this.dumpCartToConsole();
    },

    addItemRaw : function(itemRaw, count, groupId,groupDisplayText, catalogId,catalogDisplayText) {

        /*
         * create item options, pass groupId, catalogId
         */
        var itemOptions = _.extend({}, itemRaw, {
            quantity : count || 1,
            groupId : groupId,
            groupDisplayText:groupDisplayText,
            catalogId : catalogId,
            catalogDisplayText:catalogDisplayText

        });

        /*
         * create basketItem model
         */

        var itemModel = new CatalogBasketItem(itemOptions);

        /*
         * add the itemModel to the collection
         */
        this.add(itemModel);

        this.dumpCartToConsole();
    },

    removeItem : function(item) {
        this.remove(item.get('uUID'));
    },

    getNumOf : function(item) {
        var model = this.get(item.get('uUID'));
        if (model) {
            return model.get('quantity');
        } else {
            return 0;
        }
    },

    getTotalPrice : function() {
        return this.reduce(function(sum, item, id) {
            return sum += item.get('quantity') * item.get('price');
        }.bind(this), 0);
    },

    count : function() {
        return this.reduce(function(sum, item) {
            return sum += item.get('quantity');
        }.bind(this), 0);
    },

    getItemsNumber: function() {
        return this.length;
    },

    dumpCartToConsole : function() {

        console.log(">>>> CatalogBasket for catalog:" + this.catalogDisplayText);
        this.each(function(item, index, list) {
            var quantity = item.get('quantity');
            var itemName = item.itemName;
            var group = item.groupId;

            console.log("*** " + itemName + ":[" + quantity + "] from Group:" + group);
        });
        console.log("<<<<---------------------------");
    },

    removeAllItems : function() {
        this.reset();
    },

    isComboGroupRepresented:function(groupId){

        var itemId;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                 if(item.groupId===groupId){
                     itemId=item.id;
                 }
            }
        });
        return itemId;
    },

    hasCombo : function() {
        var comboCount= _(this.getComboCatalogs()).size();
        if(comboCount>0){
            return true;
        }else{
            return false;
        }
//        var hasCombo = false;
//        this.each(function(item, index, list) {
//            if (hasCombo === false && item.itemType === 'COMBO') {
//                hasCombo = true;
//            }
//            ;
//        });
//        return hasCombo;
    },

    getComboCatalogs : function(){
        var comboCatalogsArray={};
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                if(! _(comboCatalogsArray).has(item.catalogId)){
                  comboCatalogsArray[item.catalogId]={catalogDisplayText:item.catalogDisplayText,price:item.get('price')};
                }else{
                    /* update the price */
                    var tmpObj=  comboCatalogsArray[item.catalogId];
                    var tmpPrice=tmpObj.price;
                    var newPrice=tmpPrice+item.get('price');
                    tmpObj.price=newPrice;
                    comboCatalogsArray[item.catalogId]=tmpObj;
                }
            }
            ;
        });
        return comboCatalogsArray;
    },
    getComboCount : function() {
        return  _(this.getComboCatalogs()).size();
    },

    getComboPrice : function() {
        var comboPrice=0;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                comboPrice=comboPrice+item.get('price');
            }
            ;
        });
        return comboPrice;
    },

    nonComboItemCount : function() {
        var nonComboCount=0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboCount=nonComboCount+item.get('quantity');
            }
            ;
        });
        return nonComboCount;
    },

    getNonComboPrice : function() {
        var nonComboPrice=0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboPrice=nonComboPrice+item.get('price');
            }
            ;
        });
        return nonComboPrice;
    },
    getNonComboItems : function() {
        var nonComboItems=[];
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboItems.push({itemName:item.itemName, quantity:item.get('quantity'), price:item.get('price')});
            }
            ;
        });
        return nonComboItems;
    },

    getItems: function(sasl) {
        var orderItems = [];

        if (this.hasCombo()) {
            _(this.getComboCatalogs()).each(function(item) {
                orderItems.push(item);
            });
            _(this.getNonComboItems()).each(function (item) {
                orderItems.push(item);
            });
        } else {
            var intraOrderAssociationIndex = 0;
            this.models.map(function (item) {
                intraOrderAssociationIndex ++;
                var orderItem = {
                    serviceAccommodatorId: sasl.sa(),
                    serviceLocationId: sasl.sl(),
                    priceId: item.get('priceId'),
                    itemId: item.get('itemId'),
                    groupId: item.get('groupId'),
                    catalogId: item.get('catalogId'),
                    itemVersion: item.get('itemVersion'),
                    quantity: item.get('quantity'),
                    intraOrderAssociationTag: item.get('catalogId') + intraOrderAssociationIndex
                };
                orderItems.push(orderItem);
            });
        }

        return orderItems;
    }

});

module.exports = CatalogBasketModel;
