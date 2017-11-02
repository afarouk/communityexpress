'use strict';

define([
	'../views/securityView',
	'../../scripts/actions/sessionActions',
    '../../scripts/actions/securityActions',
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	], function(SecurityView, sessionActions, securityActions, appCache, h, orderActions){
	var SecurityController = Mn.Object.extend({
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
	        this.listenTo(this.securityView, 'pinEntered', this.onPinEntered.bind(this));
	        this.listenTo(this.securityView, 'ticketWasConfirmed', this.onTicketWasConfirmed.bind(this));
	        this.listenTo(this.securityView, 'ticketWasRejected', this.onTicketWasRejected.bind(this));
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
	        $('#cmtyx_landingView').hide('slow');
	        this.securityView.onLogoutSuccess();
	        this.onSecureAuth();
	    },
	    onSecureAuth: function() {
	        securityActions.medicurisAuthentication(this.fullCode)
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
	        this.dispatcher.get('popups').onLoginStatusChanged();
	    }
	});
	return SecurityController;
});