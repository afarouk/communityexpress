/*global define*/

'use strict';

var ListCheckboxView = Backbone.View.extend({

    tagName: 'fieldset',

    initialize: function(options) {
        options = options || {};
        this.parent = options.parent;
        this.ListCheckboxItemView = options.ListItemView;
        this.ListCheckboxItemViewOptions = options.ListItemViewOptions || {};

        this.$el.attr({
            'data-role': options.dataRole || 'listview',
            'data-icon': options.icon || 'false'
        });

        this.listenTo(this.parent, 'close:all', this.close, this);
        if (options.update !== false) {
            this.listenTo(this.collection, 'add remove', this.render, this);
        }

    },

    render: function () {
        this.$el.empty();
        var frg = document.createDocumentFragment();
        this.collection.each(function (item) {
            $(frg).append( new this.ListCheckboxItemView($.extend(this.ListCheckboxItemViewOptions, {
                model: item,
                parent: this
            })).render().el);
        }, this);
        this.$el.append(frg);
        this.enhance();
        return this;
    },

    enhance: function () {
        this.$el.enhanceWithin();
    },

    close: function () {
        this.trigger('close:all');
        this.stopListening();
        this.undelegateEvents();
        this.remove();
    }

});

module.exports = ListCheckboxView;
