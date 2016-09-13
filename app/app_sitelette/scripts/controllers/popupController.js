/*global define */

'use strict';

var sessionActions = require('../actions/sessionActions'),
    configurationActions = require('../actions/configurationActions'),
    SigninView = require('../views/panels/signinView'),
    viewFactory = require('../viewFactory');

var PopupController = {
    signin: function(model, callback) {
        var view = viewFactory.create('signin', model, this, {callback: callback});
        this.show(view);
    },

    signup: function(model, callback) {
        var view = viewFactory.create('signup', model, this, {callback: callback});
        this.show(view);
    },

    forgotPassword: function(model, callback) {
        var view = viewFactory.create('forgotPassword', model, this, {callback: callback});
        this.show(view);
    },

    confirmation: function(model, options) {
        var view = viewFactory.create('confirmationPopup', model, this, options);
        this.show(view);
    },

    textPopup:  function(text, callback) {
        var view = viewFactory.create('textPopup', text, this, {callback:callback});
        this.show(view);
    },

    addToRosterBasket: function(model, options) {
        var view = viewFactory.create('addToRosterBasket', model, this , options);
        this.show(view);
    },

    editRosterView: function(self, model, options) {
        // TODO doesn't work correct
        var view = viewFactory.create('editRosterView', model, self , options);
        this.show(view);
    },

    openLeftMenu: function(){
        var view = viewFactory.create('leftMenuView');
        // debugger;
        this.show(view);
    },

    newReview: function(self, sasl, options) {
        var view = viewFactory.create('newReview', sasl, self, options);
        this.show(view);
    },

    show: function(view) {
        // debugger;
        view.render();
        view.enhance();
        //TODO some error sometimes when signin
        view.open();
        // setTimeout(view.open.bind(view),50);
    }, 

    hide: function(view) {
        view.shut();
    },

    requireLogIn: function(model, callback) {
        var conf = configurationActions.getConfigurations(),
            view;
        if(sessionActions.getCurrentUser().getUID()) {
            callback();
        } else if (conf.get('embedded')) {
            window.iosJavascriptLogin(this.loginFromIOS(callback));
        } else {
            view = new SigninView({
                parent: this,
                model: model,
                title: 'Sign in Required',
                callback: callback
            });
            this.show(view);
        }
    }
};

module.exports = PopupController;
