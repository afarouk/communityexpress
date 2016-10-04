/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    template= require('ejs!../templates/contactUs.ejs');

var ContactUs = Backbone.View.extend({
    name: 'contact_us',
    id: 'cmtyx_contactUs',
    
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
