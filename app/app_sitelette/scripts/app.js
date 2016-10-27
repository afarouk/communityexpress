'use strict';

var userController = require('./controllers/userController'),
    configurationActions = require('./actions/configurationActions'),
    updateActions = require('./actions/updateActions'),
    sessionActions = require('./actions/sessionActions'),
    pageController = require('./pageController.js'),
    config = require('./appConfig.js'),
    h = require('./globalHelpers'),
    Vent = require('./Vent.js'),
    loader = require('./loader'),
    pageFactory = require('./pageFactory.js'),
    Geolocation = require('./Geolocation.js'),
    appCache = require('./appCache.js'),
    Cookies = require('../../vendor/scripts/js.cookie'),

    LandingView = require('./views/landingView'),
    NavbarView = require('./views/headers/navbarView'),
    HeaderView = require('./views/headers/headerView'),
    ContactUsInLandingView = require('./views/landingSubviews/contactUsInLandingView'),

    EventsView = require('./views/landingSubviews/eventsView'),
    DiscountsView = require('./views/landingSubviews/landingDiscountsView'),
    VideoView = require('./views/landingSubviews/videoView'),
    GalleryView = require('./views/landingSubviews/galleryView'),
    PollContestView = require('./views/landingSubviews/pollContestView'),
    LandingReviewsView = require('./views/landingSubviews/landingReviewsView'),
    PromotionView = require('./views/landingSubviews/promotionView'),
    PhotoContestView = require('./views/landingSubviews/photoContestView'),
    LoyaltyCardView = require('./views/landingSubviews/loyaltyCardView');

var hasUIDinQueryParams = function() {
    var params = location.search.match(/UID=/);
    return (params && params.length);
};

var App = function() {
    this.params = window.community;
    /*
     * .on([eventkey], function(model, value, options), [context]);
     */
    if (window.saslData) {
        appCache.set('saslData', window.saslData);
    }
    Vent.on('viewChange', this.goToPage, this);
    Vent.on('backToPrevious', this.backToPrevious, this);
    /*
		We may need LandingView to manage landing view (home) interactions.
	  But we no longer have to switch to it. It is visible by default.*/

    $.mobile.initializePage();
    this.navbarView = new NavbarView();
		this.headerView = new HeaderView({
            navbarView: this.navbarView
        });

    this.landingView = new LandingView();

    this.initSubviews();

    this.currentView = this.landingView;
    this.saveInstance('restaurant', this.landingView);

    if (typeof window.community.type !== 'undefined' && window.community.type !== '') {
        this.checkType(window.community.type);
    }

    Backbone.View.prototype.addEvents = function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    }

    Vent.on('login_success', this.afterTriedToLogin, this);
    Vent.on('logout_success', this.afterTriedToLogin, this);
    Vent.on('force_logout', this.afterTriedToLogin, this);
};

App.prototype = {

    init: function() {
        /* AF bind the video scripts to any video elements */
        $( document ).ready(function() {
          $('.embedded_videos').on('click', function () {
          var vid=$(this).attr("idVideo");
          //console.log(vid);
          $(this).html('<iframe width="320"height="240" src="https://www.youtube.com/embed/'+vid+'?playsinline=1" frameborder="0"allowfullscreen></iframe>').css('background','none');});
        });




        if (window.saslData.error) {
            loader.showFlashMessage(window.saslData.error.message);
            return;
        }

        //Geolocation.startWatching();
        var conf = configurationActions.getConfigurations();

        if (this.params.demo) {
            configurationActions.toggleSimulate(true);
        };
        if (this.params.embedded) {
            conf.set('embedded', true);
        };
        if (this.params.UID) {
            Cookies.set("cmxUID", this.params.UID, {expires:365});
            sessionActions.authenticate(this.params.UID)
                .always(function() {
                    Backbone.history.start({
                        pushState: true
                    });
                });
        } else if (Cookies.get('cmxUID')) {
            sessionActions.getSessionFromLocalStorage().then(function() {
                Backbone.history.start({
                    pushState: true
                });
            });
        } else if (this.params.canCreateAnonymousUser) {
            $.when(sessionActions.createAnonymousUser()).done(function() {
                sessionActions.getSessionFromLocalStorage().then(function() {
                    Backbone.history.start({
                        pushState: true
                    });
                });
            });
        } else {
            this.afterTriedToLogin();
            return;
        }
    },

    initSubviews: function(){
        this.viewsInLanding = {
            loyaltyCard: this.createSubview( LoyaltyCardView ),
            events: this.createSubview( EventsView ),
            discounts: this.createSubview( DiscountsView ),
            video: this.createSubview( VideoView ),
            gallery: this.createSubview( GalleryView ),
            pollContest: this.createSubview( PollContestView, !saslData.hasPollContest ),
            landingReviews: this.createSubview( LandingReviewsView ),
            promotion: this.createSubview( PromotionView ),
            PhotoContest: this.createSubview( PhotoContestView, !saslData.hasPhotoContest ),
            contactUs: this.createSubview( ContactUsInLandingView )
        };
        this.landingView.viewsInLanding = this.viewsInLanding;
    },

    //when we don't have subview el in DOM don't create subview
    createSubview: function(view, hideContest) {
        var inDOM = $(view.prototype.el);
        if (inDOM.length > 0) {
            if (hideContest) {
                inDOM.hide();
            } else {
                return new view();
            }
        } else {
            inDOM.hide();
        }
    },

    afterTriedToLogin: function() {
        _.each(this.viewsInLanding, function(view) {
            if (view && typeof view.afterTriedToLogin === 'function') {
                view.afterTriedToLogin();
            }
        });
    },

    checkType: function(type) {
        var uuid = window.community.uuidURL;
        delete community.type;
        delete community.uuidURL;

        switch (type) {
            case 'e':
                //Events
                $(document).ready(function(){
                    setTimeout(function () {
                        Vent.trigger('openEventByShareUrl', uuid);
                    }, 400);
                });
            break;
            case 'y':
                //Loyalty block
                $(document).ready(function(){
                    setTimeout(function () {
                        Vent.trigger('scrollToBlock', '.loyalty_program_block');
                    }, 2000);
                });
            break;
            case 'h':
                //Photo contest
                $(document).ready(function(){
                    setTimeout(function () {
                        Vent.trigger('openPhotoByShareUrl', uuid);
                    }, 2500);
                });
            break;
            case 'l':
                //Poll contest
                $(document).ready(function(){
                    setTimeout(function () {
                        Vent.trigger('openPollByShareUrl', uuid);
                    }, 1500);
                });
            break;
            case 'p':
                //Promotions
                $(document).ready(function(){
                    setTimeout(function () {
                        Vent.trigger('openPromotionByShareUrl', uuid);
                    }, 1500);
                });
                //&t=p&u=RorazeUAS5eH9grwf2o4Qw
            break;
            case 'r':
                this.goToPage('roster', {
                    sasl: appCache.get('saslData'),
                    id: uuid,
                    backToRoster:false,
                    rosterId: uuid,
                    launchedViaURL: true
                 }, { reverse: false });
            break;
        };
    },

    isEmbedded: function() {
        return window.community.isEmbedded;
    },

    setGlobalConfigurations: function(options) {
        options = options || {};
        if (options.demo === true) {
            configurationActions.toggleSimulate(true);
        }
        if (options.server) {
            config.productionRoot = this.params.protocol + options.server + '/apptsvc/rest';
            config.simulateRoot = this.params.protocol + options.server + '/apptsvc/rest';
            config.apiRoot = config.productionRoot;
        }
    },

    //save created view instances
    viewInstances: {},
    checkInstance: function(viewName) {
        return this.viewInstances[viewName];
    },

    saveInstance: function(viewName, view) {
        this.viewInstances[viewName] = view;
    },

    //TODO use it in a future in case
    // when we need update view each time for exaple
    deleteInstance: function(viewName) {
        delete this.viewInstances[viewName];
    },

    backToPrevious: function() {
        //simple solution
        //call goBack method in a current view
        //for return to previous
        this.currentView.goBack();
    },

    visibilityOnSwitchPage: function(viewName) {
        if (viewName === 'restaurant') {
            this.headerView.showMenuButton();
            this.navbarView.show();
        } else {
            this.headerView.hideMenuButton({back: true});
            this.navbarView.hide();
        }

        if (viewName === 'roster' || viewName === 'catalog' ||
            viewName === 'singleton') {
            this.headerView.headerShow();
        } else if (viewName === 'address'){
            this.headerView.headerHide();
        }
    },

    /*
     * 'roster', options, {reverse:false}
     */
    goToPage: function(viewName, id, options) {
        var exists;
        // this.landingView.undelall();
        console.log("app.js:gotoPage: " + viewName);
        this.setGlobalConfigurations(options);

        this.visibilityOnSwitchPage(viewName);

        loader.show('loading');

        //check if view was created
        exists = this.checkInstance(viewName);
        if (this.shouldBeLoadedFromCache(viewName, exists)) { //should we retriveCatalog each time?
            if (id && id.backTo) exists.options.backTo = id.backTo;
            this.changePage(exists, options);
            loader.hide();
        } else {
            this.initializePage(viewName, id, options).then(function(page) {
                this.saveInstance(viewName, page);
                this.changePage(page, options);
                loader.hide();
            }.bind(this), function(e) {
                loader.showErrorMessage(e, 'There was a problem loading this page');
            });
        }
        this.previousViewName = viewName;
    },

    shouldBeLoadedFromCache: function(viewName, exists) {
        if (exists) {
            if (viewName === 'catalog' ||
                viewName === 'roster' ||
                viewName === 'singleton' ||
                viewName === 'contactUs' ||
                viewName === 'businessHours' ||
                viewName === 'upload_photo' ||
                viewName === 'reviews' ||
                (viewName === 'address' && this.previousViewName === 'roster' ) ||
                (viewName === 'address' && this.previousViewName === 'catalog' ) ||
                (viewName === 'address' && this.previousViewName === 'singleton' ) ||
                (viewName === 'address' && this.previousViewName === 'restaurant')) {
                    if (viewName === 'address') {
                        this.removeCashedViews(['add_address', 'payment','payment_card', 'summary']);
                    }
                    return false;
                } else {
                    return true;
                }
        } else {
            return false;
        }
    },

    removeCashedViews: function(list) {
        list.forEach(_.bind(function(name) {
            this.deleteInstance(name);
        }, this));
    },

    initializePage: function(viewName, options) {
        return pageController[viewName].call( //
            pageController, options).pipe(function(pageModel) {
            // this.updateTitle(viewName, pageModel);
            // this.updateTouchIcon(viewName, pageModel);
            return pageFactory.create(viewName, pageModel);
        }.bind(this));
    },


    changePage: function(view, jqmOptions) {
        var defaults = {
            allowSinglePageTransition: true,
            transition: 'none',
            changeHash: false,
            showLoader: false,
        };
        var settings = _.extend(defaults, jqmOptions);

        var content = view.renderContent();
        if (typeof content === 'undefined') {
            console.log("ERROR: cannot switch page, null content");
            return;
        }

        this.lastPageId = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');
        console.log(" Last page =" + this.lastPageId);

        var newPageId = content.attr('id');
        if ((typeof this.lastPageId !== 'undefined') && newPageId == this.lastPageId) {
            console.log("WARN: ignoring same page reload");
            return;
        }

        console.log("Switching to page : " + newPageId);

        /* AF: We have to put this content in the
        	 DOM first before jquery Mobile can manage the
        	 page switching. We may want to remove the old
        	 one. In this example we remove and re-add */
        if($('body').find(content).length === 0) {
            $('#' + newPageId).remove();
            $('body').append(content);
        }
        /* done removing and adding */

        /* If this is not the landing view, we may want to replace
          the hamburger with a back button and set it up to
          switch to the landing view */
        $.mobile.pageContainer.pagecontainer('change', content, settings);
        view.trigger('show');// <-- temporary solution
        this.currentView = view;

        /* need to re-initialize the header and footer. Bug in jqm? */
        $("[data-role='navbar']").navbar();
        $("[data-role='header'], [data-role='footer']").toolbar();
        $('.splash_screen').remove();
    },

    /* AF this function is not necessary anymore. We set title via PHP*/
    updateTitle: function(viewName, pageModel) {
        var title;
        title = pageModel.model.get('saslName');
        switch (viewName) {
            case 'restaurant':
            case 'promotions':
                title = pageModel.model.get('saslName');
                break;
            case 'chat':
            case 'reviews':
                title = pageModel.restaurant.get('saslName');
                break;
            case 'editable':
                title = pageModel.restaurant.get('saslName');
                break;
            default:
                title = 'chalkboardstoday.com';
        }
        document.title = title;
    },

    /* AF this function is not necessary anymore. We set icon via PHP*/
    updateTouchIcon: function(viewName, pageModel) {
        var icon;
        switch (viewName) {
            case 'restaurant':
            case 'promotions':
                icon = pageModel.model.get('appleTouchIcon60URL');
                break;
            case 'chat':
                icon = pageModel.restaurant.get('appleTouchIcon60URL');
                break;
            case 'reviews':
                icon = pageModel.restaurant.get('appleTouchIcon60URL');
                break;
            default:
                icon = 'icon_57.png';
        }
        var links = document.getElementsByTagName('link');
        _(links).each(function(link) {
            if (link.getAttribute('rel') === 'apple-touch-icon') {
                link.href = icon;
            }
        });
    }

};

module.exports = App;
