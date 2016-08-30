/*global define*/

'use strict';


var CatalogBasketItem = Backbone.Model.extend({
    /*
     * what is id, cid and idAttribute?
     * http://stackoverflow.com/questions/12169822/backbone-js-id-vs-idattribute-vs-cid
     *
     * So, we are telling backbone to use the 'uUID' value as the id value for
     * this item.
     */
    idAttribute : 'uUID',

    groupId : null,
    catalogId : null,
    groupDisplayText:null,
    catalogDisplayText:null,
    itemId : null,
    /*
     * we save the uUID also, so that we can scan by groupId and find the uUID
     * maybe we can just use the 'id'?
     */
    uUID : null,
    itemName : null,
    itemType : null,

    add : function(n) {
        var curr = this.get('quantity');
        this.set('quantity', curr + (n || 1));
    },

    initialize : function(options) {
        this.groupId = options.groupId;
        this.catalogId = options.catalogId;
        this.groupDisplayText= options.groupDisplayText;
        this.catalogDisplayText= options.catalogDisplayText;
        this.itemId = options.itemId;
        this.uUID = options.uUID;
        this.itemName = options.itemName;
        this.itemType = options.itemType.enumText;
      
        // console.log("CatalogBasketItem:initialize::"+this.itemName+",
        // "+this.groupId+", "+this.catalogId);
    }

});


module.exports = CatalogBasketItem;
