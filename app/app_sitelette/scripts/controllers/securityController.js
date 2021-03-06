/*global define */

'use strict';

var SecurityView = require('../views/securityView'),
    securityActions = require('../actions/securityActions'),
    sessionActions = require('../actions/sessionActions'),
    Vent = require('../Vent.js'),
    gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js');

module.exports = {
    init: function(params) {
        if (params.fullCode) {
            this.fullCode = params.fullCode;
            this.prepareView();
        } else {
            console.log('error');
            $('#cmtyx_medicalSecureView').addClass('invalid');
        }
    },
    prepareView: function() {
        this.securityView = new SecurityView();
        this.securityView.listenTo(this.securityView, 'pinEntered', this.onPinEntered.bind(this));
        this.securityView.listenTo(this.securityView, 'ticketWasConfirmed', this.onTicketWasConfirmed.bind(this));
        this.securityView.listenTo(this.securityView, 'ticketWasRejected', this.onTicketWasRejected.bind(this));
        Vent.on('logout_success', this.onLogoutSuccess.bind(this));
        this.onSecureAuth();
    },
    onPinEntered: function(val) {
        this.getSASLcodeByPIN(val);
    },
    onTicketWasConfirmed: function() {
        this.verifySASLcodeAndRetrieveUID();
    },
    onTicketWasRejected: function() {
        //???
    },
    onLogoutSuccess: function() {
        this.securityView.onLogoutSuccess();
        this.onSecureAuth();
    },
    onSecureAuth: function() {
        securityActions.securityAuthentication(this.fullCode)
            .then(function(authData) {
                var isValid = authData.isValid;

                if (isValid) {
                    this.authData = authData
                    this.securityView.afterAuth();
                } else {
                    //TODO error
                    console.log('error');
                    this.securityView.onInvalid();
                }
            }.bind(this));
    },
    getSASLcodeByPIN: function(pin) {
        securityActions.getSASLcodeByPIN(this.authData, pin)
            .then(function(response) {
                var isValid = response.isValid;
                    
                this.saslCode = response.saslCode;
                if (isValid) {
                    this.securityView.afterGetSASL(this.saslCode);
                } else {
                    console.log('error');
                    this.securityView.onInvalid();
                }
            }.bind(this), function() {
                console.log('!!!invalid');
                this.securityView.onMismatch();
            }.bind(this));
    },
    verifySASLcodeAndRetrieveUID: function() {
        securityActions.verifySASLcodeAndRetrieveUID(this.saslCode, this.authData)
            .then(function(userData) { 
                this.securityView.afterVerify();

                this.onCredentialsReceived(userData);
            }.bind(this), function() {
                //TODO some error???
            }.bind(this));
    },

    onCredentialsReceived: function(userData) {
        sessionActions.onSecureLogin(userData);
    },

};
