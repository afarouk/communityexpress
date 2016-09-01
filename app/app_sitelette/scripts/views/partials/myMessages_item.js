/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/myMessages_item.ejs'),
    Geolocation = require('../../Geolocation'),
    Vent = require('../../Vent'),
    RestaurantModel = require('../../models/restaurantModel');

var MymessageItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    events: {
        'click a': 'goToRestaurant'
    },

    goToRestaurant: function() {
        var sa = this.model.get('fromServiceAccommodatorId');
        var sl = this.model.get('fromServiceLocationId');
        Vent.trigger('viewChange', 'chat', [sa, sl]);
    },

    render: function() {
        var data = _.extend(this.model.toJSON());
        this.$el.html(this.template(data));
        return this;
    }
});

module.exports = MymessageItemView;
