'use strict';

define([
    'packery/js/packery',
    'jquery-bridget/jquery-bridget',
    '../scripts/appCache.js',
    '../../vendor/scripts/js.cookie',
    '../scripts/actions/configurationActions',
    '../scripts/actions/sessionActions',
    './controllers/catalogs-controller',
    './controllers/order-controller',
    './controllers/popups-controller',
    './temporary-component'
	], function(Packery, jQueryBridget, appCache, Cookies,
		configurationActions, sessionActions, catalogsController, orderController, popupsController,
		temporaryComponent){
		var App = new Mn.Application({
			onStart: function() {
				this.options.initAnimationsOnPage();
				//Get sasl data for busineses
				if (window.saslData) {
			        appCache.set('saslData', window.saslData);
			    }
			    if (window.saslData.error) {
		            loader.showFlashMessage(window.saslData.error.message);
		            return;
		        }

				var conf = configurationActions.getConfigurations();

				this.params = window.community;
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
		            sessionActions.getSessionFromLocalStorage()
		            	.then(function(response) {
			                Backbone.history.start({
			                    pushState: true
			                });
			                popupsController.onLoginStatusChanged();
		            });
		        }

		        this.options.initSubviews();
			},

			initSubviews: function() {
				catalogsController.manageCatalog();
			},

			initAnimationsOnPage: function() {
				jQueryBridget( 'packery', Packery, $ );
		        
		        //Yuras temporary code
				temporaryComponent.init();
			}
		});

		return App;
});