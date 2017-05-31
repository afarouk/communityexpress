'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
	'../../scripts/actions/orderActions',
	], function(appCache, h, orderActions){
	var HistoryController = Mn.Object.extend({
		getHistory: function() {
			orderActions.retrieveOrdersByUID()
				.then(this.showHistory.bind(this));
		},
		showHistory: function(history) {
			console.log(history);
		}
	});
	return HistoryController;
});