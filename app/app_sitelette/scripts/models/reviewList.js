/*global define*/

'use strict';

var ReviewCollection = require('../collections/reviews.js');

var ReviewListModel = Backbone.Model.extend({

    initialize: function (options) {
        options = options || {};
        this.reviews = options.reviews || new ReviewCollection();
    }

});

module.exports = ReviewListModel;
