/*global define */

'use strict';

var medicalActions = require('../actions/medicalActions'),
    sessionActions = require('../actions/sessionActions'),
    Vent = require('../Vent.js'),
    gateway = require('../APIGateway/gateway.js'),
    appCache = require('../appCache.js');

module.exports = {
    init: function(params) {
        if (params.fullCode) {
            this.fullCode = params.fullCode;
            Vent.on('logout_success', this.onLogoutSuccess, this);
            this.onMedicalAppAuth(params.fullCode);
        } else {
            //TODO something like
            //fullCode error
            console.log('error');
            $('#cmtyx_medicalSecureView').addClass('invalid');
        }
    },
    onLogoutSuccess: function() {
        $('#cmtyx_landingView').hide('slow');
        $('#cmtyx_medicalSecureView').show('slow');
        $('#cmtyx_medicalSecureView').find('.secure-input').val('');
        $('#cmtyx_medicalSecureView').find('.secure-block').removeClass('secured');
        $('#cmtyx_medicalSecureView').find('.approve-message').removeClass('approved');
        this.onMedicalAppAuth(this.fullCode);
    },
    onMedicalAppAuth: function(fullCode) {
        medicalActions.medicurisAuthentication(fullCode)
            .then(function(authData) {
                var isValid = authData.isValid;

                if (isValid) {
                    $('#cmtyx_medicalSecureView').find('.secure-input').focus().on('change', function(e) {
                        var val = $(e.currentTarget).val();
                        console.log(val);
                        this.onSecurityCodeApprove(authData, val);
                    }.bind(this));
                } else {
                    //TODO error
                    console.log('error');
                    $('#cmtyx_medicalSecureView').addClass('invalid');
                }
            }.bind(this));
    },
    onSecurityCodeApprove: function(authData, saslCode) {
        medicalActions.getSASLcodeByPIN(authData, saslCode)
            .then(function(response) {
                var isValid = response.isValid,
                    saslCode = response.saslCode;
                if (isValid) {
                    $('#cmtyx_medicalSecureView').find('.approve-message')
                        .removeClass('mismatch')
                        .addClass('approve');
                    $('#cmtyx_medicalSecureView').find('.secure-text').text(saslCode);
                    $('#cmtyx_medicalSecureView').find('.approve-message .ticket-btns button')
                        .on('click', function(e) {
                            var target = $(e.currentTarget);
                            if (target.hasClass('confirm')) {
                                this.verifySASLcodeAndRetrieveUID(response, saslCode, authData.tempId);
                            } else {
                                //If NO, show "Please do not proceed".
                                $('#cmtyx_medicalSecureView').addClass('no');
                            }
                        }.bind(this));
                } else {
                    console.log('error');
                    $('#cmtyx_medicalSecureView').addClass('invalid');
                }
            }.bind(this), function() {
                console.log('!!!invalid');
                $('#cmtyx_medicalSecureView').find('.approve-message').addClass('mismatch');
            }.bind(this));
    },
    verifySASLcodeAndRetrieveUID: function(response, saslCode, tempId) {
        medicalActions.verifySASLcodeAndRetrieveUID(response, saslCode, tempId)
            .then(function(userData) { 
                $('#cmtyx_medicalSecureView').find('.secure-block').addClass('secured');
    
                setTimeout(function() {
                    $('#cmtyx_landingView').show('slow');
                    $('#cmtyx_medicalSecureView').hide('slow');
                }.bind(this), 2000);
                $('#cmtyx_medicalSecureView').find('.approve-message')
                    .removeClass('approve')
                    .addClass('approved');

                this.onCredentialsReceived(userData);
            }.bind(this), function() {
                //TODO some error???
            }.bind(this));
    },

    onCredentialsReceived: function(userData) {
        sessionActions.onMedicurisLogin(userData);
    },

};
