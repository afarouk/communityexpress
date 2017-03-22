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
    $('.menu_button_5').addClass('sign_out');
    // $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');
    // $('.menu_button_5').addClass('cmtyx_text_color_1');
    // var color = $('.cmtyx_text_color_1').css("color");
    // $( ".menu_button_5" ).before( "<style>.icon-user:before{color:" + color + "}</style>" );
    // $( ".glyphicon-ok" ).show();
    
    favoriteActions.getFavoritesForCurrentUser();

    if (response.localStorage !== false) {
        //localStorage.setItem('cmxUID', response.uid);
        Cookies.set('cmxUID',response.uid , {expires : 365});
    };
    Vent.trigger('login_success');

    if (typeof response.messageCount !== 'undefined') {
        Vent.trigger('update_message_count', response.messageCount);
    }

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
                    userName: response.userName,
                    messageCount: response.messageCount
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
                        userName: response.userName,
                        messageCount: response.messageCount
                    });
                } else {
                    console.log("not removing cookie, getAuthentication status call failed?");
                    //Cookies.remove('cmxUID');
                    Vent.trigger('force_logout');//temporary
                }
                dfd.resolve();
            }, function onRequestError () {
                console.log("not removing cookie, onRequestError ?");
                //Cookies.remove('cmxUID');
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
                console.log(" saving to local storage cmxUID:" + 
                    userRegistrationDetails.uid);
                //localStorage.setItem("cmxUID", userRegistrationDetails.uid);
                Cookies.set('cmxUID',userRegistrationDetails.uid , {expires:365});
                self.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
            }
        });
    },

    forgotPassword: function(email) {
        return gateway.sendRequest('userForgotPassword', {
            usernameOrEmail: email
        });
    },

    facebookLoginStatus: function(status) {
        var def = $.Deferred(),
            isMobile = !window.community.desktop,
            standalone = window.navigator.standalone;
        console.log('isMobile: ', isMobile);
        console.log('standalone: ', standalone);
        if (isMobile && standalone === true && status === 'connected') {
            this.getPublicProfile(def);
        } else {
            FB.login(function(response) {
                if (response.authResponse) {
                    this.getPublicProfile(def);
                } else {
                    def.resolve({error:'User cancelled login or did not fully authorize.'});
                }
            }.bind(this), { scope: 'email' });
        }
        return $.when(def);
    },

    getPublicProfile: function(def) {
        FB.api('/me', {fields: 'id,name,first_name,last_name,email'}, 
            function(response){
            if (response.id) {
                this.loginWithFacebook(response);
                def.resolve({success: 'Loggedin with facebook'});
            } else {
                def.resolve({error:'Can\'t login with facebook'});
            }
        }.bind(this));
    },

    loginWithFacebook: function(publicProfile) {
        userController.loginUserWithFacebook(publicProfile)
            .then(onLoginSuccess);
    }

};
