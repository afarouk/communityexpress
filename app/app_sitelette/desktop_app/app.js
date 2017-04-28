'use strict';

define([
    'packery/js/packery',
    'jquery-bridget/jquery-bridget',
    '../scripts/appCache.js',
    '../../vendor/scripts/js.cookie',
    '../scripts/actions/configurationActions',
    '../scripts/actions/sessionActions',
    './controllers/dispatcher'
	], function(Packery, jQueryBridget, appCache, Cookies,
		configurationActions, sessionActions, dispatcher){
		var App = new Mn.Application({
			onStart: function() {
				this.options.initPackeryOnPage();
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
		                    dispatcher.get('popups').onLoginStatusChanged();
		                });
		        } else if (Cookies.get('cmxUID')) {
		            sessionActions.getSessionFromLocalStorage()
		            	.then(function(response) {
			                Backbone.history.start({
			                    pushState: true
			                });
			                dispatcher.get('popups').onLoginStatusChanged();
		            	}, function() {
		            		Cookies.remove('cmxUID');
		            	}.bind(this));
		        } else {
		        	dispatcher.get('popups').onLoginStatusChanged();
		        }
		        this.options.initSubviews();
		        this.options.checkType();
			},

			initSubviews: function() {
				dispatcher.get('catalogs').manageCatalog();
				dispatcher.get('landing').start();
			},

			initPackeryOnPage: function() {
				//disabling autofocus in popups
				$.ui.dialog.prototype._focusTabbable = function(){};

				jQueryBridget( 'packery', Packery, $ );

				var $grid = $('.grid').packery({
				  itemSelector: '.grid-item',
				  columnWidth: '.grid-sizer',
				  percentPosition: true,
				  gutter: '.gutter-sizer'
				});

				setTimeout(function() { 
					$('.cssload-thecube').hide();
					$grid.show();
					$grid.packery();
					dispatcher.layoutReady();
				}.bind(this), 1200);
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
		                
		                dispatcher.get('landing').onDiscountSelected({
		                	uuid:uuid
		                });
		            	break;
		            case 'p':
		                //Promotions type
		                dispatcher.get('landing').onPromotionSelected({
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