/*global define*/

'use strict';

var template = require('ejs!../../templates/invitation.ejs'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    config = require('../../appConfig'),
    PopupView = require('../components/popupView'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var SignupView = PopupView.extend({

    template: template,

    id: 'enter_invitation_popup',

    initialize: function(){
        this.addEvents({
            'submit': 'submitForm'
        });
    },

    submitForm: function(e) {
        e.preventDefault();
        var data = this.getFormData();

        if(!this.$('[name=terms]')[0].checked) {
            loader.showFlashMessage('Please agree to terms and conditions');
            return false;
        }

        loader.show();
        sessionActions.enterInvitationCode(
            data.code,
            data.username,
            data.password,
            data.email)
                .then(this._onSignupSuccess.bind(this), this._onSignupError.bind(this));

        return false;
    },

    getFormData: function() {
        var values = {};
        $.each(this.$el.find('form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values;
    },

    _onSignupSuccess: function(response) {
        //loader.showFlashMessage( 'successfully signed up as ' + response.username );
        loader.showFlashMessage( response.message );
        this.shut();
    },

    _onSignupError: function(e) {
        loader.showErrorMessage(e, 'Error entering invitation code');
    }

});

module.exports = SignupView;
