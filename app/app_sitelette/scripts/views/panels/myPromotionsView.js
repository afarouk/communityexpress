/*global define*/

'use strict';

var template = require('ejs!../../templates/myPromotions.ejs'),
    PanelView = require('../components/panelView'),
    MyPromotionItem = require('../partials/myPromotion_item');

var MyPromotionsView = PanelView.extend({

    template: template,

    initialize: function(){
        this.$el.attr('id', 'cmntyex_myPromotions_panel' );
    },

    render: function() {
        var self = this;
        this.$el.html(this.template());

        if(this.collection.length < 1){
            this.$el.find('.no_items_message').show();

            var frg = document.createDocumentFragment();
            this.collection.each(function(model){
                frg.appendChild(self.renderItem(model));
            });
            this.$el.find('ul').append(frg);
        }

        return this;
    },

    renderItem: function(item) {
        var li = new MyPromotionItem({ model: item });
        return li.render().el;
    }

});

module.exports = MyPromotionsView;
