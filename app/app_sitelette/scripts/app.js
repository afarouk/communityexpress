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
    Cookies = require('../../vendor/scripts/js.cookie');

var hasUIDinQueryParams = function () {
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
    Vent.trigger('viewChange', 'restaurant', window.community.friendlyURL);
};

App.prototype = {

    init: function() {

        if (window.saslData.error) {
            loader.showFlashMessage(window.saslData.error.message);
            return;
        }

        //Geolocation.startWatching();
        var conf = configurationActions.getConfigurations();


        if (this.params.demo) { configurationActions.toggleSimulate(true); };
        if (this.params.embedded) { conf.set('embedded', true); };
        if (this.params.UID) {
            //localStorage.setItem("cmxUID", this.params.UID);
						Cookies.set("cmxUID", this.params.UID);
            sessionActions.authenticate(this.params.UID)
                .always(function() {
                    Backbone.history.start({pushState: true});
                });
        //  } else if (localStorage.cmxUID) {
				} else if (Cookies.get('cmxUID')) {
            sessionActions.getSessionFromLocalStorage().then(function () {
                Backbone.history.start({pushState: true});
            });
        } else if (this.params.canCreateAnonymousUser) {
            $.when(sessionActions.createAnonymousUser()).done(function() {
                sessionActions.getSessionFromLocalStorage().then(function () {
                    Backbone.history.start({pushState: true});
                });
            });
        } else {
            return;
        }
    },

    isEmbedded: function () {
        var params = location.search.match(/embedded=true/);
        return (params && params.length);
    },

    setGlobalConfigurations: function (options) {
        options = options || {};
        if ( options.demo === true ) {
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
    goToPage: function( viewName, id, options ) {
        console.log("app.js:gotoPage: "+viewName);
        this.setGlobalConfigurations(options);

        if ( viewName === 'chat') { // redirect to restaurant view if user is not signed in
            viewName = userController.hasCurrentUser() ? 'chat' : 'restaurant';
        }

       // if ( viewName === 'catalog') { //
             //if(typeof options==='undefined'){
             //  var sa=window.community.serviceAccommodatorId;
             //  var sl=window.community.serviceLocationId;
             //}
       // }


        loader.show('loading');

        this.initializePage(viewName, id, options).then(function(page){
            this.changePage(page, options);
            loader.hide();
        }.bind(this), function(e){
            loader.showErrorMessage(e, 'There was a problem loading this page');
        });

    },

    initializePage: function(viewName, options) {
        return pageController[viewName].call( //
                pageController, options ).pipe(function(pageModel){
            // this.updateTitle(viewName, pageModel);
            // this.updateTouchIcon(viewName, pageModel);
            return pageFactory.create( viewName, pageModel );
        }.bind(this));
    },

    updateTitle: function (viewName, pageModel) {
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

    updateTouchIcon: function (viewName, pageModel) {
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
        _(links).each(function (link) {
            if (link.getAttribute('rel') === 'apple-touch-icon') {
                link.href = icon;
            }
        });
    },

    changePage: function(view, jqmOptions) {
        var defaults = {
            allowSinglePageTransition: true,
            transition: 'none',
            changeHash:false,
            showLoader: false,
        };
        var settings = _.extend(defaults, jqmOptions);
        var content = view.renderContent().$el;

        // hide initial html content
        $('#cmtyx_staticView').hide();

        $.mobile.initializePage();
        $($.mobile.pageContainer).pagecontainer('change', content, settings);
        $('.splash_screen').remove();
    }

};

module.exports = App;
