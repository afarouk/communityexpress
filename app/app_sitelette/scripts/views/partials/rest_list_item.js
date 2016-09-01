/*global define*/

'use strict';

var h = require('../../globalHelpers'),
    template = require('ejs!../../templates/partials/rest_list_item.ejs'),
    config = require('../../appConfig'),
    Vent = require('../../Vent'),
    saslActions = require('../../actions/saslActions');

var RestListItemView = Backbone.View.extend({

    tagName: 'li',

    template: template,

    events: {
        'click a': 'goToRestaurant'
    },

    initialize: function (options) {
        options = options || {};
        this.domains = options.domains;
    },

    goToRestaurant: function() {
        Vent.trigger('viewChange', 'restaurant', this.model.getUrlKey() );
        return false;
    },

    _setIconUrl: function(){
        return this.model.getIcon(this.domains.getSelected().get('category'));
    },

    _getRating: function() {
        var i, s = '';
        for (i = 0; i < this.model.get('rating'); i++) {
            s += '*';
        }
        return s;
    },

    _getDistance: function() {
        var d = saslActions.getUserDistanceToRestaurant(this.model);
        if (typeof d === 'number') {
            return d.toFixed(1);
        }
        return null;
    },

    render: function() {
        var data = _.extend( this.model.toJSON(), {
            icon: this._setIconUrl(),
            distance: this._getDistance(),
            rating: this._getRating(),
            notificationCount: this.model.getNotificationCount()
        });
        this.$el.html(this.template(data));
        return this;
    }

});

module.exports = RestListItemView;
