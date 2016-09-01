/*global define*/

'use strict';

var Vent = require('../Vent'),
    viewFactory = require('../viewFactory'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    EditableView = require('./partials/editableView');

var EditView = PageLayout.extend({

    name: 'edit',

    initialize: function(options) {
        options = options || {};

        this.restaurant = options.restaurant;
        this.user = options.user;
        this.action = options.action;
        this.actionfn = options.actionfn;
        this.items = options.items;

        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);

    },

    onShow:  function() {
        this.addEvents({
            'click .back': 'triggerRestaurantView',
        });

        this.listenTo( Vent, 'logout_success', this.triggerRestaurantView, this);
        this.renderItems();
    },

    renderItems: function() {
        this.$('.cmntyex-items_placeholder').html( new ListView({
            ListItemView: EditableView,
            ListItemViewOptions: {
                action: this.action,
                actionfn: this.actionfn,
            },
            className: 'cmntyex-editable_list',
            collection: this.items,
            dataRole: 'none',
            parent: this
        }).render().el);
    },

    triggerRestaurantView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.restaurant.getUrlKey(), { reverse: true } );
    }

});

module.exports = EditView;
