/*global define */

'use strict';

var sessionActions = require('../actions/sessionActions'),
    configurationActions = require('../actions/configurationActions'),
    SigninView = require('../views/panels/signinView'),
    viewFactory = require('../viewFactory');

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

    addToRosterBasket: function(model, options) {
        var view = viewFactory.create('addToRosterBasket', model, this , options);
        this.show(view);
    },

    editRosterView: function(self, model, options) {
        // TODO doesn't work correct
        var view = viewFactory.create('editRosterView', model, this , options);
        this.show(view);
    },

    show: function(view) {
        view.render();
        view.enhance();
        setTimeout(view.open.bind(view),50);
    }, 

    hide: function(view) {
        view.shut();
    },

    requireLogIn: function(callback) {
        var conf = configurationActions.getConfigurations(),
            view;
        if(sessionActions.getCurrentUser().getUID()) {
            callback();
        } else if (conf.get('embedded')) {
            window.iosJavascriptLogin(this.loginFromIOS(callback));
        } else {
            view = new SigninView({
                parent: this,
                model: this.model || this.restaurant || this.sasl,
                title: 'Sign in Required',
                callback: callback
            });
            this.renderSubview(view);
            view.open();
        }
    }
};

module.exports = PopupController;
