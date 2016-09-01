/*global define*/

'use strict';

var template = require('ejs!../../templates/contactPopup.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView'),
    contactActions = require('../../actions/contactActions');

var contactPopup = PopupView.extend({

    template: template,

    id: 'cmntyex_contact_popup',

    className: 'popup',

    initialize: function (options) {
        options = options || {};
        this.promoUUID = options.promoUUID;
        this.sasl = options.sasl;

        this.addEvents({
            'submit': 'onSubmitClick'
        });

        this.$el.attr('data-dismissible','false');
    },

    render: function () {
        this.$el.html(this.template({name: 'email'}));
        return this;
    },

    onSubmitClick: function (e) {
        e.preventDefault();
        var contact = this.$('input[name=contact]').val();
        if (contact) {
            loader.show();
            contactActions.sendPromoURLToEmail(
                this.sasl.sa(),
                this.sasl.sl(),
                contact,
                this.promoUUID
            ).then(function () {
                loader.showFlashMessage('Email sent');
                this.shut();
            }.bind(this), function (err) {
                loader.showErrorMessage(err, 'Error sending email');
            });
        }
    }
});

module.exports = contactPopup;
