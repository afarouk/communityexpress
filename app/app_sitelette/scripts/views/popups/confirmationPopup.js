/*global define*/

'use strict';

var template = require('ejs!../../templates/confirmationPopup.ejs'),
    PopupView = require('../components/popupView');

var ConfirmationPopup = PopupView.extend({

    template: template,

    initialize: function(options){
        this.text = options.text;
        this.action = options.action;

        this.addEvents({
            'click .confirmation_button': 'performAction'
        });

        this.renderData = {
            text: this.text
        };
    },

    performAction: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.action();
        }.bind(this));
    }

});

module.exports = ConfirmationPopup;
