/*global define*/

'use strict';

var RestaurantSummaryModel = Backbone.Model.extend({

    defaults: {
        icon: '',
        name: '',
        rating: 0,
    },

    initialize: function(){
        this.set( 'id', this.getUrlKey() || this.cid );
    },

    getMarker: function(category) {
        category = category || 'UNDEFINED';
        var marker;

        _(this.attributes.mapmarkers).each(function(item){
            if ( category.toUpperCase() === item.category.toUpperCase() ) {
                marker = item.apiMarkerURL;
                return;
            }
        }, this);

        return marker;
    },

    getNotificationCount: function() {
        return _([
            this.get('messageFromSASLCount'),
            this.get('reservationWithSASLCount'),
            this.get('requestsFromSASLCount'),
            this.get('notificationsFromSASLCount'),
            this.get('responsesFromSASLCount')
        ]).reduce(function (a, b) {
            return parseInt(a, 10) + parseInt(b, 10);
        });
    },

    sa: function () {
        return this.get('serviceAccommodatorId');
    },

    sl: function () {
        return this.get('serviceLocationId');
    },

    getSasl: function() {
        return this.get('serviceAccommodatorId').toString() + this.get('serviceLocationId').toString();
    },

    getSaslHash: function() {
        return {
            serviceAccommodatorId: this.get('serviceAccommodatorId'),
            serviceLocationId: this.get('serviceLocationId')
        };
    },

    getUrlKey: function() {
        var url = '';
        try {
            url = this.attributes.anchorURL.permanentURL;
        }
        finally {
            return url;
        }
    },

    isInNetwork: function() {
        return ( this.get('inNetwork') || this.get('inNetwork') === 'true');
    },

    getIcon: function(category) {
        return this.getMarker(category);
    },

    isVisible: function() {
        return this.getMarker() !== null;
    }

});

module.exports = RestaurantSummaryModel;
