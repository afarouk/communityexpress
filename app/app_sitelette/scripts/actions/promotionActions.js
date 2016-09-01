'use strict';

var gateway = require('../APIGateway/gateway.js'),
    PromotionModel = require('../models/promotionModel.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {

    createAdhocPromotion: function (sa, sl, file, title, message, type) {
        return gateway.sendFile('createAdhocPromotion', {
            image: file,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            promotionSASLName: title,
            displayText: message,
            promotionType: type,
            UID: getUID()
        });
    },

    activatePromotion: function (sa, sl, id) {
        return gateway.sendRequest('activatePromotion', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            promoUUID: id,
            UID: getUID()
        });
    },

    deActivatePromotion: function (sa, sl, id) {
        return gateway.sendRequest('deActivatePromotion', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            promoUUID: id,
            UID: getUID()
        });
    },

    getPromotionTypes: function () {
        return gateway.sendRequest('getPromotionTypes')
            .then(function (promotions) {
                return new Backbone.Collection(promotions);
            });
    },

    getPromotions: function (sa, sl, status) {
        return gateway.sendRequest('retrievePromotionsBySASL', {
                serviceAccommodatorId: sa,
                serviceLocationId: sl,
                status: status,
                startIndex: 0,
                count:10
            }).then(function (promotions) {
                return new Backbone.Collection(promotions, {
                    model: PromotionModel
                });
            });
    },

    fetchPromotionFeedback: function (UUID) {
        return gateway.sendRequest('getPromotionFeedback', {
            promoUUID: UUID,
            UID: getUID()
        });
    },

    givePromotionFeedback: function (UUID, like) {
        return gateway.sendRequest('givePromotionFeedback', {
            promoUUID: UUID,
            UID: getUID(),
            like: like
        });
    },
};
