/*global define*/

'use strict';


var RosterBasketDerivedItem = Backbone.Model.extend({
  /*
  * what is id, cid and idAttribute?
  * http://stackoverflow.com/questions/12169822/backbone-js-id-vs-idattribute-vs-cid
  *
  * So, we are telling backbone to use the 'uUID' value as the id value for
  * this item.
  */

  defaults :{
    groupId : null,
    catalogId : null,
    itemId : null,
    uUID:'',

    displayText:"",
    rosterEntryType:"ITEM", /* ITEM or COMBO */
    price:0,
    quantity:0,

    editable:true,
    selected:false
  },

  initialize : function(options) {
    this.set('displayText',options.displayText);
    this.set('rosterEntryType',options.rosterEntryType);
    this.set('groupId' , options.groupId);
    this.set('catalogId' ,options.catalogId);
    this.set('itemId' , options.itemId);
    this.set('uUID', options.uuid);
    this.set('price',options.price);
    this.set('quantity', options.quantity);
    this.set('removeItem',options.removeItem);
  },

  removeItem : function(options){
    console.log(" removing items in itemmodel");
    if(rosterEntryType==='ITEMZIED'){
      /* remove from itemzed catalog */
      _(catalogs.models).each(function(catalog,ii,ll){
        /* is this itemized?*/
        if(catalog.catalogType==='ITEMIZED'){
          catalog.removeItem(options.itemId);
        }
      });
    }else{
      /* find and delete the entire combo */
      _(catalogs.models).each(function(catalog,ii,ll){
        /* is this itemized?*/
        if(catalog.catalogType==='COMBO' && catalog.catalogId===options.catalogId){
          catalogs.remove(options.catalogId);
        }
      });

    }
  }

});


module.exports = RosterBasketDerivedItem;
