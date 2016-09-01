/*global define*/

'use strict';

var PanelView = require('../components/panelView'),
    template = require('ejs!../../templates/shareView.ejs'),
    loader = require('../../loader'),
    favoriteActions = require('../../actions/favoriteActions'),
    h = require('../../globalHelpers');

var ShareView = PanelView.extend({

    template: template,

    initialize: function () {
        this.addEvents({
            'click .add_to_favorites_button' : 'addToFavorites',
            'click .copy_url_button' : 'copyUrl'
        });
    },

    renderData: {
        url: window.location
    },

    addToFavorites: function () {

        this.parent.withLogIn(function () {


            if( this._isInFavorites() ){
                loader.showFlashMessage(this.model.get('saslName') + ' is already in favorites');
                return;
            }

            loader.show();
            favoriteActions.addFavorite( this.model.sa(), this.model.sl() )
                .then(this._onAddFavorite.bind(this), this._onAddFavoriteError.bind(this));
        }.bind(this));
    },

    _isInFavorites: function() {
        return this.user.favorites.get( this.model.getSasl() );
    },

    _onAddFavorite: function () {
        loader.showFlashMessage('Added ' + this.model.get('saslName') + ' to favorites');
    },

    _onAddFavoriteError: function (e) {
        loader.showFlashMessage(h().getErrorMessage(e, 'Error adding favorite'));
    }

});

module.exports = ShareView;
