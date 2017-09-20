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
	    this.set('promoCode',options.promoCode);
	    this.set('promoUUID',options.promoUUID);
	},

	setAdditionalParams: function(options) {
		//FIFP2016
		//localhost/demohairstylist?demo=true&desktopiframe=true
		_.extend(this.additionalParams, {
			symbol: this.currencySymbols[options.priceAddons.currencyCode] || '$',
			catalogId: options.catalogId,
			backToCatalog: options.backToCatalog,
			backToCatalogs: options.backToCatalogs,
			backToRoster: options.backToRoster,
			backToSingleton: options.backToSingleton,
			type: options.type || 'not specified',
			itemUUID: options.uuid,
			sasl: options.sasl,
			launchedViaURL: options.launchedViaURL,
			rosterId: options.rosterId,
			combinedItems: this.getCombinedItems(options),
			taxState: options.priceAddons.taxState,
			userModel: options.user,
			coords: this.getCoords(options.sasl.attributes),
			basket: options.basket,
			subTotal: this.getPriceWithoutTaxes(options),
			tip: 0,
			tipSum: 0,
			cachedTotalAmount: this.get('totalAmount'),
			paymentOnlineAccepted: options.sasl.get('services').catalog['paymentOnlineAccepted'],
			allowPickUp: true,//options.sasl.get('services').catalog['allowPickUp'], //true
			allowDelivery: true,//options.sasl.get('services').catalog['allowDelivery'], //true,
			allowCash: true,//options.sasl.get('services').catalog['allowCash'], //true,
			showTipOnSummaryPage: options.sasl.get('services').catalog['showTipOnSummaryPage'], //true,
			discount: 0,
			maximumDiscount: 0,
			minimumPurchase: 0,
			discountDisplay: options.discountPrice,
			promoCode: options.promoCode,
			promoCodeActive: false,
			deliveryDate: null,
			deliveryPickupOptions: options.deliveryPickupOptions || null
		});
           

	},

	getDefaults: function(options) {
		var fundsource = options.fundsource || {};
		return {
			serviceAccommodatorId: options.sasl.get('serviceAccommodatorId'),
			serviceLocationId: options.sasl.get('serviceLocationId'),
			// deliveryEmail: '',
			// deliveryPhone: '',
			comment: '',
			pickupSelected: false,
			deliverySelected: true,
			cashSelected: false,
			creditCardSelected: true,
			fundSourceId: fundsource.fundSourceId || null,
			items: this.getItems(options),
                        tipAmount: options.tipAmount,
			subTotal: this.getPriceWithoutTaxes(options),
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
		var addr;
		if (typeof window.community.deliveryAddress !== 'undefined') {
			addr = window.community.deliveryAddress;
		} else {
			addr = {
					street: address.street,
					city: address.city,
					number: address.number,
					state: address.state
				};
		}

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

    //TODO check if all works fine and then remove old calc code
    //now we calculate tax after tip and discount
    //I should know right order
    getTotalPriceWithTaxAfterAll: function(sum) {
    	var tax = this.getTaxesAfterAll(sum);
    	return parseFloat((tax + sum).toFixed(2));
    },

    getTaxesAfterAll: function(sum) {
    	var tax = parseInt(sum * this.additionalParams.taxState) / 100;
    	this.set({'taxAmount': tax}, {silent: true});
    	return tax;
    },
    //...............

    calculateTaxes: function(options) {
        return parseInt(options.basket.getTotalPrice() * options.priceAddons.taxState) / 100;
    },

    getCombinedItems: function(options) {
    	var combinedItems = [];
		if (options.editModel) {
	    	options.editModel.each(function(item, index) {
	    		combinedItems.push({
	    			quantity: item.get('quantity'),
	    			displayText: item.get('displayText'),
	    			price: (item.get('quantity') * item.get('price')).toFixed(2)
	    		});
	    	});
		} else { //TODO check why was if (options.catalogId)
			options.basket.each(function(item, index) {
				var text1 = item.get('version1DisplayText') || '',
					text2 = item.get('version2DisplayText'),
					text3 = item.get('version3DisplayText'),
					displayText = text1 + (text2 ? ', ' + text2 : '') + (text3 ? ', ' + text3 : '');
				combinedItems.push({
					isVersion: item.get('isVersion'),
					versionText: displayText,
	    			quantity: item.get('quantity'),
	    			displayText: item.get('itemName'),
	    			price: (item.get('quantity') * item.get('price')).toFixed(2),
	    			customizationNote: item.get('customizationNote') || '',
	    			subItems: item.get('subItems')
	    		});
			});
		}
    	return combinedItems;
    },

	getServiceConfiguration: function() {}
});

module.exports = RosterOrderModel;
