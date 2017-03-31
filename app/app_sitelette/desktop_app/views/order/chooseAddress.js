'use strict';

define([
	'ejs!../../templates/order/chooseAddress.ejs',
	], function(template){
	var ChooseAddressView = Mn.View.extend({
		template: template,
		className: 'page choose_address_page',
		initialize: function() {
			console.log(this.model.additionalParams);
			console.log(this.model.toJSON());
		},
		serializeData: function() {
			var favorites = this.model.additionalParams.userModel.favorites,
            	address = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl();
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
				address: address
			});
		},

		getAddressFromSasl: function() {
	        var address = {
	            name: saslData.saslName,
	            street: saslData.street,
	            street2: saslData.street2,
	            number: saslData.number,
	            city: saslData.city,
	            state: saslData.state,
	            zip: saslData.zip,
	            phone: saslData.telephoneNumber
	        };
	        return address;
	    },
	});
	return ChooseAddressView;
});