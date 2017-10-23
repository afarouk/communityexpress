'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    '../views/catalogsLayout',
    '../views/catalogs',
    '../views/singleCatalog',
    '../views/ItemPromotion',
    '../../scripts/models/CatalogBasketModel.js',
    '../views/blinderView'
	], function(appCache, saslActions, catalogActions, sessionActions,
		CatalogsLayoutView, CatalogsView, SingleCatalogView, ItemPromotionView, CatalogBasketModel,
		BlinderView){
	var CatalogsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new CatalogsLayoutView();
			this.basket = null;
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
	                case 'MEDICAL':
	                    debugger;
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
	            		if (catalogsCollection.length > 1) {
		            		var catalogsView = new CatalogsView({
		                        catalogsCollection: catalogsCollection
		                    });
		            		this.layout.showChildView('catalogsContainer', catalogsView);
		            		this.layout.listenTo(catalogsView, 'catalog:selected', this.onCatalogSelected.bind(this));
		            	} else {
		            		var catalog = catalogsCollection.at(0);
		            		this.showSingleCatalog(sasl, catalog.get('id'));
		            	}
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

		onBasketChange: function(options, model, temp, changed) {
			var changes = 'quantity';
			if (changed) {
				if (changed.add) {
					changes = 'add';
				} else {
					changes = 'remove';
				}
			}
			this.dispatcher.get('order').renderOrder(options, changes);

			//basket reset
			// if ((temp.previousModels && temp.previousModels.length > 0) && options.basket.length === 0) {}
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
			if (this.basket && this.basket.length > 0) {
				this.dispatcher.get('popups').showMessage({
					message: 'Are you sure?<br> Your order will be lost.',
					confirm: 'confirm',
					callback: this.confirmedBackToCatalogs.bind(this)
				});
			} else {
				this.confirmedBackToCatalogs();
			}
		},

		confirmedBackToCatalogs: function () {
			if (this.basket) this.basket.reset();
			this.manageCatalog();
			this.dispatcher.get('landing').onPromotionUnselected();
		},

		getUrl: function(sasl) {

		    var url = sasl.getFriendlyUrlKey();

		    if (!url) {
		        console.error('urlKey could not be found');
		    }

		    return url;
		},

		onPromotionSelected: function(options) {
			if (this.basket && this.basket.length > 0) {
				this.dispatcher.get('popups').showMessage({
					message: 'Are you sure?<br> Your order will be lost.',
					confirm: 'confirm',
					callback: this.confirmedPromotion.bind(this, options)
				});
			} else {
				this.confirmedPromotion(options);
			}
		},

		confirmedPromotion: function(options) {
			if (this.basket) this.basket.reset();
			this.dispatcher.get('landing').onPromotionSelectedConfirmed();
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
                	deliveryPickupOptions: null,
                	singlePromotion: true,
                	promoUUID: options.uuid,
                	uuid: item.uuid
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
		}
	});
	return CatalogsController;
});