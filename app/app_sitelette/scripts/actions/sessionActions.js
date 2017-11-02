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

var onLoginSuccess = function (response, withAdhoc) {
    var user = appCache.fetch('user', new User());
    user.initiate(response.uid, response.userName);
    if (response.adhocEntry === false) {
        Cookies.set('cmxAdhocEntry', false);
        $('.menu_button_5').addClass('sign_out');
    } 
    if (!withAdhoc) {
        $('.menu_button_5').addClass('sign_out');
    }
    
    favoriteActions.getFavoritesForCurrentUser();

    if (response.localStorage !== false) {
        //localStorage.setItem('cmxUID', response.uid);
        Cookies.set('cmxUID',response.uid , {expires : 365});
    };
    Vent.trigger('login_success');

    if (typeof response.messageCount !== 'undefined') {
        Vent.trigger('update_message_count', response.messageCount);
    }

    // if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
    //     //var a = localStorage.getItem("cmxUID");
    //     var a = Cookies.get("cmxUID");
    //     if ("undefined" !== typeof a && null !== a) {
    //         loyaltyActions.updateLoyaltyStatus(a);
    //         loyaltyActions.retrieveCalendar(a);
    //     } else {
    //         console.log("1. NO cmxUID, try to create one");
    //         /*
    //         * create user
    //         */
    //         loyaltyActions.createAnonymousUser();
    //         console.log("anonymous user created");
    //     }

    // } else {
    //     console.log("no api url");
    // }

    return {
        uid: response.uid,
        username: response.userName
    };
};

module.exports = {

    checkIfUserAppropriate: function() {
        if (Cookies.get('cmxAdhocEntry') == 'true') {
            return new User();
        } else {
            return this.getCurrentUser();
        }
    },

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

    isWithAdhoc: function(response) {
        var withAdhoc = response.adhocEntry;
        Cookies.set('cmxAdhocEntry', withAdhoc);
        return withAdhoc;
    },

    authenticate: function (uid) {
        return gateway.sendRequest('getAuthenticationStatus', {
            UID: uid
        }).then(function (response) {
            if (response.action && response.action.enumText === 'NO_ACTION') {
                onLoginSuccess({
                    uid: uid,
                    userName: response.userName,
                    messageCount: response.messageCount
                }, this.isWithAdhoc(response));
            }
        }.bind(this));
    },

    getSessionFromLocalStorage: function (params) {
        var dfd = $.Deferred();
        var persistedUID;

        persistedUID = Cookies.get('cmxUID');
        Cookies.set('cmxAdhocEntry', false);
        if (persistedUID) {
            window.asdesds=persistedUID;
            gateway.sendRequest('getAuthenticationStatus', {
                UID: persistedUID
            }).then(function (response) {
                if (response.action && response.action.enumText === 'NO_ACTION') {
                    onLoginSuccess({
                        uid: persistedUID,
                        userName: response.userName,
                        messageCount: response.messageCount
                    }, this.isWithAdhoc(response));
                } else {
                    console.log("not removing cookie, getAuthentication status call failed?");
                    Vent.trigger('force_logout');
                }
                dfd.resolve(response);
            }.bind(this), function onRequestError () {
                if (params && params.canCreateAnonymousUser && !params.embedded) {
                    this.doesUIDexist(persistedUID, dfd);
                } else {
                    console.log("not removing cookie, onRequestError ?");
                    dfd.reject();
                }
            }.bind(this));
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
        var payload = {
            serviceAccommodatorId: window.community.serviceAccommodatorId,
            serviceLocationId: window.community.serviceLocationId,
            email: email,
            password: password
        };
        if (Cookies.get('cmxAdhocEntry') == 'true') {
            payload.uid = Cookies.get('cmxUID');
            payload.convertingFromAdhoc = true;
        }
        return gateway.sendRequest('registerNewMember', {payload:payload}).then(onLoginSuccess);
    },

    doesUIDexist: function(UID, dfd) {
        return gateway.sendRequest('doesUIDexist', {
            UID: UID,
        }).then(function(response) {
            if (response.success) {
                //Now do nothing
            } else {
                Cookies.remove('cmxUID');
                $.when(this.createAnonymousUser())
                    .then(function(){
                        this.getSessionFromLocalStorage().then(function(response){
                            dfd.resolve(response);
                        }.bind(this), function(){
                            console.log("not removing cookie, onRequestError ?");
                            dfd.reject();
                        });
                    }.bind(this));
            }
        }.bind(this));
    },

    createAnonymousUser: function() {
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
                this.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
            }
        }.bind(this));
    },

    forgotPassword: function(email) {
        return gateway.sendRequest('userForgotPassword', {
            usernameOrEmail: email
        });
    },

    facebookLoginStatus: function(status) {
        var def = $.Deferred(),
            isDesktop = window.community.desktop,
            isMobile = !isDesktop,
            standalone = window.navigator.standalone;
        console.log('isMobile: ', isMobile);
        console.log('standalone: ', standalone);
        // if (isMobile && standalone === true && status === 'connected') {
        if (status === 'connected') {
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
    },

    onSecureLogin: function(userData) {
        onLoginSuccess({
            uid: userData.uid,
            userName: userData.userName,
            messageCount: userData.messageCount
        }, null);
    }

};
