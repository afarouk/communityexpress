'use strict';

define([
	'ejs!../../templates/order/chooseAddress.ejs',
	], function(template){
	var ChooseAddressView = Mn.View.extend({
		template: template,
		className: 'page choose_address_page',
		initialize: function() {
		}
	});
	return ChooseAddressView;
});