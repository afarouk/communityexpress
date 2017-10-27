'use strict';

define([
	'./_catalogs-controller',
	'./_customize-controller',
	'./_order-controller',
	'./_landing-controller',
	'./_popups-controller',
	'./_history-controller',
	'./_medical-controller'
	], function(CatalogsController, CustomizeController, OrderController, 
		LandingController, PopupsController, HistoryController, MedicalController){
	var ControllersDispatcher = Mn.Object.extend({
		initialize: function() {
			Mn.CollectionView.prototype.dispatcher = this;
			Mn.View.prototype.dispatcher = this;
			this.initControllers();

			if (!this.checkMedical()) {
				this.get('order').renderOrder(); //shows empty cart
			}
		},
		//different type of application MEDICAL APP
		checkMedical: function() {
			return window.saslData.domainEnum === 'MEDICURIS' ||
		            window.saslData.domainEnum === 'MOBILEVOTE';
		},
		initControllers: function() {
			if (this.checkMedical()) {
				this.controllers = {
					// 'medical': {},
					'landing': new LandingController(),
					'popups': new PopupsController(),
					'medical': new MedicalController()
				};
			} else {
				this.controllers = {
					'catalogs': new CatalogsController(),
					'customize': new CustomizeController(),
					'order': new OrderController(),
					'landing': new LandingController(),
					'popups': new PopupsController(),
					'history': new HistoryController()
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
			if (this.checkMedical()) {
				this.get('landing').start();
			} else {
				this.get('catalogs').manageCatalog();
				this.get('landing').start();
			}
		},

		onLoginStatusChanged: function() {
			if (this.checkMedical()) {
				//
			} else {
				this.get('landing').onLoginStatusChanged();
				this.get('order').onLoginStatusChanged();
			}
		}
	});
	return new ControllersDispatcher();
});