/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    template = require('ejs!../../templates/partials/customization.ejs'),
    popupController = require('../../controllers/popupController');

var CustomizationView = Backbone.View.extend({

    name: 'customization',

    id: 'cmtyx_customizationView',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.options = options;
        console.log(options.subItems);
        this.on('show', this.onShow, this);
        this.render();
    },

    render: function() {
        this.$el.html(template(this.serializeData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    serializeData: function() {
        return {
            itemName: this.options.model.get('itemName'),
            subItems: this.options.subItems
        };
    },

    renderContent: function() {
        return this.$el;
    },

    onShow:  function () {
        if (this.options.subItems.length === 0) {
            this.goBack();
            return;
        }
        this.addEvents({
            'click .back': 'goBack'
        });
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: this.catalogId,
            backToCatalog: true,
            backToCatalogs:false,
            backToRoster:false
         } );
    }
});

module.exports = CustomizationView;
