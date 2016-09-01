/*global define*/

'use strict';

var template = require('ejs!../../templates/favorites.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers'),
    PanelView = require('../components/panelView'),
    FavoritesView = require('../partials/favorite_item');

var FavoritesView = PanelView.extend({

    template: template,

    initialize: function(){
        this.$el.attr({
            'id': 'cmntyex_favorites_panel',
        });
    },

    render: function() {
        var self = this;
        this.$el.html(this.template());

        if(this.collection.length < 1){
            this.$el.find('.no_items_message').show();
        }

        var frg = document.createDocumentFragment();
        this.collection.each(function(model){
            frg.appendChild(self.renderItem(model));
        });
        this.$el.find('ul').append(frg);
        return this;
    },

    renderItem: function(item) {
        var li = new FavoriteView({ model: item });
        return li.render().el;
    }

});

module.exports = FavoritesView;
