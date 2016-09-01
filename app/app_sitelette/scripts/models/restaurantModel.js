/*global define*/

'use strict';

var RestaurantModel = Backbone.Model.extend({

    defaults: {
        logoURL: null,
        inNetwork: false,
        domain: {
            enumText: ''
        }
    },

    initialize: function () {
        this.set('id', this.getUrlKey() );
    },

    getUrlKey: function () {
        var url;
        try {
            url = this.attributes.anchorURL.permanentURL;
        }
        catch(e) {
            url = '';
        }
        finally {
            return url;
        }
    },

    getFriendlyUrlKey: function () {
        var url;
        try {
            url = this.attributes.anchorURL.friendlyURL || this.attributes.anchorURL.permanentURL;
        }
        catch(e) {
            url = '';
        }
        finally {
            return url;
        }
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
            serviceAccommodatorId: this.get('serviceAccommodatorId').toString(),
            serviceLocationId: this.get('serviceLocationId').toString()
        };
    },

    hasPromotions: function() {
        return this.get('promoCount') > 0;
    },

    getServiceAvailability: function () {
        var services = this.get('services');
        var result = {};
        _(services).each(function (service, key) {
            var name = key.toLowerCase().split('service')[0];
            result[name] = service.masterEnabled === true ? true : false;
        });
        return result;
    }
});

module.exports = RestaurantModel;
