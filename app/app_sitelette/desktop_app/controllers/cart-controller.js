'use strict';

define([
	'../../scripts/appCache',
	'../views/cartLayout'
	], function(appCache, CartLayoutView){
	var CartController = Mn.Object.extend({
		initialize: function() {
			this.layout = new CartLayoutView();
		}
	});
	return new CartController();
});