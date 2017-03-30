'use strict';

define([
	'../../scripts/appCache',
	'../views/popupsLayout',
	], function(appCache, PopupsLayoutView){
	var PopupsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new PopupsLayoutView();
			// this.layout.showChildView('popupsContainer', null);
		}
	});
	return new PopupsController();
});