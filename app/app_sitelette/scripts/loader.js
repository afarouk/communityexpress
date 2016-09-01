/*global define*/

'use strict';

module.exports = {
    show: function(msg, options){
        if( _(msg).isObject() ){
            options = msg;
            msg = null;
        } else {
            options = options || {};
        }

        $.mobile.loading( 'show', {
            text: msg || options.msg || 'loading',
            textVisible: ( _(msg).isString() || _(options.msg).isString() || options.text || false ),
            theme: options.theme || 'b',
            textonly: options.textonly || false
        });
    },

    hide: function(){
        $.mobile.loading('hide');
    },

    showErrorMessage: function(err, msg) {
        if (err.status == 400) {
            this.showFlashMessage(err.responseJSON.error.message);
        } else {
            this.showFlashMessage(msg);
        }
    },

    showFlashMessage: function(msg, options){

        var self = this;

        if( _(msg).isObject() ){
            options = msg;
            msg = null;
        } else {
            options = options || {};
        }

        this.hide();
        $.mobile.loading( 'show', {
            text: msg || options.msg || 'finished loading',
            textVisible: options.text || true,
            theme: options.theme || 'b',
            textonly: options.textonly || true
        });
        setTimeout(self.hide, 3000);
    }
};
