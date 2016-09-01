/*global define*/

'use strict';

var config = require('../appConfig.js'),
    h = require('../globalHelpers.js'),
    RestaurantSummaryModel = require('../models/restaurantSummaryModel.js');

var RestaurantSummaryCollection = Backbone.Collection.extend({

    model: RestaurantSummaryModel,

    getCenter: function () {
        if( this.models.length < 1){
            return { lat: 0, lng: 0 };
        }
        return {
            lat: this._average('latitude'),
            lng: this._average('longitude')
        };
    },

    getFiltered: function (domain) {
        if (domain === 'UNDEFINED') {
            return this;
        }
        var filtered = this.filter(function (model) {
            var mDomain = model.get('domain');
            return mDomain.enumText === domain;
        });
        return new RestaurantSummaryCollection(filtered);
    },

    _average: function (attr) {
        return ( this.map(function(model){ return parseFloat( model.get(attr) ); })
            .reduce(function(a,b){ return a + b; }) / this.length );
    }

});

module.exports = RestaurantSummaryCollection;
