'use strict';

define([
	'../../scripts/appCache',
	'./popups-controller',
	'../../scripts/actions/orderActions',
	'../../scripts/actions/saslActions',
	'../../scripts/actions/sessionActions',
	'../../scripts/models/RosterOrderModel',
	'../views/orderLayout',
	'../views/order/cartPage',
	'../views/order/chooseAddress',
	'../views/order/addAddress',
	'../views/order/orderTime',
	'../views/order/choosePayment',
	'../views/order/addCard',
	'../views/order/summary',
	], function(appCache, popupsController, orderActions, saslActions, sessionActions, RosterOrderModel,
		OrderLayoutView, CartPageView, ChooseAddressView, AddAddressView, 
		OrderTimeView, ChoosePaymentView, AddCardView, SummaryView){
	var OrderController = Mn.Object.extend({
		initialize: function() {
			this.layout = new OrderLayoutView();
		},
		renderOrder: function(catalogsController, options) {
			var cartPage = new CartPageView(options);
			this.layout.showChildView('orderContainer', cartPage);
			this.listenTo(cartPage, 'order:proceed', this.onOrder.bind(this, options));
			//TODO cart view collecton
		},
		onOrder: function(options) {
			options.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() : popupsController.requireLogIn(function() {
	        	//TODO get prices and address
	        	this.getAdditionalOrderInfo(options);
	        }.bind(this));
		},
		getAdditionalOrderInfo: function(options) {
			var sasl, 
				addresses, 
				fundsource;
			return saslActions.getSasl(options.sasl)
            .then(function(ret) {
                sasl = ret;
                return orderActions.getOrderPrefillInfo();
            }).then(function(ret) {
                addresses = ret.addresses;
                fundsource = ret.fundsource;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId');
                return orderActions.getPriceAddons(sa, sl);
            }).then(function(ret) {
            	var modelOptions = {
            		sasl: sasl,
                    addresses: addresses,
                    fundsource: fundsource,
                    priceAddons: ret,
                    user: sessionActions.getCurrentUser(),
                    basket: options.basket,
                    catalogId: options.catalogId,
                    deliveryPickupOptions: options.deliveryPickupOptions
            	};
                //var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + basketType);
                var orderModel = new RosterOrderModel({}, modelOptions);
                var chooseAddress = new ChooseAddressView({
                	model: orderModel
                });
                this.layout.showChildView('orderContainer', chooseAddress);
                this.listenTo(chooseAddress, 'onNextStep', this.onChooseAddressNext.bind(this));
            }.bind(this));
		},
		onChooseAddressNext: function(state) {
			console.log(state);
			if (state === 'delivery') {

			} else {
				
			}
		},
		showNoItemsPopup: function() {
			console.log('no items selected');
		},

		triggerOrder: function() {
	        this.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() :
	        popupController.requireLogIn(this.sasl, function() {
	            this.$('.sub_header').hide();
	            Vent.trigger('viewChange', 'address', {
	                id : this.sasl.getUrlKey(),
	                promoCode: this.promoCode,
	                catalogId : this.catalogId,
	                deliveryPickupOptions: this.options.catalog.collection.deliveryPickupOptions,
	                backToCatalog : true,// /* This will always be true */
	                backToCatalogs : this.backToCatalogs, /*
	                                                         * not used by order,
	                                                         * but passed back to
	                                                         * catalog view
	                                                         */
	                launchedViaURL:this.launchedViaURL,
	                navbarView : this.navbarView
	            }, {
	                reverse : true
	            });
	        }.bind(this));
	    },
	});
	return new OrderController();
});