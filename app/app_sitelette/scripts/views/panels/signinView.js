 /*global define*/

'use strict';

var template = require('ejs!../../templates/signin.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var SigninView = PopupView.extend({

    template: template,

    username: 'input[name="username"]',
    password: 'input[name="password"]',

    initialize: function(options){

        options = options || {};

        this.callback = options.callback || function () {};

        this.renderData = {
            title: options.title
        };

        this.$el.attr('id', 'cmntyex_signin_panel');

        this.addEvents({
            'focus input': 'hideLoginError',
            'click .submit_button': 'submitForm',
            'click .signup_button': 'openSignupView',
            'click .forgot_password_button': 'forgotPassword',
            'click .login_with_facebook span': 'loginWithFacebook'
        });

        FB.getLoginStatus(function (response) {
            this.facebookStatus = response.status;
        }.bind(this), true);
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

    loginWithFacebook: function() {
        loader.show();
        sessionActions.facebookLoginStatus(this.facebookStatus)
            .then(function(response){
                if (response.success) {
                    // loader.showFlashMessage('Logged with facebook');
                    this.$el.on('popupafterclose', function () {
                        this.parent.textPopup({text: 'Successfully Logged in with FB Login'},
                            this.callback);
                    }.bind(this));
                    loader.hide();
                this.shut();
                } else {
                    loader.showFlashMessage(response.error);
                }
                this.shut();
            }.bind(this));
    },

    forgotPassword: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.parent.forgotPassword(this.model, this.callback);
        }.bind(this));
    },

    openSignupView: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.parent.signup(this.model, this.callback);
        }.bind(this));
    },

    submitForm: function() {
        var data = this.getFormData();
        if (!this.isValid(data)) return;
        loader.show();
        sessionActions.startSession(this.val().username, this.val().password)
            .then(function(response){
                $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');
                loader.hide();
                this.shut();
                this.$el.on('popupafterclose', function () {
                    this.parent.textPopup({ text: 'successfully signed in as ' + response.username }, this.callback);
                }.bind(this));
            }.bind(this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'Error signin in'),
                    callback = this.openSignin;
                loader.hide();
                this.shut();
                this.$el.on('popupafterclose', function () {
                    this.parent.textPopup({ text: text }, callback);
                }.bind(this));
            }.bind(this));
        return false;
    },

    getFormData: function() {
        var values = {};
        $.each(this.$el.find('form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values;
    },

    isValid: function(data) {
        if (data.username === '' || data.password === '' || data.password.length < 6) {
            this.showLoginError();
            return false;
        }
        return true;
    },

    openSignin: function() {
        this.signin();
    },

    showLoginError: function() {
        this.$el.find('.login_error').show().removeClass('hidden');
    },

    hideLoginError: function() {
        this.$el.find('.login_error').hide().addClass('hidden');
    },

    val: function () {
        return {
            username: $(this.username).val(),
            password: $(this.password).val()
        };
    }

});

module.exports = SigninView;
