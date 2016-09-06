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
    HeaderView = require('./views/headers/headerView');

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
    /*
		We may need LandingView to manage landing view (home) interactions.
	  But we no longer have to switch to it. It is visible by default.*/


    //Vent.trigger('viewChange', 'restaurant', window.community.friendlyURL);
    $.mobile.initializePage();
    this.navbarView = new NavbarView();
		this.headerView = new HeaderView({
            navbarView: this.navbarView
        });
    this.landingView = new LandingView();

    if (typeof window.community.type !== 'undefined' && window.community.type !== '') {
        this.checkType(window.community.type);
    }

    Backbone.View.prototype.addEvents = function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    }
};

App.prototype = {

    init: function() {

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
            //localStorage.setItem("cmxUID", this.params.UID);
            Cookies.set("cmxUID", this.params.UID);
            sessionActions.authenticate(this.params.UID)
                .always(function() {
                    Backbone.history.start({
                        pushState: true
                    });
                });
            //  } else if (localStorage.cmxUID) {
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
            return;
        }
    },

    checkType: function(type) {
        var uuid = window.community.uuidURL;
        delete community.type;
        delete community.uuidURL;

        switch (type) {
            case 'e':
                this.goToPage('eventActive', {
                    sasl: appCache.get('saslData'),
                    id: uuid
                });
            break;
            case 'h':
                this.goToPage('photoContest', {
                    sasl: appCache.get('saslData'),
                    id: uuid
                });
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
        var params = location.search.match(/embedded=true/);
        return (params && params.length);
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

    /*
     * 'roster', options, {reverse:false}
     */
    goToPage: function(viewName, id, options) {
        console.log("app.js:gotoPage: " + viewName);
        this.setGlobalConfigurations(options);

        if (viewName === 'restaurant') {
            this.headerView.showMenuButton();
        } else {
            this.headerView.hideMenuButton({back: true});
        }

        if (viewName === 'chat') { // redirect to restaurant view if user is not signed in
            viewName = userController.hasCurrentUser() ? 'chat' : 'restaurant';
        }

        // if ( viewName === 'catalog') { //
        //if(typeof options==='undefined'){
        //  var sa=window.community.serviceAccommodatorId;
        //  var sl=window.community.serviceLocationId;
        //}
        // }


        loader.show('loading');

        this.initializePage(viewName, id, options).then(function(page) {
            this.changePage(page, options);
            loader.hide();
        }.bind(this), function(e) {
            loader.showErrorMessage(e, 'There was a problem loading this page');
        });

    },

    initializePage: function(viewName, options) {
        return pageController[viewName].call( //
            pageController, options).pipe(function(pageModel) {
            // this.updateTitle(viewName, pageModel);
            // this.updateTouchIcon(viewName, pageModel);
            return pageFactory.create(viewName, pageModel);
        }.bind(this));
    },

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
        /* done removing and adding */
        if($('body').find(content).length === 0) {
            $('#' + newPageId).remove();
            //TODO temporary solution
            $('body').append(content);
        }

        /* If this is not the landing view, we may want to replace
          the hamburger with a back button and set it up to
          switch to the landing view */

        $.mobile.pageContainer.pagecontainer('change', content, settings);

        // $("#cmtyx_header_menu_button").toggle();
        // $("#cmtyx_header_back_button").toggle();



        /* need to re-initialize the header and footer. Bug in jqm? */
        $("[data-role='navbar']").navbar();
        $("[data-role='header'], [data-role='footer']").toolbar();
        $('.splash_screen').remove();
    }

};

module.exports = App;
