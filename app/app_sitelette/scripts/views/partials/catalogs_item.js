/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalogs-item.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var CatalogsItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'catalogs_item',

    events: {
        'click': 'triggerCatalogView'
    },

    initialize: function(options) {
        this.sasl = options.parent.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        this.$el.html(this.template(_.extend( viewModel )));
        return this;
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: this.model.get('catalogId'),
            backToCatalogs: true,
            backToRoster:false
        });
    }

});

module.exports = CatalogsItemView;
