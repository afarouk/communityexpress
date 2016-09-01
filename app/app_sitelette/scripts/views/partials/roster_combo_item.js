/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_combo_item.ejs'), Vent = require('../../Vent'), h = require('../../globalHelpers');

var RosterComboItemView = Backbone.View.extend({

    template : template,
    tagName : 'li',
    className : 'cmtyex_roster_combo_item menuItem',
    events : {
        'click .roster_combo_item_add_button' : 'showAddToBusketView',
        'change .combo_select_item': 'addToCart'
    },

    initialize : function(options) {
        this.options = options;
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.onClick = function () {
            options.onClick(this.model);
        }.bind(this);
        this.color = options.color;

    },

    /* we delegate to the method set via the initializer */
    showAddToBusketView: function() {
        this.onClick();
    },

    addToCart: function(e){
        var count=e.target.selectedIndex;
        this.basket = this.options.parent.basket;
        var initialCnt=this.basket.getComboCount();
        this.catalogId = e.target.attributes.catalogid.value; 
        this.catalogDisplayText=e.target.attributes.catalogdisplaytext.value; 
        this.basket.addCatalog(this.model, count,  this.catalogId,this.catalogDisplayText);  
        this.listenTo(initialCnt, 'change:value', initialCnt+count, this);
         $('.cart_items_number').text(this.basket.getComboCount());

    },

    render : function() {
        this.$el.html(this.template({
            combo : this.model
        }));
        return this;
    }
});

module.exports = RosterComboItemView;
