'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/globalHelpers',
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
	], function(appCache, h, orderActions, saslActions, sessionActions, RosterOrderModel,
		OrderLayoutView, CartPageView, ChooseAddressView, AddAddressView, 
		OrderTimeView, ChoosePaymentView, AddCardView, SummaryView, CartLoader){
	var OrderController = Mn.Object.extend({
		initialize: function() {
			this.layout = new OrderLayoutView();

			$(window).on("resize", this.resizeWindow.bind(this));
		},
		resizeWindow: function() {
			var currentView = this.layout.getRegion('orderContainer').currentView;
			if (currentView) {
				currentView.triggerMethod('windowResize');
			}
		},
		renderOrder: function(options, changed) {
			var cartPage = new CartPageView(options, changed);
			this.layout.showChildView('orderContainer', cartPage);
			this.listenTo(cartPage, 'order:proceed', this.onOrder.bind(this, options));
			this.options = options;
			this.dispatcher.getCatalogsController().hideBlinder();
			appCache.set('orderInProcess', false);
		},
		showLoader: function() {
			var cartLoader = new CartLoader();
			this.layout.showChildView('cartLoader', cartLoader);
			this.layout.getRegion('cartLoader').$el.show();
		},
		hideLoader: function() {
			this.layout.getRegion('cartLoader').$el.hide();
		},
		onLoginStatusChanged: function() {
			var user = appCache.get('user'),
				uuid = user ? user.getUID() : null,
				order = appCache.get('orderInProcess');
			if (order && !uuid) {
				var basket = appCache.get('basket');
				if (basket) basket.reset();
			}
		},
		onOrder: function(options) {
			options.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() : this.dispatcher.getPopupsController().requireLogIn(function() {
	        	this.dispatcher.getCatalogsController().showBlinder();
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
                    promoCode: appCache.get('promoCode') || null,
                    promoUUID: options.promoUUID,
                    uuid: options.uuid
            	};
                //var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + basketType);
                var orderModel = new RosterOrderModel({}, modelOptions);
                appCache.set('basket', options.basket);
                this.showChooseAddress(orderModel);
                appCache.set('orderInProcess', true);
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
			this.renderOrder(this.options);
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
		//on discount selected
		onDiscountSelected: function() {
			var currentView = this.layout.getRegion('orderContainer').currentView;
			if (currentView) {
				this.validatePromoCode(currentView.model)
					.then(function(promoCode){
						currentView.triggerMethod('discountUpdate', promoCode); 
					}.bind(this));
			}
		},
		//dererred rejecter for promise
		rejecter: function(def) {
			setTimeout(function(){
				def.reject(null);
			}, 0)
			return def;
		},
		//validate promo code
		validatePromoCode: function (model, code) {
	        var params = model.additionalParams,
	            promoCode = params.promoCode || appCache.get('promoCode') || code,
	            def = $.Deferred();
	        if (model.additionalParams.promoCodeActive) return this.rejecter(def);
	        model.additionalParams.promoCode = promoCode;
	        if (!promoCode) return this.rejecter(def);
	        this.showLoader();
			orderActions.validatePromoCode(params.sasl.sa(), params.sasl.sl(), promoCode)
	            .then(_.bind(function(resp) {
	            	this.hideLoader();
	                model.additionalParams.discount = resp.discount;
	                model.additionalParams.discountType = resp.discountType;
	                model.additionalParams.maximumDiscount = resp.maximumDiscount;
	                model.additionalParams.minimumPurchase = resp.minimumPurchase || 0;
	                model.additionalParams.promoCodeActive = true;
	                model.set({'promoCode': promoCode}, {silent: true});
	                this.dispatcher.getLandingController().onDiscountUsed();
	                def.resolve(promoCode);
	            }, this), function(jqXHR) {
	            	this.hideLoader();
	                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
	                model.additionalParams.promoCode = null;
	                this.dispatcher.getPopupsController().showMessage({
	                	message: text,
						confirm: 'ok'
	                });
	                def.reject(jqXHR);
	            }.bind(this));
	        return def;
		},
		//choose payment part
		showChoosePayment: function(model) {
			this.validatePromoCode(model).always(function(code){
				var choosePayment = new ChoosePaymentView({
	                	model: model
	                });
				choosePayment.dispatcher = this.dispatcher;
	            this.layout.showChildView('orderContainer', choosePayment);
	            this.listenTo(choosePayment, 'onNextStep', this.onChoosePaymentNext.bind(this, model));
	            this.listenTo(choosePayment, 'onBackStep', this.onChoosePaymentBack.bind(this, model));
				this.listenTo(choosePayment, 'onValidatePromoCode', this.validatePromoCode.bind(this, model));
			}.bind(this));
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
			this.validatePromoCode(model).always(function(resp){
				var summary = new SummaryView({
	                	model: model
	                });
				summary.dispatcher = this.dispatcher;
	            this.layout.showChildView('orderContainer', summary);
	            this.listenTo(summary, 'onNextStep', this.onSummaryNext.bind(this, model));
	            this.listenTo(summary, 'onBackStep', this.onSummaryBack.bind(this, model));
	            this.listenTo(choosePayment, 'onValidatePromoCode', this.validatePromoCode.bind(this, model));
			}.bind(this));
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
	        this.dispatcher.getPopupsController().showMessage({
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
	            this.dispatcher.getPopupsController().showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.dispatcher.getPopupsController().showMessage({
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
	        return orderActions.placePromoSingletonOrder(
	            params.sasl.sa(),
	            params.sasl.sl(),
	            model.toJSON()
	        ).then(function() {
	            params.basket.reset();
	            this.hideLoader();
	            this.dispatcher.getPopupsController().showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.dispatcher.getPopupsController().showMessage({
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
	            this.dispatcher.getPopupsController().textPopup({
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
	            this.dispatcher.getPopupsController().textPopup({
	                text: 'order placed'
	            }, callback);
	        }.bind(this), function(e) {
	            loader.hide();
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.dispatcher.getPopupsController().textPopup({
	                text: text
	            });
	        });
	    },

		afterOrder: function() {
			//TODO return to catalog
			this.renderOrder(this.options);
		},

		showNoItemsPopup: function() {
			console.log('no items selected');
			this.dispatcher.getPopupsController().showMessage({
				message: 'no items selected',
				confirm: 'ok'
			});
		},

		triggerOrder: function() {
	        this.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() :
	        this.dispatcher.getPopupsController().requireLogIn(this.sasl, function() {
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
	return OrderController;
});