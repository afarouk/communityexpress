/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/group.ejs'),
    Vent = require('../../Vent'),
    CatalogItemView = require('./catalog_item'),
    ListView = require('../components/listView');

var GroupView = Backbone.View.extend({

    template: template,

    initialize: function (options) {
        this.color = options.color;
        this.onClick = options.onClick;
        this.listenTo(options.parent, 'close:all', this.onClose, this);
    },

    render: function () {
        var el = document.createElement('div');
        el.innerHTML = this.template(_.extend({}, this.model, {color: this.color}));
        this.renderItems(el);
        $(el).enhanceWithin();
        this.el = el;
        return this;
    },

    renderItems: function (el) {
        $(el).find('.cmntyex-list_placeholder').html(new ListView({
            ListItemView: CatalogItemView,
            ListItemViewOptions: {
                onClick: function (model) {
                    this.onClick(model);
                }.bind(this),
                color: this.color
            },
            className: 'ui-listview cmntyex-catalog',
            collection: new Backbone.Collection(this.model.unSubgroupedItems),
            update: false,
            parent: this
        }).render().el);
    },

    onClose: function () {
        this.trigger('close:all');
    }

});

module.exports = GroupView;
