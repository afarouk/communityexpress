/*global define*/

'use strict';

var config = require('../appConfig.js'),
    h = require('../globalHelpers.js'),
    RestaurantModel = require('../models/restaurantModel.js');

var RestaurantCollection = Backbone.Collection.extend({

    model: RestaurantModel

});

module.exports = RestaurantCollection;
