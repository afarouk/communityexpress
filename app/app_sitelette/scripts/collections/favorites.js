/*global define*/

'use strict';

var FavoriteModel = require('../models/favoriteModel.js');

var FavoritesCollection = Backbone.Collection.extend({

    model: FavoriteModel,

    initialize: function(){
        this.on('destroy', function(model){
            this.remove(model);
            this.trigger('sync');
        }, this);
    },

});

module.exports = FavoritesCollection;
