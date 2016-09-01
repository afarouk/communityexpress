/*global define*/

'use strict';

var PopupView = require('../components/popupView'),
    template = require('ejs!../../templates/support.ejs'),
    loader = require('../../loader'),
    h = require('../../globalHelpers'),
    contactActions = require('../../actions/contactActions');

var NewReview = PopupView.extend({

    template: template,

    id: 'cmntyex_support_popup',

    className: 'popup',

    initialize: function(options) {
        this.options = options;
        this.addEvents({
            'click .submit_button':'submitForm',
        });
    },

    beforeShow: function () {
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 450,
            'max-width': 300,
            'width': w * 0.7
        });
    },

    submitForm: function(e) {
        e.preventDefault();
        var email = this.$('input[name=email]').val();
        var subject = this.$('input[name=subject]').val();
        var description = this.$('input[name=description]').val();

        loader.show();
        contactActions.sendSupportRequest(
            email,
            subject,
            description)
                .then(this._onSuccess.bind(this),
                      this._onError.bind(this));
    },

    _onSuccess: function() {
        loader.showFlashMessage( 'support request sent' );
        this.shut();
    },

    _onError: function(e) {
        loader.showErrorMessage(e, 'Error requesting support');
    }

});

module.exports = NewReview;
