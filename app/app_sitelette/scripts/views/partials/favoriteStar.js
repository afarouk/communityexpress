/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/favoriteStar.ejs'),
    loader = require('../../loader'),
    Vent = require('../../Vent'),
    favoriteActions = require('../../actions/favoriteActions'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var FavoriteStarView = Backbone.View.extend({

    template: template,

    events: {
        'click': 'toggleFavorite'
    },

    initialize: function (options) {
        options = options || {};
        this.parent = options.parent;
        this.user = sessionActions.getCurrentUser();

        this.listenTo(Vent, 'login_success logout_success', this.render, this);
        this.listenTo(this.parent, 'hide', this.remove, this);
        this.listenTo(this.user.favorites, 'add remove', this.render, this);
    },

    render: function () {
        this.$el.html(this.template({
            isVisible: this.user.getUID() ? true : false,
            isFavorite: this.user.favorites.get(this.model.getUrlKey()) ? true : false
        }));
        return this;
    },


    addToFavorites: function () {
        loader.show();
        favoriteActions.addFavorite( this.model.sa(), this.model.sl() )
            .then(function onAddFavorite () {
                loader.showFlashMessage('Added ' + this.model.get('saslName') + ' to favorites');
            }.bind(this), function onAddFavoriteError (e) {
                loader.showFlashMessage(h().getErrorMessage(e, 'Error adding favorite'));
            });
    },

    deleteFromFavorites: function () {
        loader.show();
        favoriteActions.removeFavorite( this.model.getUrlKey() )
            .then(function onDeleteFavorite () {
                loader.showFlashMessage('Removed ' + this.model.get('saslName') + ' from favorites');
            }.bind(this), function onDeleteFavoriteError (e) {
                loader.showFlashMessage(h().getErrorMessage(e, 'Error deleting from favorites'));
            });
    },

    toggleFavorite: function () {
        if ( !this.user.getUID() ) { return; }

        if ( !this.user.favorites.get(this.model.getUrlKey()) ) {
            this.addToFavorites();
        } else {
            this.deleteFromFavorites();
        }
    }

});

module.exports = FavoriteStarView;
