/*global define*/

'use strict';

var template = require('ejs!../../templates/rest_list.ejs'),
    PanelView = require('../components/panelView'),
    ListView = require('../components/listView'),
    RestListItemView = require('../partials/rest_list_item'),
    saslActions = require('../../actions/saslActions');

var RestListView = PanelView.extend({

    template: template,

    initialize: function(options){
        options = options || {};
        this.title = options.title || '';
        this.domains = options.domains;

        this.$el.attr({
            'id': 'cmntyex_list_panel',
        });

        this.addEvents({
            'click .close-panel-button': 'shut'
        });
    },

    _sortByDistance: function (collection) {
        var clone = collection.clone();
        clone.comparator = function (a,b) {
            var d = saslActions.getUserDistanceToRestaurant(a);
            var d2 = saslActions.getUserDistanceToRestaurant(b);
            return d - d2;
        };
        clone.sort();
        return clone;
    },

    render: function() {
        this.$el.html(this.template({title: this.title}));
        this.$('.cmntyex-list_container').append(new ListView({
            collection: this._sortByDistance(this.collection),
            update: false,
            ListItemView: RestListItemView,
            ListItemViewOptions: {domains: this.domains},
            parent: this
        }).render().el);
        return this;
    }

});

module.exports = RestListView;
