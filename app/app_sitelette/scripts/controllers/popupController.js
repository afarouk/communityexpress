/*global define */

'use strict';

var viewFactory = require('../viewFactory');

var PopupController = {
    signin: function(model) {
        var view = viewFactory.create('signin', model, this);
        this.show(view);
    },

    confirmation: function(model, options) {
        var view = viewFactory.create('confirmationPopup', model, this, options);
        this.show(view);
    },

    textPopup:  function(text, callback) {
        var view = viewFactory.create('textPopup', text, this);
        this.show(view);
    },

    show: function(view) {
        view.render();
        view.enhance();
        setTimeout(view.open.bind(view),50);
    }, 

    hide: function(view) {
        view.shut();
    }
};

module.exports = PopupController;
