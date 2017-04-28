'use strict';

define([
	'./_catalogs-controller',
	'./_customize-controller',
	'./_order-controller',
	'./_landing-controller',
	'./_popups-controller',
	], function(CatalogsController, CustomizeController, OrderController, LandingController, PopupsController){
	var ControllersDispatcher = Mn.Object.extend({
		initialize: function() {
			Mn.CollectionView.prototype.dispatcher = this;
			Mn.View.prototype.dispatcher = this;
			this.initControllers();

			this.get('order').renderOrder(); //shows empty cart
		},
		initControllers: function() {
			this.controllers = {
				'catalogs': new CatalogsController(),
				'customize': new CustomizeController(),
				'order': new OrderController(),
				'landing': new LandingController(),
				'popups': new PopupsController()
			};
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
		}
	});
	return new ControllersDispatcher();
});