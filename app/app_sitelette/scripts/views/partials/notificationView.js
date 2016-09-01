/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/notification.ejs'),
    Geolocation = require('../../Geolocation'),
    Vent = require('../../Vent'),
    RestaurantModel = require('../../models/restaurantModel');

var NotificationView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

module.exports = NotificationView;
