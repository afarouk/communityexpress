'use strict';

define([
	'ejs!../../templates/order/addCard.ejs',
	], function(template){
	var AddCardView = Mn.View.extend({
		template: template,
		className: 'page add_card_page',
		initialize: function() {
		}
	});
	return AddCardView;
});