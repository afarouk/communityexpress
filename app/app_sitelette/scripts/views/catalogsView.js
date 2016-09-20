/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    template = require('ejs!../templates/content/catalogs_content.ejs'),
    CatalogItemView = require('./partials/catalogs_item'),
    ListView = require('./components/listView');

var CatalogsView = Backbone.View.extend({

    name: 'catalogs',

    id: 'cmtyx_catalogsView',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.catalogs = options.catalogs.collection;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.navbarView = options.navbarView;
        this.render();
    },

    render: function() {
        this.$el.html(template());
        this.setElement(this.$el.children().eq(0));
        this.renderCatalogs();
        return this;
    },

    renderContent: function() {
        return this.$el;
    },

    onShow:  function () {
        this.addEvents({
            'click .back': 'goBack'
        });
    },

    goBack: function() {
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
