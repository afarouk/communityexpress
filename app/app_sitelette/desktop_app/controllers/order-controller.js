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
                this.showChooseAddress(orderModel);
            }.bind(this));
		},
		showChooseAddress: function(model) {
			var chooseAddress = new ChooseAddressView({
                	model: model
                });
            this.layout.showChildView('orderContainer', chooseAddress);
            this.listenTo(chooseAddress, 'onNextStep', this.onChooseAddressNext.bind(this, model));
            this.listenTo(chooseAddress, 'onBackStep', this.onChooseAddressBack.bind(this, model));
		},
		onChooseAddressNext: function(model, address) {
			console.log(address);
			if (address === 'saved') {
				var deliveryPickupOptions = model.additionalParams.deliveryPickupOptions;
				if (deliveryPickupOptions && deliveryPickupOptions.options && deliveryPickupOptions.options.length > 0) {
					this.showOrderTime(model);
				} else {
					this.showChoosePayment(model);
				}
			} else {
				this.showAddAddress(model);
			}
		},
		showOrderTime: function(model) {
			var orderTime = new OrderTimeView({
                	model: model
                });
            this.layout.showChildView('orderContainer', orderTime);
            this.listenTo(orderTime, 'onNextStep', this.onOrderTimeNext.bind(this, model));
            this.listenTo(orderTime, 'onBackStep', this.onOrderTimeBack.bind(this, model));
		},
		onOrderTimeNext: function(model) {
			this.showChoosePayment(model);
		},
		onOrderTimeBack: function(model) {
			
		},
		showChoosePayment: function(model) {
			var choosePayment = new ChoosePaymentView({
                	model: model
                });
            this.layout.showChildView('orderContainer', choosePayment);
            this.listenTo(choosePayment, 'onNextStep', this.onChoosePaymentNext.bind(this, model));
            this.listenTo(choosePayment, 'onBackStep', this.onChoosePaymentBack.bind(this, model));
		},
		onChoosePaymentNext: function(model) {
			
		},
		onChoosePaymentBack: function(model) {
			
		},
		showAddAddress: function(model) {
			var addAddress = new AddAddressView({
                	model: model
                });
            this.layout.showChildView('orderContainer', addAddress);
            this.listenTo(addAddress, 'onNextStep', this.onAddAddressNext.bind(this, model));
            this.listenTo(addAddress, 'onBackStep', this.onAddAddressBack.bind(this, model));
		},
		onAddAddressNext: function(model) {

		},
		onAddAddressBack: function(model) {
			this.showChooseAddress(model);
		},
		onChooseAddressBack: function(model) {
			console.log('back');
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