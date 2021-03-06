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
        'click #cmtyx_header_menu_button': 'openLeftMenu',
        //'click #cmtyx_header_qrCode_button': 'qrCodeExpande',
        'click #cmtyx_header_prev_page_button': 'goPrevPage'
    },

    initialize: function(options) {
        this.$el.toolbar();
        this.options = options || {};

        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        Vent.on('update_message_count', this.updateMessageCount, this);
        Vent.on('logout_success', this.hideMessageCount, this);

        this.showHidePrevPageBtn();
    },

    hideMessageCount: function() {
        this.updateMessageCount(0);
    },

    updateMessageCount: function(count) {
        if (count > 0) {
            this.$('.messages_counter').text(count).show();
        } else {
            this.$('.messages_counter').hide();
        }
    },

    headerHide: function() {
        this.$el.slideUp('slow');
    },

    headerShow: function() {
        this.$el.slideDown('slow');
    },

    showMenuButton: function() {
        this.$el.find('.menu_btn').show();
        this.$el.find('#cmtyx_header_qrCode_button').show();
        this.showHidePrevPageBtn();
        this.hideBackButton();
    },

    showBackButton: function() {
        this.$el.find('#cmtyx_header_back_button').show();
    },

    hideMenuButton: function(backOption) {
        this.$el.find('.menu_btn').hide();
        this.$el.find('#cmtyx_header_qrCode_button').hide();
        this.$el.removeClass('with_back_btn');
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
        popupController.openLeftMenu();
    },

    qrCodeExpande: function() {

          $('#loyalty-bar-code').toggleClass('visible');

    },

    checkPrevPageAvailable: function() {
        return document.referrer;
    },

    showHidePrevPageBtn: function() {
        if ( this.checkPrevPageAvailable() ) {
            this.$el.addClass('with_back_btn');
        }
        else {
            this.$el.removeClass('with_back_btn');
        }
    },

    goPrevPage: function() {
        window.history.back();
    }
});

module.exports = HeaderView;
