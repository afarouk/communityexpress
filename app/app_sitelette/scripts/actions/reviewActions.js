/*global define*/

'use strict';

var appCache = require('../appCache'),
    gateway = require('../APIGateway/gateway'),
    ReviewCollection = require('../collections/reviews'),
    sessionActions = require('./sessionActions');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {

    getReviewsBySASL: function (sa, sl, prevId, prevOffset, nextId, nextOffset) {
        return gateway.sendRequest('retrieveReviews', {
            count: 10,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            previousId: prevId,
            previousOffset: prevOffset,
            nextId: nextId,
            nextOffset: nextOffset,
            UID: getUID()
        }).then(function (response) {
            return {
                data: response,
                collection: new ReviewCollection(response.reviews)
            };
        });
    },

    addReview: function  (sa, sl, file, title, message, rating) {
        return gateway.sendFile('addReview', {
            image: file,
            toServiceAccommodatorId: sa,
            toServiceLocationId: sl,
            text_excerpt: message,
            authorId: getUID(),
            rating: rating,
            isPositive: true,
            UID: getUID()
        });
    }

};
