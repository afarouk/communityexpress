/*global define */

'use strict';

var SigninView = require('../views/panels/signinView.js');

var PopupController = {
    signin: function(model) {
        var view = new SigninView({model: model});
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
