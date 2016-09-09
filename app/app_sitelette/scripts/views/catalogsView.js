/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    CatalogItemView = require('./partials/catalogs_item'),
    ListView = require('./components/listView');

var CatalogsView = Backbone.View.extend({

    name: 'catalogs',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.catalogs = options.catalogs.collection;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.navbarView=options.navbarView;
        this.render();
    },

    render: function() {
        this.renderCatalogs();
        return this;
    },

    onShow:  function () {
        this.addEvents({
            'click .back': 'triggerRestaurantView'
        });
        debugger;
    },

    triggerRestaurantView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true } );
    },

    renderCatalogs: function() {
        var el = new ListView({
            ListItemView: CatalogItemView,
            className: 'cmntyex-catalog_list ui-listview',
            collection: new Backbone.Collection(this.catalogs),
            dataRole: 'list-view',
            parent: this
        }).render().el;

        this.$('.cmntyex-items_placeholder').append(el);

    }

});

module.exports = CatalogsView;
