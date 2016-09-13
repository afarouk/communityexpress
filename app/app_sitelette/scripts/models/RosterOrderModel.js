'use strict';

var RosterOrderModel = Backbone.Model.extend({

	initialize: function(attr, options) {
		_.extend(this.attributes, this.getDefaults(options));
	},

	getDefaults: function(options) {
		var defaults = {
			serviceAccommodatorId: '',
			serviceLocationId: '',
			deliveryEmail: '',
			deliveryPhone: '',
			pickupSelected: true,
			deliverySelected: false,
			cashSelected: true,
			creditCardSelected: false,
			fundSourceId: options.fundsource.fundSourceId,
			items: [],
			taxAmount: null,
			totalAmount: null,
			currencyCode: options.priceAddons.currencyCode,
			saveCreditCardForFutureReference: options.fundsource.saveCardForReuse,
			deliveryAddress: {
				street: options.addresses[0].street,
				city: options.addresses[0].city,
				number: options.addresses[0].number
			},
			creditCard: {
				firstName: options.fundsource.firstName,
				lastName: options.fundsource.lastName,
				cardNumber: options.fundsource.creditCardNumber,
				expirationMonth: options.fundsource.expirationMonth,
				expirationYear: options.fundsource.expirationYear,
				cvv: options.fundsource.cvv
			}
		};
		return defaults;
	}
});

module.exports = RosterOrderModel;
