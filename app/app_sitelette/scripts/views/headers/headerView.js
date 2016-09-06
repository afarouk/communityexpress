/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    appCache = require('../../appCache.js'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    promotionsController = require('../../controllers/promotionsController');

var HeaderView = Backbone.View.extend({

    el: '#cmtyx_header',

    events: {
        'click #cmtyx_header_back_button': 'triggerLandingView'
    },

    initialize: function(options) {
        this.$el.toolbar();
        this.options = options || {};

        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;

    },


    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', [this.sa, this.sl]);
        this.options.navbarView.show();
    }



});

module.exports = HeaderView;
