/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    communicationActions = require('../actions/communicationActions.js'),
    template= require('ejs!../templates/contactUs.ejs');

var ContactUs = Backbone.View.extend({
    name: 'contact_us',
    id: 'cmtyx_contactUs',

    events: {
        'click .send_btn': 'onSendMessage'
    },
    
    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.render();
    },
    render: function(){
        this.$el.html(template());
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    onSendMessage: function() {
        communicationActions.sendContactUsMessage();
    },

    /* AF: we don't need this function. It was part of the
       old PageLayout based layout management. We leave
       it here for now, while we continue clean up */
    renderContent : function (options){
        return this.$el;
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = ContactUs;
