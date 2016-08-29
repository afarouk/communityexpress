/*global define*/

'use strict';

var config = require('../appConfig.js'),
    h = require('../globalHelpers.js'),
    ReviewModel = require('../models/reviewModel.js');

var ReviewCollection = Backbone.Collection.extend({

    model: ReviewModel,

    comparator: function(model) {
        // This is for ordering reviews chronologically
        return (new Date(model.get('reviewDate'))).getTime();
    }

});

module.exports = ReviewCollection;
