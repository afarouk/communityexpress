'use strict';

define([
	'../../scripts/appCache',
	'../../../vendor/scripts/js.cookie',
	'./_catalogs-controller',
	'./_customize-controller',
	'./_order-controller',
	'./_landing-controller',
	'./_popups-controller',
	'./_history-controller',
	'./_security-controller',
	'../../chat_app/chat.js'
	], function(appCache, Cookies, CatalogsController, CustomizeController, OrderController, 
		LandingController, PopupsController, HistoryController, SecurityController, Chat){
	var ControllersDispatcher = Mn.Object.extend({
		initialize: function() {
			Mn.CollectionView.prototype.dispatcher = this;
			Mn.View.prototype.dispatcher = this;
			this.initControllers();

			if (!this.checkSecurity()) {
				this.get('order').renderOrder(); //shows empty cart
			}
		},
		//different type of application MEDICURIS or MOBILEVOTE APP
		checkSecurity: function() {
			return window.saslData.domainEnum === 'MEDICURIS' ||
		            window.saslData.domainEnum === 'MOBILEVOTE';
		},
		initControllers: function() {
			if (this.checkSecurity()) {
				this.controllers = {
					'landing': new LandingController(),
					'popups': new PopupsController(),
					'security': new SecurityController(),
					'chat': (new Chat()).start('desktop')
				};
			} else {
				this.controllers = {
					'catalogs': new CatalogsController(),
					'customize': new CustomizeController(),
					'order': new OrderController(),
					'landing': new LandingController(),
					'popups': new PopupsController(),
					'history': new HistoryController(),
					'chat': (new Chat()).start('desktop')
				};
			}
			_.each(this.controllers, function(controller) {
				_.extend(controller, {
					dispatcher: this,
					getRegionView: this.getRegionView,
					resolver: this.resolver,
					rejecter: this.rejecter
				}); 
			}.bind(this));
		},
		get: function(name) {
			var controller = this.controllers[name];
			if (controller) return controller
			throw new Error('Controller ' + name + ' not exsist!');
		}, 
		getRegionView: function(regionName, callback) {
			var region = this.layout ? this.layout.getRegion(regionName) : null,
				currentView = region ? region.currentView : null;
			if (currentView) {
				if (typeof callback === 'function') {
					callback(currentView);
				}
			}
		},
		//dererred resolver for promise
		resolver: function(def, data) {
			setTimeout(function(){
				def.resolve(data);
			}, 0)
			return def;
		},
		//dererred rejecter for promise
		rejecter: function(def) {
			setTimeout(function(){
				def.reject(null);
			}, 0)
			return def;
		},

		layoutReady: function() {
			_.each(this.controllers, function(controller) {
				controller.triggerMethod('layoutReady');
			}.bind(this));
		},

		initSubviews: function() {
			if (this.checkSecurity()) {
				this.get('landing').start();
				this.get('landing').onLoginStatusChanged();
			} else {
				this.get('catalogs').manageCatalog();
				this.get('landing').start();
			}
		},

		onLogoutSuccess: function() {
			if (this.checkSecurity()) {
				this.get('security').onLogoutSuccess();
			}
		},

		onChatStateChange: function() {
			var user = appCache.get('user'),
				adhocEntry = Cookies.get('cmxAdhocEntry'),
				logged = user && user.getUID() && adhocEntry == 'false' ? true : false;
			if (logged) {
				this.get('chat').chatStart();
			} else {
				this.get('chat').chatStop();
			}
		},

		onLoginStatusChanged: function() {
			this.onChatStateChange()
			if (this.checkSecurity()) {
				this.initSubviews();
			} else {
				this.get('landing').onLoginStatusChanged();
				this.get('order').onLoginStatusChanged();
			}


		}
	});
	return new ControllersDispatcher();
});