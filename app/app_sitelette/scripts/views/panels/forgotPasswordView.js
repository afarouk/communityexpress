 /*global define*/

'use strict';

var template = require('ejs!../../templates/forgotPassword.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var ForgotPasswordView = PopupView.extend({

    template: template,

    email: 'input[name="email"]',

    initialize: function(options){

        options = options || {};

        this.callback = options.callback || function () {};

        this.renderData = {
            title: options.title
        };

        this.$el.attr('id', 'cmntyex_signin_panel');

        this.addEvents({
            'click .submit': 'checkForm'
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

    checkForm: function() {
        var email = this.val().email;
        if (!email) {
            this.showEmailError();
            return;
        }
        this.hideEmailError();
        this.submitForm(email);
    },

    submitForm: function(email) {
        loader.show();
        sessionActions.forgotPassword(email)
            .then(function(response){
                this.shut();
                loader.hide();
                this.$el.on('popupafterclose', function () {
                    this.parent.textPopup({ text: 'An email has been sent to let you change the password' }, this.callback);
                }.bind(this));
            }.bind(this), function(jqXHR) {
                var text = h().getErrorMessage(jqXHR, 'Error signin in'),
                    callback = this.openSignin;
                this.shut();
                loader.hide();
                this.$el.on('popupafterclose', function () {
                    this.parent.textPopup({ text: text }, callback);
                }.bind(this));
            }.bind(this));
        return false;
    },

    showEmailError: function() {
        this.$el.find('.email_error').show().removeClass('hidden');
    },

    hideEmailError: function() {
        this.$el.find('.login_error').hide();
    },

    val: function () {
        return {
            email: $(this.email).val()
        };
    }

});

module.exports = ForgotPasswordView;