'use strict';

define([
	'./catalogs-controller',
	'./order-controller',
	'./landing-controller',
	'./popups-controller',
	], function(CatalogsController, OrderController, LandingController, PopupsController){
	var ControllersDispatcher = Mn.Object.extend({
		initialize: function() {
			this.catalogsController = new CatalogsController();
			this.catalogsController.dispatcher = this;
			this.orderController = new OrderController();
			this.orderController.dispatcher = this;
			this.landingController = new LandingController();
			this.landingController.dispatcher = this;
			this.popupsController = new PopupsController();
			this.popupsController.dispatcher = this;
		},
		getCatalogsController: function() {
			return this.catalogsController;
		},
		getOrderController: function() {
			return this.orderController;
		},
		getLandingController: function() {
			return this.landingController;
		},
		getPopupsController: function() {
			return this.popupsController;
		},
	});
	return new ControllersDispatcher();
});