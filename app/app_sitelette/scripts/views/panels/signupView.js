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

        $('#mobile_input_signup').mask('(000) 000-0000');
        
        this.addEvents({
            'click .submit_signup': 'submitForm',
            'submit': 'submitForm',
            'focus input': 'hideSignupError'
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
                data.username,
                data.password,
                data.password_confirmation)
                    .then(this._onSignupSuccess.bind(this), this._onSignupError.bind(this));

            return false;
        };
    },

    validateForm: function(data) {
        /*
        var regexEmail = regexEmail = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,32}[.](([a-z]){2,32})+$/gi;
        if (!regexEmail.test(data.email)) {
            this.showSignupError('email');
            return false;
        } else 
        */
        console.log('username:'+data.username);
        console.log('email:'+data.email);
        var regexMobile = regexMobile = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (!regexMobile.test(data.username)) {
            this.showSignupError('email');
            return false;
        } else 
        if (data.password !== data.password_confirmation) {
            var text = 'Password does not match the confirm password';
            this.showSignupError('password', text);
            return false;
        } else if (data.password === '') {
            var text = 'Please, enter password';
            this.showSignupError('password', text);
        } else if (data.password.length < 6) {
            var text = 'Please, use more than 6 characters';
            this.showSignupError('password', text);
        } else {
            return true;
        };
    },

    showSignupError: function(error, text) {
        switch (error) {
            case 'password':
                // this.$el.find('.signup_password_error').text(text).slideDown();
                this.$el.find('.signup_password_error').text(text).removeClass('hidden');
                break;
            case 'email':
                // this.$el.find('.signup_email_error').slideDown();
                this.$el.find('.signup_email_error').removeClass('hidden');
                break;
            default:

        }
        this.$el.find('.signup_error').slideDown();
        return false;
    },

    hideSignupError: function(e) {
        var target = e.target;
        switch (target.type) {
            case 'email':
                // this.$el.find('.signup_email_error').slideUp();
                this.$el.find('.signup_email_error').addClass('hidden');
                break;
            case 'password':
                // this.$el.find('.signup_password_error').slideUp();
                this.$el.find('.signup_password_error').addClass('hidden');
                break;
            default:

        }
    },

    getFormData: function() {
        var values = {};
        $.each(this.$el.find('form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values;
    },

    _onSignupSuccess: function(response) {
        loader.hide();
        var text = 'successfully signed up as ' + response.username;
        this.shut();
        this.$el.on('popupafterclose', function() {
            this.parent.textPopup({text: text}, this.callback);
        }.bind(this));
    },

    _onSignupError: function(e) {
        loader.hide();
        var text = h().getErrorMessage(e, 'Error signin up'),
            callback = this.openSignup;
        this.shut();
        this.$el.on('popupafterclose', function() {
            this.parent.textPopup({text: text}, callback);
        }.bind(this));
    },

    openSignup: function() {
        this.signup();
    }

});

module.exports = SignupView;
