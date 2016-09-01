/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout'),
    CatalogItemView = require('./partials/catalogs_item'),
    ListView = require('./components/listView');

var CatalogsView = PageLayout.extend({

    name: 'catalogs',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.catalogs = options.catalogs.collection;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.navbarView=options.navbarView;
    },

    onShow:  function () {
        this.addEvents({
            'click .back': 'triggerRestaurantView'
        });
        this.renderCatalogs();
        this.navbarView.hide();
    },

    triggerRestaurantView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true } );
        this.navbarView.show();
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
