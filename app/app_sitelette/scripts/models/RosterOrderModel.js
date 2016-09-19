'use strict';

var RosterOrderModel = Backbone.Model.extend({

	currencySymbols: {
	    'USD': '$',
	    'EUR': '€',
	    'GBP': '£',
	    'INR': '₹',
	    'JPY': '¥',
	    'PLN': 'zł',
	    'UAH': '₴'
	},

	additionalParams: {},

	initialize: function(attr, options) {
		_.extend(this.attributes, this.getDefaults(options));
		this.setAdditionalParams(options);
	},

	setAdditionalParams: function(options) {
		_.extend(this.additionalParams, {
			symbol: this.currencySymbols[options.priceAddons.currencyCode] || '$',
			backToCatalog: options.backToCatalog,
			backToCatalogs: options.backToCatalogs,
			backToRoster: options.backToRoster,
			sasl: options.sasl,
			launchedViaURL: options.launchedViaURL,
			rosterId: options.rosterId,
			combinedItems: this.getCombinedItems(options.editModel),
			taxState: options.priceAddons.taxState,
			userModel: options.user,
			coords: this.getCoords(options.sasl.attributes),
			basket: options.basket,
			subTotal: this.getPriceWithoutTaxes(options) // etc...
		});
	},

	getDefaults: function(options) {
		var fundsource = options.fundsource || {};
		return {
			serviceAccommodatorId: options.sasl.get('serviceAccommodatorId'),
			serviceLocationId: options.sasl.get('serviceLocationId'),
			// deliveryEmail: '',
			// deliveryPhone: '',
			pickupSelected: false,
			deliverySelected: true,
			cashSelected: false,
			creditCardSelected: true,
			fundSourceId: fundsource.fundSourceId || null,
			items: this.getItems(options),
			taxAmount: this.calculateTaxes(options),
			totalAmount: this.getTotalPriceWithTax(options),
			currencyCode: options.priceAddons.currencyCode,
			saveCreditCardForFutureReference: fundsource.saveCardForReuse || false,
			deliveryAddress: this.getAddress(options.addresses[0] || {}),
			creditCard: this.getCreditCard(fundsource),
			userName: options.user.getUserName()
		};
	},

	getCoords: function(attrs) {
		return {
			long: attrs.longitude,
			lat: attrs.latitude
		};
	},

	getAddress: function(address) {
		var addr = {
				street: address.street,
				city: address.city,
				number: address.number
			};

		    this.additionalParams.addrIsEmpty = _.isMatch(addr, {street: undefined, city: undefined, number: undefined});
		return addr;
	},

	getCreditCard: function(fundsource) {
		if (fundsource.creditCardNumber) {
			this.additionalParams.cardExists = true;
		}
		return {
			firstName: fundsource.firstName,
			lastName: fundsource.lastName,
			cardNumber: fundsource.creditCardNumber,
			expirationMonth: fundsource.expirationMonth,
			expirationYear: fundsource.expirationYear,
			cvv: fundsource.cvv
		};
	},

	getItems: function(options) {
		return options.basket.getItems(options.sasl);
	},

	getPriceWithoutTaxes: function(options) {
		return parseFloat(options.basket.getTotalPrice().toFixed(2));
	},

	getTotalPriceWithTax: function(options) {
        var priceWithoutTaxes = this.getPriceWithoutTaxes(options);
        return parseFloat((this.calculateTaxes(options) + priceWithoutTaxes).toFixed(2));
    },

    calculateTaxes: function(options) {
        return parseInt(options.basket.getTotalPrice() * options.priceAddons.taxState) / 100;
    },

    getCombinedItems: function(editModel) {
    	var combinedItems = [];
		if (editModel) {
	    	editModel.each(function(item, index) {
	    		combinedItems.push({
	    			quantity: item.get('quantity'),
	    			displayText: item.get('displayText'),
	    			price: (item.get('quantity') * item.get('price')).toFixed(2)
	    		});
	    	});
		}
    	return combinedItems;
    }
});

module.exports = RosterOrderModel;