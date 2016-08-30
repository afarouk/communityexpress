/*global define*/

'use strict';

var template = require('ejs!../../templates/newMessageView.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView'),
    communicationsController = require('../../controllers/communicationsController'),
    h = require('../../globalHelpers');

var NewMessageView = PopupView.extend({

    template: template,

    messageBody: 'textarea[name=messageBody]',

    initialize: function(options) {
        options = options || {};

        this.onSubmit = options.onSubmit || function () {};

        this.addEvents({
            'click .submit_button': '_onSubmit',
            'click .close_button': 'shut'
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

    _onSubmit: function () {
        if (this.$('textarea').val().length <= 0) {
            $('#err_text').html("Select Message.");
            $('#err_text').css("display","block");
            $('#message').css("border","1px solid #FF0000");
            return;
        }
        else
        {
            $('#message').css("border","0");
        }
        loader.show('sending message');
        this.onSubmit(this.val())
            .then(this._onSendSuccess.bind(this), this._onSendError.bind(this));
    },

    val: function () {
        return {
            messageBody: $(this.messageBody).val()
        };
    },

    _onSendSuccess: function () {
        loader.showFlashMessage('message sent');
        this.shut();
    },

    _onSendError: function (e) {
        loader.showFlashMessage(h().getErrorMessage(e, 'Error sending message'));
    }

});

module.exports = NewMessageView;
