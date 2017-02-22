/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalogs-item.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var CatalogsItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'catalogs_item multicatalogs',

    events: {
        'click': 'triggerCatalogView'
    },

    initialize: function(options) {
        this.sasl = options.parent.parent.sasl;
        this.promoCode = options.parent.parent.promoCode;
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        this.$el.html(this.template(_.extend({
                color: this.getColor()
            }, viewModel )));
        return this;
    },

    getColor: function() {
        var colors = [ 'cmtyx_color_1', 'cmtyx_color_2', 'cmtyx_color_3' ],
            index = this.model.collection.indexOf(this.model);
        return colors[index % colors.length];
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: this.model.get('catalogId'),
            backToCatalogs: true,
            backToRoster:false,
            promoCode: this.promoCode
        });
    }

});

module.exports = CatalogsItemView;
