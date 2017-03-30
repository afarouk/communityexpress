'use strict';

define([
	'ejs!../../templates/order/summary.ejs',
	], function(template){
	var SummaryView = Mn.View.extend({
		template: template,
		className: 'page summary_page',
		initialize: function() {
		}
	});
	return SummaryView;
});