/*global define*/

'use strict';

var template = require('ejs!../../templates/signup.ejs'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    config = require('../../appConfig'),
    PopupView = require('../components/popupView'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var SignupView = PopupView.extend({

    template: template,

    id: 'signup_panel',

    initialize: function(options) {
        options = options || {};
        this.parent = options.parent;
        this.callback = options.callback || function () {};

        this.addEvents({
            'submit': 'submitForm',
            'focus input[type=password]': 'hideSignupError'
        });
    },

    beforeShow: function () {
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 450,
            'max-width': 300,
            'width': w * 0.8
        });
    },

    submitForm: function(e) {
        e.preventDefault();
        var data = this.getFormData();
        if (this.validateForm(data)) {

            loader.show();

            sessionActions.registerNewMember(
                //data.username,
                data.email,
                data.password,
                data.password_confirmation)
                    .then(this._onSignupSuccess.bind(this), this._onSignupError.bind(this));

            return false;
        };
    },

    validateForm: function(data) {
        if (data.password !== data.password_confirmation) {
            this.showSignupError();
            return false;
        } else {
            return true;
        };
    },

    showSignupError: function() {
        this.$el.find('.signup_error').slideDown();
    },

    hideSignupError: function() {
        this.$el.find('.signup_error').slideUp();
    },

    getFormData: function() {
        var values = {};
        $.each(this.$el.find('form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values;
    },

    _onSignupSuccess: function(response) {
        loader.showFlashMessage( 'successfully signed up as ' + response.username );
        setTimeout(this.callback, 1000);
        this.shut();
    },

    _onSignupError: function(e) {
        var text = h().getErrorMessage(e, 'Error signin up'),
            callback = this.openSignup;
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.parent.openSubview('textPopup', { text: text }, callback);
        }.bind(this));
    },

    openSignup: function() {
        this.openSubview('signup');
    }

});

module.exports = SignupView;
