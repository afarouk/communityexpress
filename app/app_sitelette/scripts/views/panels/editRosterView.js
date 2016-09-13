/*global define*/

'use strict';

var template = require('ejs!../../templates/editRosterView.ejs'), //
loader = require('../../loader'), //
PanelView = require('../components/panelView'), //
ListView = require('../components/listView'),//
EditRosterViewItem = require('../partials/edit_roster_view_item'),//
h = require('../../globalHelpers');

var EditRosterView = PanelView.extend({

    template : template,

    addedEvents : {
        'change .combo_select_item': 'addOrDeleteItem'
    },

    initialize : function(options) {
        this.options = options;
        options = options || {};

        this.itemTemplate = options.template;

        this.actions = options.actions;

        this.$el.attr({
            'id' : 'cmntyex_edit_favorites_panel'
        });

        this.addEvents(this.addedEvents);
    },

    render : function(update) {
        var editable = true;

        this.$el.html(this.template({
            editable : editable
        }));
        this.$el.find('.cmntyex-list_container').html(new ListView({
            collection : this.collection,
            ListItemView : EditRosterViewItem,
            ListItemViewOptions : {
                template : this.itemTemplate
            },
            parent : this
        }).render().el);
        this.afterRender(); // call it for each panel if you replaced render
        return this;
    },

    removeSelected : function(e) {

        loader.show('deleting items');
        var selected = this.collection.where({
            selected : true
        });
        $.when(this.actions.removeItem(selected)).then(function() {
             loader.hide();
        }.bind(this), function() {
            loader.showFlashMessage(h().getErrorMessage(e, 'error deleting'));
        });

        this.basket = this.options.parent.basket;
        console.log(this.basket.getComboCount());
        $('.cart_items_number').text(this.basket.getComboCount());

        this.shut();

    },

    addOrDeleteItem : function(e){
        var count=e.target.selectedIndex,
            currentModel;
        if(count == 0){
            this.removeSelected(e);
        }
        else{
            // alert('order item picked');
            // console.log(e);
            console.log(this.options.parent);

            this.basket = this.options.parent.basket;
            var initialCnt=this.basket.getComboCount();
        
            this.catalogId = e.target.attributes.catalogid.value; 

            console.log( this.catalogId);

            this.catalogDisplayText=e.target.attributes.catalogdisplaytext.value; 

            currentModel = this.model.findWhere({catalogId: this.catalogId});
            this.basket.addCatalog(currentModel.toJSON(), count,  this.catalogId,this.catalogDisplayText);
            console.log(this);   
            this.listenTo(initialCnt, 'change:value', initialCnt+count, this);

            console.log(this.basket.getComboCount());
            $('.cart_items_number').text(this.basket.getComboCount());
        }
    },

    _update : function() {
        this.render(true);
        this.enhance();
    }

});

module.exports = EditRosterView;
