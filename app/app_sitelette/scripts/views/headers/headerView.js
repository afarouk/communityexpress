/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    appCache = require('../../appCache.js'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    popupController = require('../../controllers/popupController'),
    promotionsController = require('../../controllers/promotionsController');

var HeaderView = Backbone.View.extend({

    el: '#cmtyx_header',

    events: {
        'click #cmtyx_header_back_button': 'triggerPreviousView',
        'click #cmtyx_header_menu_button': 'openLeftMenu'
    },

    initialize: function(options) {
        this.$el.toolbar();
        this.options = options || {};

        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
    },

    headerHide: function() {
        this.$el.slideUp('slow');
    },

    headerShow: function() {
        this.$el.slideDown('slow');
    },

    showMenuButton: function() {
        this.$el.find('.menu_btn').show();
        this.hideBackButton();
    },

    showBackButton: function() {
        this.$el.find('#cmtyx_header_back_button').show();
    },

    hideMenuButton: function(backOption) {
        this.$el.find('.menu_btn').hide();
        if (backOption.back === true) {
            this.showBackButton();
        }
    },

    hideBackButton: function() {
        this.$el.find('#cmtyx_header_back_button').hide();
    },

    triggerPreviousView: function() {
        Vent.trigger('backToPrevious');
    },

    openLeftMenu: function() {
        popupController.openLeftMenu(this);
    }

});

module.exports = HeaderView;
