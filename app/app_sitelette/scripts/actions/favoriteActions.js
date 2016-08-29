/*global define*/

'use strict';

var RestaurantSummaryCollection = require('../collections/restaurantSummaryCollection.js'),
    favoriteController = require('../controllers/favoriteController.js'),
    userController = require('../controllers/userController.js'),
    geolocation = require('../Geolocation.js');

var updateUserFavorites = function(user, collection) {
    return user.favorites.set(collection.models);
};

var destroyUserFavorites = function(user, models) {
    models = _(models).isArray() ? models : [models];
    return user.favorites.remove(models);
};

var addToUserFavorites = function(user, model) {
    return user.favorites.add(model);
};

module.exports = {

    getFavoritesForCurrentUser: function () {
        // get current user
        // get current location
        // get Favorites sasl summary from server
        // update user's favorite collection with restaurants
        // resolve if successful
        // otherwise reject

        var user = userController.getCurrentUser();
        var location = geolocation.getPreviousLocation();
        return favoriteController.getFavoriteSASLSummary( user.getUID(), location.latitude, location.longitude )
            .then(function(collection) {
                return updateUserFavorites(user, collection);
            });
    },

    removeFavorite: function (urlKey) {
        // get current user
        // get current location
        // send remove favorite request with given urlkey
        // if successful remove from user's favorites and resolve promise
        // else reject promise

        var user = userController.getCurrentUser();
        return favoriteController.deleteURLFromFavorites( user.getUID(), urlKey )
            .then(function(model) {
                return destroyUserFavorites(user, model);
            });
    },

    removeFavorites: function (urlKeys) {
        var user = userController.getCurrentUser();
        return $.when.apply($, _(urlKeys).map(function(urlKey) {
                return favoriteController.deleteURLFromFavorites( user.getUID(), urlKey );
            })).then(function () {
                // convert arguments to a real array
                var args = Array.prototype.slice.call(arguments);
                // get models
                var models = !_(args[0]).isArray() ? args[0] : args.map(function (arg) {
                    return arg[0];
                });
                destroyUserFavorites(user, args);
                return new RestaurantSummaryCollection(args);
            });
    },

    addFavorite: function (sa, sl) {
        // get current user
        // send add request with given sa sl
        // if successful add sasl to user's favorites and resolve promise
        // else reject promise
        var user = userController.getCurrentUser();
        return favoriteController.addSASLToFavorites( user.getUID(), sa, sl )
            .then(function(model) {
                return addToUserFavorites(user, model);
            });

    }

};
