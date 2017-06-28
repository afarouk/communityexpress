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
		},
		onLayoutReady: function() {
			var scrollTimeout;
			$(window).on("resize", this.resizeWindow.bind(this));
			$(window).on("scroll", function(){
				if (scrollTimeout) {
					clearTimeout(scrollTimeout);
				}
				scrollTimeout = setTimeout(this.moveCart.bind(this), 600)
			}.bind(this));
			this.layoutTop = this.layout.$el.offset().top;
			this.moveCart();
		},
		resizeWindow: function() {
			this.getRegionView('orderContainer', function(view) {
				view.triggerMethod('windowResize');
			});
		},
		isActionOnBottom: function() {
			var view = this.layout.getRegion('orderContainer').currentView,
				name = view.name;
			return name === 'shopping_cart' || 
				   (name === 'order_payment' && view.model.get('cashSelected')) ||
				   name === 'order_summary';
		},
		moveCart: function() {
			var isActionOnBottom = this.isActionOnBottom(),
				scroll = $(window).scrollTop(),
				windowHeight = $(window).height(),
				indent = scroll - this.layoutTop,
				$parent = this.layout.$el.parent(),
				height = this.layout.$el.height(),
				parentHeight,
				$container = $('.grid'),
				containerHeight = $container.parent().height(),
				containerPaddings = parseInt($container.css('padding')) * 2;

			if (indent < 0) {
				indent = 0;
			}
			parentHeight = $parent.height();
			if( parentHeight + indent >=  containerHeight - containerPaddings) {
				$parent.height(height + 'px');

				if (parentHeight == containerHeight - containerPaddings) {
					this.layout.$el.css('top', '0px');
				} else {
					var allowedIndent = containerHeight - height - containerPaddings;
					if (isActionOnBottom && windowHeight < height) {
						indent = indent - (height - windowHeight);
						indent = indent > 0 ? indent : 0;
					} 
					if (allowedIndent < indent) indent = allowedIndent;
					this.layout.$el.css('top', indent + 'px');
				}
			} else {
				if (isActionOnBottom) {
					if (windowHeight < height) {
						indent = indent - (height - windowHeight);
						indent = indent > 0 ? indent : 0;
					}
				}
				// debugger;
				$parent.height(height + indent + 'px');
				this.layout.$el.css('top', indent + 'px');
			}

		},
		renderOrder: function(options, changed) {
			var cartPage = new CartPageView(options, changed);
			this.layout.showChildView('orderContainer', cartPage);
			this.listenTo(cartPage, 'order:proceed', this.onOrder.bind(this, options));
			this.options = options;
			this.dispatcher.get('catalogs').hideBlinder();
			appCache.set('orderInProcess', false);
			this.moveCart();
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
	        this.showNoItemsPopup() : this.dispatcher.get('popups').requireLogIn(function() {
	        	this.dispatcher.get('catalogs').showBlinder();
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
            this.moveCart();
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
			this.getRegionView('orderContainer', function(view) {
				if (view.model) {
					this.validatePromoCode(view.model)
						.then(function(promoCode){
							view.triggerMethod('discountUpdate', promoCode); 
						}.bind(this));
				}
			}.bind(this));
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
	                this.dispatcher.get('landing').onDiscountUsed();
	                def.resolve(promoCode);
	            }, this), function(jqXHR) {
	            	this.hideLoader();
	                var text = h().getErrorMessage(jqXHR, 'can\'t get discount');
	                model.additionalParams.promoCode = null;
	                this.dispatcher.get('popups').showMessage({
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
	            this.listenTo(summary, 'onValidatePromoCode', this.validatePromoCode.bind(this, model));
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
	        this.dispatcher.get('popups').showMessage({
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
	            this.dispatcher.get('popups').showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.hideLoader();
	            this.dispatcher.get('popups').showMessage({
	            	message: text,
	            	confirm: 'ok'
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
	            this.dispatcher.get('popups').showMessage({
	            	message: 'order placed',
	            	confirm: 'ok',
	            	callback: this.afterOrder.bind(this, model)
	            });
	        }.bind(this), function(e) {
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.dispatcher.get('popups').showMessage({
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
	            this.dispatcher.get('popups').textPopup({
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
	            this.dispatcher.get('popups').textPopup({
	                text: 'order placed'
	            }, callback);
	        }.bind(this), function(e) {
	            loader.hide();
	            var text = h().getErrorMessage(e, 'Error placing your order');
	            this.dispatcher.get('popups').textPopup({
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
			this.dispatcher.get('popups').showMessage({
				message: 'no items selected',
				confirm: 'ok'
			});
		},

		triggerOrder: function() {
	        this.basket.getItemsNumber() === 0 ?
	        this.showNoItemsPopup() :
	        this.dispatcher.get('popups').requireLogIn(this.sasl, function() {
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