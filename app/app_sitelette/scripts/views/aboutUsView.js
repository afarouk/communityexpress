/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    template= require('ejs!../templates/aboutUs.ejs');

var AboutUs = Backbone.View.extend({
    name: 'about_us',
    id: 'cmtyx_aboutUs',
    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.render(options);
    },
    render: function(data){
        this.$el.html(template(data));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    /* AF: we don't need this function. It was part of the
       old PageLayout based layout management. We leave
       it here for now, while we continue clean up */
    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        this.addEvents({
            'click .back': 'triggerLandingView',
        });
    },

    triggerLandingView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }



});

module.exports = AboutUs;
