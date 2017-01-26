/*global define*/

'use strict';


var CatalogBasketVersionItem = Backbone.Model.extend({
    idAttribute : 'uuid',
    groupId : null,
    catalogId : null,
    groupDisplayText:null,
    catalogDisplayText:null,
    itemId : null,
    uuid : null,
    itemName : null,
    itemType : null,
    add : function() {
        
    },

    initialize : function(options) {
        
    }

});


module.exports = CatalogBasketVersionItem;
