/*global define*/


    // modelId: function (attrs) {
    //   return attrs.type + "-" + attrs.id;
    // }


'use strict';

var CatalogBasketItem = require('../models/CatalogBasketItem'); //

var CatalogBasketModel = Backbone.Collection.extend({

    model : CatalogBasketItem,
    /* catalog uuid */
    idAttribute : 'uuid',

      id:0,
      quantity:0,
      price:0,

    modelId: function (attrs) {
        return this.getUUID(attrs);
    },

    initialize : function(models, options) {
       this.prices = new Backbone.Model();
       this.price=0;
       this.quantity=0;

    },

    setCatalogDetails : function(catalogDetails) {
        this.id=catalogDetails.catalogUUID;
        this.uuid=catalogDetails.catalogUUID;
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
                    self.remove(itemInCart.get('uuid'));
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
        var itemModel = this.get(item.get('uuid'));
        itemModel.set('quantity', count);
        if (!itemModel.get('quantity') || itemModel.get('quantity') === 0) {
            this.removeItem(itemModel);
        }
    },

    getCustomizationMark: function(attrs) {
        var hash = '[';
        _.each(attrs.subItems, function(subItem, key) {
            hash += 'i' + key + ':' + _.pluck(subItem, 'subSubItemId').join('|') + '_';
        });
        hash += ']';
        return hash;
    },

    getUUID: function(item) {
        var attrs = item instanceof Backbone.Model ? item.attributes : item,
            uuid = attrs.uuid;

        if (attrs.wasCustomized) {
            uuid += this.getCustomizationMark(attrs);
        }
        return uuid;
    },

    getItem: function(item) {
        return this.get(this.getUUID(item));
    },

    removeItem : function(item) {
        return this.remove(this.getUUID(item));
    },

    addItem : function(item, count, groupId, groupDisplayText,catalogId,catalogDisplayText) {
        var itemModel = this.getItem(item);
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

    changeVersionItem: function(item, count) {
        var itemModel = this.getItem(item);
        itemModel.set('quantity', count);
        itemModel.trigger('updateVersions');
        if (!itemModel.get('quantity') || itemModel.get('quantity') === 0) {
            this.removeItem(itemModel);
        }
    },

    setBasketVersions: function(model, versions) {
        if (typeof this.versions !== 'object') {
            this.versions = {};
        }
        var uuid = model.get('uuid');
        this.versions[uuid] = versions;
    },

    getBasketVersions: function(model) {
        if (typeof this.versions !== 'object') {
            return null;
        }
        var uuid = model.get('uuid');
        return this.versions[uuid];
    },

    removeVersion: function(model) {
        if (typeof this.versions !== 'object') {
            return null;
        }
        var uuid = model.get('uuid'),
            version = this.versions[uuid.split('_._')[0]],
            removed = version.selectedVersions.find(function(v) {
                return v.version.get('uuid') === uuid;
            }),
            index = version.selectedVersions.indexOf(removed);
            version.selectedVersions.splice(index, 1);
            if (version.selectedVersions.length === 0) {
                delete this.versions[uuid.split('_._')[0]];
            }
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

    getNumOf : function(item) {
        var model = this.getItem(item);
        if (model) {
            return model.get('quantity');
        } else {
            return 0;
        }
    },

    getTotalPrice : function() {
        return this.reduce(function(sum, item, id) {
            if (item.get('hasVersions')) {
                return sum += item.get('versions').totalPrice;
            } else {
                return sum += item.get('quantity') * item.get('price');
            }
        }.bind(this), 0);
    },

    count : function() {
        return this.reduce(function(sum, item) {
            return sum += item.get('quantity');
        }.bind(this), 0);
    },

    //sum of all items quantity
    getItemsNumber: function() {
        var count = 0;
        this.each(function(model){
            count += model.get('quantity');
        });
        return count;
    },

    //collection length
    // getItemsNumberOld: function() {
    //     return this.length;
    // },

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
                    intraOrderAssociationTag: item.get('catalogId') + intraOrderAssociationIndex,
                    intraOrderQuantity: item.get('quantity'),
                    customizationNote: item.get('customizationNote') || null,
                    wasCustomized: item.get('wasCustomized'),
                    subItems: this.getSubSubItems(item) //I am not sure about this field name
                };
                orderItems.push(orderItem);
            }.bind(this));
        }

        return orderItems;
    },

    getSubSubItems: function(item) {
        var subSubItems = [],
            subItems = item.get('subItems');
        if (item.get('wasCustomized')) {
            _.each(subItems, function(subItem) {
                _.each(subItem, function(subSubItem) {
                    var item = {
                        subItemId: subSubItem.subItemId,
                        subSubItemId: subSubItem.subSubItemId
                    };
                    subSubItems.push(item);
                });
            });
            //TODO check if it is properly
            return subSubItems;
        } else {
            return null;
        }

    //      [ 
    //   {
    //     "subItemId": 1,
    //     "subSubItemId: 3"
    //    },
    //    {
    //       "subItemId": 1,
    //      "subSubItemId: 8"
    //     }
    // ]

    },

    // quick solution for dynamic subtotal in basket
    getBasketItemsForSubtotal: function(changedItems) {
        var itemsForSubtotal = [];
        this.models.map(function (item) {
            var uuid = item.get('uuid');
            var quantity = changedItems[uuid] ? changedItems[uuid].count : item.get('quantity');
            var item = {
                quantity: quantity,
                price: item.get('price')
            };
            itemsForSubtotal.push(item);
        });

        return itemsForSubtotal;
    }
    // end

});

module.exports = CatalogBasketModel;
