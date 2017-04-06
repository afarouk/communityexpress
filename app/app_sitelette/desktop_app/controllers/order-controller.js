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
	'../views/cartLoader',
	], function(appCache, popupsController, orderActions, saslActions, sessionActions, RosterOrderModel,
		OrderLayoutView, CartPageView, ChooseAddressView, AddAddressView, 
		OrderTimeView, ChoosePaymentView, AddCardView, SummaryView, CartLoader){
	var OrderController = Mn.Object.extend({
		initialize: function() {
			this.layout = new OrderLayoutView();
			this.renderOrder();
		},
		renderOrder: function(catalogsController, options) {
			var cartPage = new CartPageView(options);
			this.layout.showChildView('orderContainer', cartPage);
			this.listenTo(cartPage, 'order:proceed', this.onOrder.bind(this, options));
			//TODO not sure that it is good idea
			this.options = options;
			this.catalogsController = catalogsController;
			if (this.catalogsController) {
				this.catalogsController.hideBlinder(); //<-- TODO find better way
			}
		},
		showLoader: function() {
			var cartLoader = new CartLoader();
			this.layout.showChildView('cartLoader', cartLoader);
			this.layout.getRegion('cartLoader').$el.show();
		},
		hideLoader: function() {
			this.layout.getRegion('cartLoader').$el.hide();
		},
		onOrder: function(options) {
			options.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() : popupsController.requireLogIn(function() {
	        	//TODO get prices and address
	        	this.catalogsController.showBlinder();
	        	this.getAdditionalOrderInfo(options);
	        }.bind(this));
		},
		getAdditionalOrderInfo: function(options) {
			var sasl, 
				addresses, 
				fundsource;
			this.showLoader();
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
                    deliveryPickupOptions: options.deliveryPickupOptions,
                    promoUUID: options.promoUUID,
                    uuid: options.uuid
            	};
                //var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + basketType);
                var orderModel = new RosterOrderModel({}, modelOptions);
                this.showChooseAddress(orderModel);
            }.bind(this));
		},
		//choose address part
		showChooseAddress: function(model) {
			var chooseAddress = new ChooseAddressView({
                	model: model
                });
			this.hideLoader();
            this.layout.showChildView('orderContainer', chooseAddress);
            this.listenTo(chooseAddress, 'onNextStep', this.onChooseAddressNext.bind(this, model));
            this.listenTo(chooseAddress, 'onBackStep', this.onChooseAddressBack.bind(this, model));
		},
		onChooseAddressNext: function(model, address, active) {
			console.log(address);
			if (address === 'saved' || active === 'pick_up') {
				if (this.checkIfOrderTime(model)) {
					this.showOrderTime(model);
				} else {
					this.showChoosePayment(model);
				}
			} else {
				this.showAddAddress(model);
			}
		},
		onChooseAddressBack: function(model) {
			console.log('back');
			this.renderOrder(this.catalogsController, this.options); //???
		},
		//add address part
		showAddAddress: function(model) {
			var addAddress = new AddAddressView({
                	model: model
                });
            this.layout.showChildView('orderContainer', addAddress);
            this.listenTo(addAddress, 'onNextStep', this.onAddAddressNext.bind(this, model));
            this.listenTo(addAddress, 'onBackStep', this.onAddAddressBack.bind(this, model));
		},
		onAddAddressNext: function(model) {
			if (this.checkIfOrderTime(model)) {
				this.showOrderTime(model);
			} else {
				this.showChoosePayment(model);
			}
		},
		onAddAddressBack: function(model) {
			this.showChooseAddress(model);
		},
		//order time part
		checkIfOrderTime: function(model) {
			var deliveryPickupOptions = model.additionalParams.deliveryPickupOptions;

			return deliveryPickupOptions && 
				   deliveryPickupOptions.options && 
				   deliveryPickupOptions.options.length > 0;
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
			this.showChooseAddress(model);
		},
		//choose payment part
		showChoosePayment: function(model) {
			var choosePayment = new ChoosePaymentView({
                	model: model
                });
            this.layout.showChildView('orderContainer', choosePayment);
            this.listenTo(choosePayment, 'onNextStep', this.onChoosePaymentNext.bind(this, model));
            this.listenTo(choosePayment, 'onBackStep', this.onChoosePaymentBack.bind(this, model));
		},
		onChoosePaymentNext: function(model, card, active) {
			if (active === 'cash') {
				this.onPlaceOrder(model);
			} else {
				if (card === 'saved') {
					this.showSummary(model);
				} else {
					this.showAddCard(model);
				}
			}
		},
		onChoosePaymentBack: function(model) {
			if (this.checkIfOrderTime(model)) {
				this.showOrderTime(model);
			} else {
				this.showChooseAddress(model);
			}
		},
		//add card part
		showAddCard: function(model) {
			var addCard = new AddCardView({
                	model: model
                });
            this.layout.showChildView('orderContainer', addCard);
            this.listenTo(addCard, 'onNextStep', this.onAddCardNext.bind(this, model));
            this.listenTo(addCard, 'onBackStep', this.onAddCardBack.bind(this, model));
		},
		onAddCardNext: function(model) {
			this.showSummary(model);
		},
		onAddCardBack: function(model) {
			this.showChoosePayment(model);
		},
		//summary part
		showSummary: function(model) {
			var summary = new SummaryView({
                	model: model
                });
            this.layout.showChildView('orderContainer', summary);
            this.listenTo(summary, 'onNextStep', this.onSummaryNext.bind(this, model));
            this.listenTo(summary, 'onBackStep', this.onSummaryBack.bind(this, model));
		},
		onSummaryNext: function(model) {
			this.onPlaceOrder(model);
		},
		onSummaryBack: function(model) {
			this.showChoosePayment(model);
		},
		//.......
		onPlaceOrder: function(model) {
			console.log('place order');
			console.log(model.toJSON());
			this.showLoader();
	        popupsController.showMessage({
	        	message:'placing your order',
	        	loader: true,
	        	infinite: true
	        });

	        if (this.options.singlePromotion) {
	        	this.placeSingleOrder(model);
	        } else {
	        	this.placeRegularOrder(model);
	        }
		},

		placeRegularOrder: function(model) {
			var params = model.additionalParams;
			return orderActions.placeOrder(
	            params.sasl.sa(),
	            params.sasl.sl(),
	            model.toJSON()
	        ).then(function(e) {
	            params.basket.reset();
	            this.hideLoader();
	            popupsController.showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            popupsController.showMessage({
	            	message: text,
	            	loader: true
	            });
	        }.bind(this));
		},

		placeSingleOrder: function(model) {
			var params = model.additionalParams,
	            items = model.get('items');

	        model.set({
	            itemUUID: model.additionalParams.itemUUID,
	            quantity: model.get('items')[0].quantity
	        });
	        model.unset('items');
	        model.unset('comment');//temporary
	        return orderActions.placePromoSingletonOrder(
	            params.sasl.sa(),
	            params.sasl.sl(),
	            model.toJSON()
	        ).then(function() {
	            params.basket.reset();
	            this.hideLoader();
	            popupsController.showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            popupsController.showMessage({
	            	message: text,
	            	loader: true
	            });
	        });
		},

		onPlaceSingletonOrder: function() {
	        var params = this.model.additionalParams,
	            items = this.model.get('items'),
	            request;

	        if (!items) {
	            popupController.textPopup({
	                text: 'Can\'t place order.'
	            });
	            return;
	        }
	        loader.show('placing your order');
	        this.model.set({
	            itemUUID: this.model.additionalParams.itemUUID,
	            quantity: this.model.get('items')[0].quantity,
	            tipAmount: this.tipSum
	        });
	        this.model.unset('items');
	        request = params.type === 'PROMO'? orderActions.placePromoSingletonOrder :
	            orderActions.placeEventSingletonOrder
	        return request(
	            params.sasl.sa(),
	            params.sasl.sl(),
	            this.model.toJSON()
	        ).then(function() {
	            loader.hide();
	            appCache.set('promoCode', null);
	            appCache.set('updateDiscount', true);
	            var callback = _.bind(this.triggerSingletonView, this);
	            popupController.textPopup({
	                text: 'order placed'
	            }, callback);
	        }.bind(this), function(e) {
	            loader.hide();
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            popupController.textPopup({
	                text: text
	            });
	        });
	    },

		afterOrder: function() {
			//TODO return to catalog
			this.renderOrder(this.catalogsController, this.options); //???
		},

		// onPlaceMultipleOrder: function() {
	 //        var params = this.model.additionalParams;
	 //        loader.show('placing your order');

	 //        this.model.set({
	 //            tipAmount: this.tipSum
	 //        });

	 //        return orderActions.placeOrder(
	 //            params.sasl.sa(),
	 //            params.sasl.sl(),
	 //            this.model.toJSON()
	 //        ).then(function(e) {
	 //            loader.hide();
	 //            params.basket.reset();
	 //            params.basket.versions = undefined;
	 //            params.backToRoster = false;
	 //            appCache.set('promoCode', null);
	 //            appCache.set('updateDiscount', true);
	 //            var callback;
	 //            if (params.backToCatalog) {
	 //                callback = _.bind(this.triggerCatalogView, this);
	 //            } else {
	 //                callback = _.bind(this.triggerRosterView, this);
	 //            }
	 //            popupController.textPopup({
	 //                text: 'order placed'
	 //            }, callback);
	 //        }.bind(this), function(e) {
	 //            loader.hide();
	 //            var text = h().getErrorMessage(e, 'Error placing your order');
	 //            popupController.textPopup({
	 //                text: text
	 //            });
	 //        }.bind(this));
	 //    },

		showNoItemsPopup: function() {
			console.log('no items selected');
			popupsController.showMessage({
				message: 'no items selected',
				confirm: 'ok'
			});
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