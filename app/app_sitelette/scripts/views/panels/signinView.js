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
            'click .submit_button': 'submitForm',
            'click .signup_button': 'openSignupView'
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

    openSignupView: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.parent.openSubview('signup', this.model, this.callback);
        }.bind(this));
    },

    submitForm: function() {
        loader.show();
        sessionActions.startSession(this.val().username, this.val().password)
            .then(function(response){
                $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');
                this.shut();
                this.$el.on('popupafterclose', function () {
                    this.parent.openSubview('textPopup', { text: 'successfully signed in as ' + response.username }, this.callback);
                }.bind(this));
            }.bind(this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'Error signin in'),
                    callback = this.openSignin;
                this.shut();
                this.$el.on('popupafterclose', function () {
                    this.parent.openSubview('textPopup', { text: text }, callback);
                }.bind(this));
            }.bind(this));
        return false;
    },

    openSignin: function() {
        this.openSubview('signin');
    },

    showLoginError: function() {
        this.$el.find('.login_error').show();
    },

    hideLoginError: function() {
        this.$el.find('.login_error').hide();
    },

    val: function () {
        return {
            username: $(this.username).val(),
            password: $(this.password).val()
        };
    }

});

module.exports = SigninView;