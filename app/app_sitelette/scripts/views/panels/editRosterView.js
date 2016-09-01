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
        'click .back_button' : 'openSettings',
        'click .cmntyex-button-edit' : 'toggleEditable',
        'click .cmntyex-button-cancel' : 'toggleEditable',
        'click .cmntyex-button-done' : 'removeSelected'
    },

    initialize : function(options) {

        options = options || {};

        this.itemTemplate = options.template;

        this.actions = options.actions;

        this.$el.attr({
            'id' : 'cmntyex_edit_favorites_panel'
        });

        this.addEvents(this.addedEvents);
    },

    render : function(update) {
        // prevent jqm panel widget from breaking when updated
        var container = update ? this.$('.ui-panel-inner') : this.$el;
        //var editable = this.collection.length > 0 ? this.collection.at(0).get('editable') : false;
        var editable = true;

        container.html(this.template({
            editable : editable
        }));
        container.find('.cmntyex-list_container').html(new ListView({
            collection : this.collection,
            ListItemView : EditRosterViewItem,
            ListItemViewOptions : {
                template : this.itemTemplate
            },
            parent : this
        }).render().el);
        return this;
    },

    toggleEditable : function() {
        this.collection.each(function(model) {
            var editable = true;
            var combo = false;
          /*
            if (model.attributes){
                if (model.attributes.itemType){
                    if (model.attributes.itemType.enumText === 'COMBO') {
                        editable = false;
                        combo = true;
                    }
                }
            }
            ;
            if (!combo) {
                model.set('editable', !model.get('editable'));
            }
            */
        });
        this._update();
    },

    removeSelected : function() {

        loader.show('deleting items');
        var selected = this.collection.where({
            selected : true
        });
        $.when(this.actions.removeItem(selected)).then(function() {
             loader.hide();
        }.bind(this), function() {
            loader.showFlashMessage(h().getErrorMessage(e, 'error deleting'));
        });
        
        this.shut();

    },

    _update : function() {
        this.render(true);
        this.enhance();
    }

});

module.exports = EditRosterView;
