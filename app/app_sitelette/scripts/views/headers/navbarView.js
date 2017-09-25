/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    h = require('../../globalHelpers'),
    config = require('../../appConfig'),
    appCache = require('../../appCache'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    promotionsController = require('../../controllers/promotionsController'),
    popupController = require('../../controllers/popupController'),
    Cookies = require('../../../../vendor/scripts/js.cookie');

var NavbarView = Backbone.View.extend({

    el: '#cmtyx_navbar',

    events: {
        'click .menu_button_1': 'openMenu',
        'click .menu_button_2': 'openPromotion',
        'click .menu_button_3': 'triggerCatalogsView',
        'click .menu_button_4': 'triggerAboutUsView',
        'click .menu_button_5': 'toggle'
    },

    initialize: function(options) {
        this.$el.navbar();
        this.options = options || {};
        //this.restaurant = options.restaurant;
        //this.page = options.page;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        this.visible=true;

        var user = sessionActions.getCurrentUser();
        if (user.getUID()) {
            $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');
        };

        this.listenTo(Vent, 'login_success logout_success', this.render, this);

        this.listenTo(this.parent, 'hide', this.remove, this);

        // Check if user launches promotion URL
        // and open promotions
        // if (community.type == 'p') {
        //     delete community.type;
        //     var u = community.uuidURL;
        //     delete community.uuidURL;
        //     this.openPromotion(u);
        // };

        Vent.on('forceSignin', this.signin ,this);
    },

    triggerCatalogsView: function() {
        var saslData = appCache.get('saslData');
        if (saslData) {
            switch (saslData.retailViewType) {
                case 'ROSTER':
                    this.triggerRosterView();
                    break;
                case 'CATALOGS':
                    Vent.trigger('viewChange', 'catalogs', {
                        id: [this.sa, this.sl]
                    });
                    break;
                case 'CATALOG':
                    Vent.trigger('viewChange', 'catalog', {
                        backToRoster: false,
                        backToCatalogs: false,
                        backToCatalog: true
                    });
                    break;
            default:
            }
        }
    },

    triggerRosterView: function() {
        var uuid = 'ROSTER';//
            //modelId = this.options.page.model.id;
        Vent.trigger('viewChange', 'roster', {
          //  sasl: modelId,
            id: uuid,
            backToRoster:false,
            rosterId:uuid,
            launchedViaURL:false
         }, { reverse: false });
    },

    openPromotion: function(pid) {
        // loader.show('retrieving promotions');
        Vent.trigger('showPromotions');
        // Vent.trigger('scrollToBlock', '.promotion_block');
        // promotionsController.fetchPromotionUUIDsBySasl(
        //     this.sa,
        //     this.sl,
        //     this.user.getUID() //??? this.page.user.getUID()
        // ).then(function(promotions) {
        //     if(promotions.length < 1) {
        //         loader.showFlashMessage('No promotions were found');
        //     } else {
        //         debugger;
        //         this.page.openSubview('promotions', promotions, {pid: pid, sasl: this.model});
        //     }
        // }.bind(this), function () {
        //     loader.showFlashMessage('error retrieving promotions');
        // });
    },

    triggerContestsView: function() {
        debugger;
        this.page.withLogIn(function () {
            Vent.trigger('viewChange', 'contests', [this.sa, this.sl]);
        }.bind(this));
    },

    triggerAboutUsView: function() {
        Vent.trigger('viewChange', 'aboutUs', [this.sa, this.sl]);
    },

    openMenu: function() {
        // if (this.restaurant) {
        //     this.page.openSubview('restaurantMenu', {}, this.restaurant.get('services'));
        // }
    },

    confirmSignout: function () {
        popupController.confirmation({}, {
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        });
    },

    signout: function() {
        var user = sessionActions.getCurrentUser();
        loader.show();
        userController.logout(user.getUID()).then(function(){
            loader.showFlashMessage( 'signed out' );
            $('.menu_button_5').removeClass('sign_out');
            // $('.menu_button_5').removeClass('navbutton_sign_out').addClass('navbutton_sign_in');
            // $('.menu_button_5').removeClass('cmtyx_text_color_1');
            // $( ".menu_button_5" ).siblings().remove();
            // $( ".glyphicon-ok" ).hide();
        }, function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    signin: function() {
        popupController.signin(this.model);
    },

    toggle: function () {
        var user = sessionActions.getCurrentUser();
        if ( !user.getUID() || Cookies.get('cmxAdhocEntry') == 'true') {
            this.signin();
        } else {
            this.confirmSignout();
        }
    },

    hide : function(){
    	$(this.el).slideUp('slow');
    	this.visible=false;
    },

    show : function(){
    	$(this.el).slideDown('slow');
    	this.visible=true;
    }

});

module.exports = NavbarView;
