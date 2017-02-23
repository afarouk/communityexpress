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
        var $el = $(this.el).find('.cmntyex-list_placeholder ul'),
            navigation = $(this.el).find('.carousel-navigation');
        $el.owlCarousel({
          margin: 20,
          items: 1,
          // loop:true,
          nav: false
        });
        if (this.model.unSubgroupedItems.length === 1) {
            navigation.hide();
        } else {
            navigation.find('.navigation-prev').click(function(){
                $el.trigger('prev.owl.carousel');
            });
            navigation.find('.navigation-next').click(function(){
                $el.trigger('next.owl.carousel');
            });
        }
        $el.on('changed.owl.carousel', function(e){
            console.log(e.item);
            if (e.item.index === 0) {
                navigation.find('.navigation-prev').addClass('disabled');
            } else {
                navigation.find('.navigation-prev').removeClass('disabled');
            }
            if (e.item.index === e.item.count - 1) {
                navigation.find('.navigation-next').addClass('disabled');
            } else {
                navigation.find('.navigation-next').removeClass('disabled');
            }
        });
        setTimeout(this.adjustNavPosition.bind(this), 2);
    },

    adjustNavPosition: function () {
        var $el = $(this.el).find('.cmntyex-list_placeholder ul'),
            pos = $el.find('li').first().find('.sides_extras_detailed').position(),
            navigation = $(this.el).find('.carousel-navigation');
        navigation.css('top', pos.top + 'px');
    },

    adjustCallback: function() {},

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
                direction: this.direction,
                //adjustCallback: this.adjustCallback.bind(this)
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
