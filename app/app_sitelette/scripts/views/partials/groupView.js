/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/group.ejs'),
    Vent = require('../../Vent'),
    // CatalogItemView = require('./catalog_item'),
    ListView = require('../components/listView');

var GroupView = Backbone.View.extend({

    template: template,

    initialize: function (options) {
        this.groupId = options.model.groupId;
        this.groupDisplayText = options.model.groupDisplayText;
        this.catalogId = options.parent.catalogId;
        this.catalogDisplayText = options.parent.catalogDisplayText;
        this.basket = options.basket;
        this.itemView = options.itemView;
        this.color = options.color;
        this.onClick = options.onClick;
        this.preopenAllPictures = options.preopenAllPictures;
        this.listenTo(options.parent, 'close:all', this.onClose, this);
    },

    render: function () {
        var el = document.createElement('div');
        this.direction = this.model.scrollDirection ? this.model.scrollDirection.enumText : null;
        el.innerHTML = this.template(_.extend({}, this.model, {
            color: this.color,
            direction: this.direction
        }));
        this.renderItems(el);
        $(el).enhanceWithin();
        this.el = el;
        setTimeout(this.afterRender.bind(this), 1);
        return this;
    },

    afterRender: function() {
        if (this.direction === 'HORIZONTAL') {
            this.initOwlGallery();
        }
    },

    initOwlGallery: function() {
        var $el = $(this.el).find('.cmntyex-list_placeholder ul');
        $el.owlCarousel({
          margin: 20,
          items: 1
        });
    },

    renderItems: function (el) {
        $(el).find('.cmntyex-list_placeholder').html(new ListView({
            ListItemView: this.itemView,
            ListItemViewOptions: {
                onClick: function (model) {
                    this.onClick(model);
                }.bind(this),
                color: this.color,
                basket: this.basket,
                groupId: this.groupId,
                groupDisplayText: this.groupDisplayText,
                catalogId: this.catalogId,
                catalogDisplayText: this.catalogDisplayText,
                preopenAllPictures: this.preopenAllPictures,
                direction: this.direction
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
