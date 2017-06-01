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
			this.dispatcher.get('popups').showOrdersHistory(history);
		},
		getOrderDetails: function(orderUUID){
			var $def = $.Deferred();
			orderActions.retrieveOrderByID(orderUUID)
				.then(function(html){
					$def.resolve(html);
				});
			return $def;
		}
	});
	return HistoryController;
});