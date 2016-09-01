/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout');

var AboutUs = PageLayout.extend({

    name: 'about_us',

    initialize: function(options) {
        window.globThis = this;
        options = options || {};
        this.html = options.html;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
    },

    renderData: function () {
        return {html: this.html};
    },

    onShow:  function() {
        this.addEvents({
            'click .back': 'triggerLandingView',
        });
    },

    triggerLandingView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    },

});

module.exports = AboutUs;
