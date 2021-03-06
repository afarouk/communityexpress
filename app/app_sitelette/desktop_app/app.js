'use strict';

define([
    '../scripts/appCache.js',
    '../../vendor/scripts/js.cookie',
    '../scripts/actions/configurationActions',
    '../scripts/actions/sessionActions',
    './controllers/dispatcher'
	], function(appCache, Cookies,
		configurationActions, sessionActions, dispatcher){
		var App = new Mn.Application({
			onStart: function() {
				this.options.initLayout();
				//Get sasl data for busineses
				if (window.saslData) {
			        appCache.set('saslData', window.saslData);
			    }
			    if (window.saslData.error) {
			    	dispatcher.get('popups').showMessage({
						message: window.saslData.error.message,
						loader: true
					});
					//TODO show error screen
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
		        if (dispatcher.checkSecurity()) {
		            dispatcher.get('security').init(this.params);
		        } else {
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
			            sessionActions.getSessionFromLocalStorage(this.params)
			            	.then(function(response) {
				                Backbone.history.start({
				                    pushState: true
				                });
				                dispatcher.get('popups').onLoginStatusChanged();
			            	}, function() {
			            		// Cookies.remove('cmxUID');
			            	}.bind(this));
			        } else if (this.params.canCreateAnonymousUser && !this.params.embedded) {
			            $.when(sessionActions.createAnonymousUser()).done(function() {
			                sessionActions.getSessionFromLocalStorage().then(function() {
			                    Backbone.history.start({
			                        pushState: true
			                    });
			                    dispatcher.get('popups').onLoginStatusChanged();
			                });
			            });
			        } else {
			        	dispatcher.get('popups').onLoginStatusChanged();
			        }

			        this.options.initSubviews();
		        	this.options.checkType();
			    }
			},

			initSubviews: function() {
				dispatcher.initSubviews();
			},

			initLayout: function() {
				//disabling autofocus in popups
				$.ui.dialog.prototype._focusTabbable = function(){};

				var $grid = $('.grid');

				setTimeout(function() { 
					$('.cssload-thecube').hide();
					$grid.addClass('flex-container');
					dispatcher.layoutReady();
				}.bind(this), 1200);
			},
			checkType: function() {
				//TODO not ready
                var type = window.community.type,
                	uuid = window.community.uuidURL,
                	catalogId = window.community.catalogId;
                if (!type) return;
		        delete community.type;
		        delete community.uuidURL;
		        delete community.catalogId;

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
		            case 'i':
		            	//Reorder
		                //http://localhost/democicero?t=i&u=ezH0YR9wQrqZgpVtCNe6CQ&catalogId=43QYLDB6TRSHD3tBUNpopw&UID=user20.781305772384780045&demo=true
		            	dispatcher.get('catalogs').getCatalogForReorder({
		                	orderUUID: uuid,
		                	catalogId: catalogId
		                });
		            	break;
		            default:
		            	throw new Error('Community type is wrong');
		            	break;
		        };
			}
		});

		return App;
});