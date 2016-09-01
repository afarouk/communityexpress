/*global describe, it, expect, define, beforeEach, afterEach, before, after, sinon */

'use strict';

var config = require('../appConfig.js'),
    gateway = require('../APIGateway/gateway.js');

var createCollection = function(response) {
    var UUIDs = _(response.promoUUIDList).map(function(item){
        return { UUID: item };
    });
    return new Backbone.Collection( UUIDs );
};

var createPromotion = function(response) {
    return new Backbone.Model(_.extend( response, {
        imageUrl: config.apiRoot + '/promotions/retrievePictureJPGByPromoUUID?promoUUID=' + response.promoUUID
    }));
};

module.exports = {

    fetchPromotionUUIDsBySasl: function(sa, sl, UID) {
        return gateway.sendRequest('fetchPromotionUUIDsBySasl',{
            UID: UID,
            serviceAccommodatorId: sa,
            serviceLocationId: sl
        }).pipe(createCollection);
    },

    fetchPromotionByUUID: function(promoUUID) {
        return gateway.sendRequest('fetchPromotionByUUID',{
            promoUUID: promoUUID
        }).pipe(createPromotion);
    }

};
