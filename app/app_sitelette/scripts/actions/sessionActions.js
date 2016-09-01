/*global define*/

'use strict';

var userController = require('../controllers/userController.js'),
    favoriteActions = require('./favoriteActions.js'),
    communicationActions = require('./communicationActions.js'),
    loyaltyActions = require('./loyaltyActions'),
    Vent = require('../Vent.js'),
    appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway'),
    User = require('../models/user.js'),
    updateActions = require('./updateActions'),
    Cookies = require('../../../vendor/scripts/js.cookie');

var onLoginSuccess = function (response) {

    var user = appCache.fetch('user', new User());
    user.initiate(response.uid, response.userName);
    $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');

    favoriteActions.getFavoritesForCurrentUser();

    if (response.localStorage !== false) {
        //localStorage.setItem('cmxUID', response.uid);
        Cookies.set('cmxUID',response.uid);
    };
    Vent.trigger('login_success');

    if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
        //var a = localStorage.getItem("cmxUID");
        var a = Cookies.get("cmxUID");
        if ("undefined" !== typeof a && null !== a) {
            loyaltyActions.updateLoyaltyStatus(a);
            loyaltyActions.retrieveCalendar(a);
        } else {
            console.log("1. NO cmxUID, try to create one");
            /*
            * create user
            */
            loyaltyActions.createAnonymousUser();
            console.log("anonymous user created");
        }

    } else {
        console.log("no api url");
    }

    return {
        uid: response.uid,
        username: response.userName
    };
};

module.exports = {

    getCurrentUser: function () {
        return appCache.fetch('user', new User());
    },

    setUser: function (uid, username) {
        return appCache.set('user', new User(uid, username));
    },

    enterInvitationCode: function (code, username, password, email) {
        return gateway.sendRequest('registerNewMemberWithInvitationCode', {
            code: code,
            username: username,
            password: password,
            email: email
        });
    },

    authenticate: function (uid) {
        return gateway.sendRequest('getAuthenticationStatus', {UID: uid}).then(function (response) {
            if (response.action && response.action.enumText === 'NO_ACTION') {
                onLoginSuccess({
                    uid: uid,
                    userName: response.userName
                });
            }
        });
    },

    getSessionFromLocalStorage: function () {
        var dfd = $.Deferred();
        var persistedUID;

        //persistedUID = localStorage.getItem('cmxUID');
        persistedUID = Cookies.get('cmxUID');
        if (persistedUID) {
            window.asdesds=persistedUID;
            gateway.sendRequest('getAuthenticationStatus', {UID: persistedUID}).then(function (response) {
                if (response.action && response.action.enumText === 'NO_ACTION') {
                    onLoginSuccess({
                        uid: persistedUID,
                        userName: response.userName
                    });
                } else {
                    //localStorage.removeItem('cmxUID');
                    Cookies.remove('cmxUID');
                }
                dfd.resolve();
            }, function onRequestError () {
                //localStorage.removeItem('cmxUID');
                Cookies.remove('cmxUID');
                dfd.resolve();
            });
        } else {
            dfd.resolve();
        }
        return dfd.promise();
    },

    startSession: function ( username, password ) {
        return userController.loginUser(username, password)
            .then(onLoginSuccess);
    },

    registerNewMember: function (email, password, password_confirmation) {
        var payload ={
            serviceAccommodatorId: window.community.serviceAccommodatorId,
            serviceLocationId: window.community.serviceLocationId,
            //username: username,
            email: email,
            password: password
        };
        return gateway.sendRequest('registerNewMember', {payload:payload}).then(onLoginSuccess);
    },

    createAnonymousUser: function() {
        var self = this;
        return gateway.sendRequest('createAnonymousUser', {
            serviceAccommodatorId: window.saslData.serviceAccommodatorId,
            serviceLocationId: window.saslData.serviceLocationId
        }).then(function(userRegistrationDetails) {
            if (typeof userRegistrationDetails.uid !== 'undefined') {

                /*
                * save it in localstorage
                *
                */
                console.log(" saving to local storage cmxUID:"
                + userRegistrationDetails.uid);
                //localStorage.setItem("cmxUID", userRegistrationDetails.uid);
                Cookies.set('cmxUID',userRegistrationDetails.uid);
                self.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
            }
        });
    }

};
