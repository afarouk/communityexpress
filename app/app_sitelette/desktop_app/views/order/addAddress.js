'use strict';

define([
	'ejs!../../templates/order/addAddress.ejs',
	], function(template){
	var AddAddressView = Mn.View.extend({
		template: template,
		className: 'page add_address_page',
		initialize: function() {
		}
	});
	return AddAddressView;
});