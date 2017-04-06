'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    './order-controller',
    './popups-controller',
    '../views/catalogsLayout',
    '../views/catalogs',
    '../views/singleCatalog',
    '../views/itemPromotion',
    '../../scripts/models/CatalogBasketModel.js',
    '../views/blinderView'
	], function(appCache, saslActions, catalogActions, sessionActions, orderController, popupsController, 
		CatalogsLayoutView, CatalogsView, SingleCatalogView, ItemPromotionView, CatalogBasketModel,
		BlinderView){
	var CatalogsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new CatalogsLayoutView();
		},
		manageCatalog: function() {
			var saslData = appCache.get('saslData');
	        if (saslData) {
	            switch (saslData.retailViewType) {
	                case 'ROSTER':
	                    this.showRosterView(saslData);
	                    break;
	                case 'CATALOGS':
	                    this.showCatalogsView(saslData);
	                    break;
	                case 'CATALOG':
	                    this.showSingleCatalog(saslData);
	                    break;
	            default:
	            }
	        }
		},

		showRosterView: function(saslData) {

		},

		showCatalogsView: function(saslData) {
			var sasl,
	            id = [saslData.serviceAccommodatorId, saslData.serviceLocationId];
	        return saslActions.getSasl({id: id})
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getCatalogs(sasl.sa(), sasl.sl());
	            }.bind(this)).then(function(options) {
	            		var catalogsCollection = new Backbone.Collection(options.collection);
	            		var catalogsView = new CatalogsView({
	                        catalogsCollection: catalogsCollection
	                    });
	            		this.layout.showChildView('catalogsContainer', catalogsView);
	            		this.layout.listenTo(catalogsView, 'catalog:selected', this.onCatalogSelected.bind(this));
	            }.bind(this));
		},

		onCatalogSelected: function(catalogId) {
			var saslData = appCache.get('saslData');
			this.showSingleCatalog(saslData, catalogId);
		},

		showSingleCatalog: function(saslData, catalogId) {
			var sasl,
	            id = [saslData.serviceAccommodatorId, saslData.serviceLocationId];
			return saslActions.getSasl(id)
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getCatalog(sasl.sa(), sasl.sl(), catalogId);
	            }.bind(this)).then(function(catalog) {
	                var isOpen = catalog.data.isOpen,
	                    isOpenWarningMessage = catalog.data.isOpenWarningMessage;
	                var catalogDetails = {
	                    catalogUUID: catalog.data.catalogId,
	                    catalogDisplayText: catalog.data.displayText,
	                    catalogType: catalog.data.catalogType.enumText
	                };
	                
                    var basket = new CatalogBasketModel();
                    basket.setCatalogDetails(catalogDetails);
                    appCache.set(sasl.sa() + ':' + sasl.sl() + ':' + catalog.data.catalogId + ':catalogbasket', basket);
                    // appCache.set('basket', basket);
	         
	                basket.each(function(item, index, list) {
	                    var quantity = item.get('quantity');
	                    var itemName = item.itemName;
	                    var group = item.groupId;
	                    console.log("retrieved catalog from cache ### " + itemName + ":[" + quantity + "] from Group:" + group);
	                });

	                basket.off('add remove change reset');
	                basket.on('add remove change reset', this.onBasketChange.bind(this, {
	                	basket: basket, 
	                	sasl: sasl,
	                	catalogId: catalogId,
	                	deliveryPickupOptions: catalog.data.deliveryPickupOptions
	                }));

	                this.basket = basket; //not sure that it is good solution ???

	                var singleCatalogView = new SingleCatalogView({
	                        sasl: sasl,
		                    catalog: catalog,
		                    user: sessionActions.getCurrentUser(),
		                    url: this.getUrl(sasl) + '/catalog',
		                    basket: basket,
		                    catalogId: catalogId,
		                    isOpen: isOpen,
		                    isOpenWarningMessage: isOpenWarningMessage
		                });
		            	this.layout.showChildView('catalogsContainer', singleCatalogView);
		            	this.listenTo(singleCatalogView, 'backToCatalog' , this.onBackToCatalogs.bind(this));
	            }.bind(this));
		},

		onBasketChange: function(options) {
			orderController.renderOrder(this, options);
		},

		showBlinder: function() {
			var blinderView = new BlinderView();
			this.layout.showChildView('blinder', blinderView);
			this.layout.getRegion('blinder').$el.show();
		},

		hideBlinder: function() {
			this.layout.getRegion('blinder').$el.hide();
		},

		onBackToCatalogs: function() {
			if (this.basket.length > 0) {
				popupsController.showMessage({
					message: 'Are you sure?<br> Your order will be lost.',
					confirm: 'confirm',
					callback: this.confirmedBackToCatalogs.bind(this)
				});
			} else {
				this.confirmedBackToCatalogs();
			}
		},

		confirmedBackToCatalogs: function () {
			this.basket.reset();
			this.manageCatalog();
		},

		getUrl: function(sasl) {

		    var url = sasl.getFriendlyUrlKey();

		    if (!url) {
		        console.error('urlKey could not be found');
		    }

		    return url;
		},

		onPromotionSelected: function(options) {
			if (this.basket.length > 0) {
				popupsController.showMessage({
					message: 'Are you sure?<br> Your order will be lost.',
					confirm: 'confirm',
					callback: this.confirmedPromotion.bind(this, options)
				});
			} else {
				this.confirmedPromotion(options);
			}
		},

		confirmedPromotion: function(options) {
			this.basket.reset();
			this.singleItemPromotion(options);
		},

		singleItemPromotion: function(options) {
			var sasl;
			return saslActions.getSasl()
	        .then(function(ret) {
	            sasl = ret;
	            return catalogActions.getItemDetailsForPromoItem(options.uuid);
	        }).then(function(item) {
	        	var basket = new CatalogBasketModel();

	            basket.off('add remove change reset');
                basket.on('add remove change reset', this.onBasketChange.bind(this, {
                	basket: basket, 
                	sasl: sasl,
                	catalogId: null,
                	deliveryPickupOptions: null
                }));

                basket.addItem(new Backbone.Model(item), 1);

                this.basket = basket; //not sure that it is good solution ???

                var itemPromotionView = new ItemPromotionView({
                        promoUUID: options.uuid,
		                uuid: item.uuid,
		                sasl: sasl,
		                basket: basket,
		                item: item
	                });
            	this.layout.showChildView('catalogsContainer', itemPromotionView);
            	this.listenTo(itemPromotionView, 'backToCatalog' , this.onBackToCatalogs.bind(this)); //todo
	        }.bind(this));
		},

		// singleton: function(options) {
	 //        var sasl,
	 //            discount = options.discount || null,
	 //            discountType = options.discountType || '',
	 //            promoCode = options.promoCode || null,
	 //            backToRoster = options.backToRoster,
	 //            backToCatalog = options.backToCatalog,
	 //            backToCatalogs = options.backToCatalogs,
	 //            backToSingleton = options.backToSingleton,
	 //            singletonItem = {
	 //                uuid: options.uuid || null,
	 //                type: options.type || null
	 //            };
	 //        singletonItem = appCache.fetch('singletonItem', singletonItem);
	 //        var uuid = singletonItem.uuid,
	 //            type = singletonItem.type;
	 //        return saslActions.getSasl()
	 //        .then(function(ret) {
	 //            sasl = ret;
	 //            return type === 'PROMO'? catalogActions.getItemDetailsForPromoItem(uuid) :
	 //                catalogActions.getEventDetails(uuid);
	 //        }).then(function(item) {
	 //            var basket = new CatalogBasketModel(),
	 //            // Should we have isOpen and isOpenWarningMessage in response?
	 //                isOpen = true,
	 //                isOpenWarningMessage = 'message';
	 //            basket.addItem(new Backbone.Model(item), 1);
	 //            if (backToSingleton) {
	 //                basket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + item.uuid + ':catalogbasket', basket);
	 //            } else {
	 //                appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + item.uuid + ':catalogbasket', basket);
	 //            }
	 //            return {
	 //                promoCode: promoCode,
	 //                promoUUID:uuid,
	 //                type: type,
	 //                uuid: item.uuid,
	 //                sasl: sasl,
	 //                basket: basket,
	 //                backToRoster: backToRoster,
	 //                backToCatalog: backToCatalog,
	 //                backToCatalogs: backToCatalogs,
	 //                backToSingleton: true,
	 //                item: item,
	 //                isOpen: isOpen,
	 //                isOpenWarningMessage: isOpenWarningMessage
	 //            }
	 //        });
	 //    },

	    // catalog: function(options) { // options is an array with either sasl or
	    //     var sasl;
	    //     var rosterBasket = options.rosterBasket || false;
	    //     var catalogId = options.catalogId;
	    //     var backToRoster = options.backToRoster;
	    //     var rosterId = options.rosterId;
	    //     var backToCatalogs = options.backToCatalogs;
	    //     var backToCatalog = options.backToCatalog;
	    //     var catalogId = options.catalogId;
	    //     var navbarView = options.navbarView;
	    //     var launchedViaURL = options.launchedViaURL;
	    //     return saslActions.getSasl(options.id)
	    //         .then(function(ret) {
	    //             sasl = ret;
	    //             return catalogActions.getCatalog(sasl.sa(), sasl.sl(), catalogId);
	    //         }).then(function(catalog) {
	    //             /*
	    //              * check if we are going back to catalogs. If yes, pull up old
	    //              * catalog, else create new.
	    //              */

	    //             var basket,
	    //                 isOpen = catalog.data.isOpen,
	    //                 isOpenWarningMessage = catalog.data.isOpenWarningMessage;
	    //             var catalogDetails = {
	    //                 catalogUUID: catalog.data.catalogId,
	    //                 catalogDisplayText: catalog.data.displayText,
	    //                 catalogType: catalog.data.catalogType.enumText
	    //             };
	    //             var basket;
	    //             if (backToCatalog === true) {
	    //                 basket = new CatalogBasketModel();
	    //                 basket.setCatalogDetails(catalogDetails);
	    //                 basket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + catalog.data.catalogId + ':catalogbasket', basket);
	    //             } else {
	    //                 var basket = new CatalogBasketModel();
	    //                 basket.setCatalogDetails(catalogDetails);
	    //                 appCache.set(sasl.sa() + ':' + sasl.sl() + ':' + catalog.data.catalogId + ':catalogbasket', basket);
	    //             }
	    //             basket.each(function(item, index, list) {
	    //                 var quantity = item.get('quantity');
	    //                 var itemName = item.itemName;
	    //                 var group = item.groupId;
	    //                 console.log("retrieved catalog from cache ### " + itemName + ":[" + quantity + "] from Group:" + group);
	    //             });
	    //             if (catalogId === 'SIDES' && rosterBasket) {
	    //                 basket = rosterBasket;
	    //             }

	    //             return {
	    //                 sasl: sasl,
	    //                 catalog: catalog,
	    //                 user: sessionActions.getCurrentUser(),
	    //                 url: getUrl(sasl) + '/catalog',
	    //                 rosterId: rosterId,
	    //                 backToRoster: backToRoster,
	    //                 basket: basket,
	    //                 rosterBasket: rosterBasket, // catalogActions.getBasket(sasl.sa(),
	    //                 // sasl.sl()),
	    //                 backToCatalogs: backToCatalogs,
	    //                 catalogId: catalogId,
	    //                 navbarView: navbarView,
	    //                 launchedViaURL :launchedViaURL,
	    //                 isOpen: isOpen,
	    //                 isOpenWarningMessage: isOpenWarningMessage
	    //             };
	    //         });
	    // },
	});
	return new CatalogsController();
});