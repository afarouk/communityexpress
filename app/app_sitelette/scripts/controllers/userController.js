/*global define */

'use strict';

var gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js'),
    Vent = require('../Vent.js'),
    User = require('../models/user.js'), 
    Cookies = require('../../../vendor/scripts/js.cookie');;

var initUser = function(response) {
    return appCache.get('user').init(response.uid, response.userName)
        .then( function () {
            Vent.trigger('login_success');
            return response;
        });
};

var facebookLogout = function() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            //facebook logout is recommended on user logout
            //but it will logout all apps on this browser
            FB.logout(function(response){
                console.log(response.status);
            });
        }
    }.bind(this), true);
};

var killUser = function(response) {
    appCache.get('user').kill();
    Cookies.remove('cmxUID');
    Vent.trigger('logout_success');
    facebookLogout();
    return response;
};

module.exports = {

    getCurrentUser: function () {
        return appCache.fetch('user', new User());
    },

    hasCurrentUser: function() {
        if ( appCache.get('user') && appCache.get('user').getUID ) {
            return appCache.get('user').getUID() ? true : false;
        }
        return false;
    },

    loginUser: function (username, password) {
        return gateway.sendRequest('login', {
            payload: {
                userid: username,
                password: password
            }
        });
    },

    loginUserWithFacebook: function(publicProfile) {
        return gateway.sendRequest('loginWithFacebook', {
            payload: publicProfile
        });
    },

    logout: function(UID){
        return gateway.sendRequest('logout',{
            UID: UID
        }).then(killUser);
    }

};
