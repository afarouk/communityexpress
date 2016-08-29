/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/favorite.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var FavoriteView = Backbone.View.extend({

    tagName: 'li',

    template: template,

    events: {
        'click a': 'goToRestaurant'
    },

    goToRestaurant: function() {
        var sa = this.model.attributes.saslPair.sa;
        var sl = this.model.attributes.saslPair.sl;
        Vent.trigger('viewChange', 'restaurant', [sa,sl] );
    },

    render: function() {
        var data = h().toViewModel( _.extend(this.model.toJSON(), {
            notifications: this._sumOfNotifications(),
            reservations: this.model.get('reservationWithSASLCount')
        }));
        this.$el.html(this.template(data));
        return this;
    },

    _sumOfNotifications: function() {
        var notes = [
            this.model.get('messageFromSASLCount'),
            this.model.get('notificationsFromSASLCount'),
            this.model.get('responsesFromSASLCount'),
            this.model.get('requestsFromSASLCount')
        ];
        var sum = 0;
        _(notes).each(function(note){
            sum += parseInt(note, 10);
        });
        return sum;
    }
});

module.exports = FavoriteView;
