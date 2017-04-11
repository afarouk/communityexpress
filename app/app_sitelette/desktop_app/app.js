'use strict';

define([
    'packery/js/packery',
    'jquery-bridget/jquery-bridget',
    '../scripts/appCache.js',
    '../../vendor/scripts/js.cookie',
    '../scripts/actions/configurationActions',
    '../scripts/actions/sessionActions',
    './controllers/_dispatcher',
    './temporary-component'
	], function(Packery, jQueryBridget, appCache, Cookies,
		configurationActions, sessionActions, dispatcher, 
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
		                    dispatcher.getPopupsController().onLoginStatusChanged();
		                });
		        } else if (Cookies.get('cmxUID')) {
		            sessionActions.getSessionFromLocalStorage()
		            	.then(function(response) {
			                Backbone.history.start({
			                    pushState: true
			                });
			                dispatcher.getPopupsController().onLoginStatusChanged();
		            	}, function() {
		            		Cookies.remove('cmxUID');
		            	}.bind(this));
		        } else {
		        	dispatcher.getPopupsController().onLoginStatusChanged();
		        }
		        this.options.initSubviews();
		        this.options.checkType();
			},

			initSubviews: function() {
				dispatcher.getCatalogsController().manageCatalog();
				dispatcher.getLandingController().start();
			},

			initAnimationsOnPage: function() {
				jQueryBridget( 'packery', Packery, $ );
		        
		        //Yuras temporary code
				temporaryComponent.init();
			}, 
			checkType: function() {
				//TODO not ready
                var type = window.community.type,
                	uuid = window.community.uuidURL;
                if (!type) return;
		        delete community.type;
		        delete community.uuidURL;

		        switch (type) {
		            case 'd':
		                //Discounts type
		                //'openDiscountByShareUrl', uuid
		                //&t=d&u=Ce9DJbTdR8ajRxmuZT7rHA&promoCode=TESTP

		                //TODO how should it work???
		                //maybe should be in saslData???
		                
		                dispatcher.getLandingController().onDiscountSelected({
		                	uuid:uuid
		                });
		            	break;
		            case 'p':
		                //Promotions type
		                dispatcher.getLandingController().onPromotionSelected({
		                	uuid:uuid
		                });
		                //'openPromotionByShareUrl', uuid
		                //&t=p&u=wtvngYZDQaKRcFZYfN2wCA
		            	break;
		            default:
		            	throw new Error('Community type is wrong');
		            	break;
		        };
			}
		});

		return App;
});