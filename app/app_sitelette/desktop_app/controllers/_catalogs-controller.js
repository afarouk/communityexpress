'use strict';

define([
	'../../scripts/appCache',
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    '../../scripts/actions/orderActions',
    '../views/catalogsLayout',
    '../views/catalogs',
    '../views/singleCatalog',
    '../views/ItemPromotion',
    '../../scripts/models/CatalogBasketModel.js',
    '../views/blinderView'
	], function(appCache, saslActions, catalogActions, sessionActions, orderActions,
		CatalogsLayoutView, CatalogsView, SingleCatalogView, ItemPromotionView, CatalogBasketModel,
		BlinderView){
	var CatalogsController = Mn.Object.extend({
		initialize: function() {
			this.layout = new CatalogsLayoutView();
			this.basket = null;
		},
		manageCatalog: function() {
			if (window.community.type === 'i') return;
			var saslData = appCache.get('saslData');
	        if (saslData) {
	            switch (saslData.retailViewType) {
	                case 'CATALOGS':
	                    this.showCatalogsView(saslData);
	                    break;
	                case 'CATALOG':
	                    this.showSingleCatalog(saslData);
	                    break;
	            	default:
	            		break;
	            }
	        }
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

		getCatalogForReorder: function(options) {
			var sasl,
	            id = [saslData.serviceAccommodatorId, saslData.serviceLocationId];
			return saslActions.getSasl(id)
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getCatalog(sasl.sa(), sasl.sl(), options.catalogId);
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
	                	catalogId: options.catalogId,
	                	deliveryPickupOptions: catalog.data.deliveryPickupOptions
	                }));

	                this.basket = basket; //not sure that it is good solution ???

	                var singleCatalogView = new SingleCatalogView({
	                        sasl: sasl,
		                    catalog: catalog,
		                    user: sessionActions.getCurrentUser(),
		                    url: this.getUrl(sasl) + '/catalog',
		                    basket: basket,
		                    catalogId: options.catalogId,
		                    isOpen: isOpen,
		                    isOpenWarningMessage: isOpenWarningMessage
		                });
	            	this.layout.showChildView('catalogsContainer', singleCatalogView);
	            	this.listenTo(singleCatalogView, 'backToCatalog' , this.onBackToCatalogs.bind(this));

	            	this.retrieveOrder(options, catalog);
	            }.bind(this));
		},

		retrieveOrder: function(options, catalog) {
			orderActions.retrieveOrderByUUID(options.orderUUID)
				.then(function(order) {
					this.addOrderItems(order, catalog);
					//trigger change without show add item change quantity animation
					this.basket.trigger('change', 'silent');
				}.bind(this));
		},

		addOrderItems: function(order, catalog) {
			var groups = catalog.collection.groups,
				unSubgroupedItems = [];
			_.each(groups, function(group){
				//prepare full items list from each group
				unSubgroupedItems = unSubgroupedItems.concat(group.unSubgroupedItems);
			});
			_.each(order.items, function(orderItem) {
				var item = orderItem.item,
					itemId = item.itemId,
					hasVersions = item.hasVersions,
					itemVersion = item.itemVersion,
					subItems = orderItem.subItems,
					itemInCatalog = _.findWhere(unSubgroupedItems, {itemId: itemId});
					//take order item and find it in catalog unsubgupped items list
				if (itemInCatalog) {
					var itemVersions = itemInCatalog.itemVersions,
						itemName = itemInCatalog.itemName,
						model;
					if (hasVersions && itemVersions) {
						var version = _.findWhere(itemVersions, {itemVersion:itemVersion});
						//check if order item is version
						if (version) {
							var preparedSubItems = [];
							version.isVersion = true;
							version.itemName = itemName;

							//check if we have subItems in version
							if (version.subItems && subItems && subItems.length > 0) {
								model = this.prepareModelWithCustomization(version, subItems);
							} else {
								//add version without customization
								model = new Backbone.Model(version);
							}
						}
					} else {
						if (itemInCatalog.subItems && subItems) {
							model = this.prepareModelWithCustomization(itemInCatalog, subItems);
						} else {
							model = new Backbone.Model(item);
						}
					}
					this.basket.addItem(model, orderItem.quantity , null, null, null, null, true);
				}
				
			}.bind(this));
		},

		prepareModelWithCustomization: function(item, subItems) {
			var preparedSubItems = [],
				subItemsList = {},
				subItemsInItem = item.subItems;
			//make more appropriate subItemIds and subSubItemIds data structure
			_.each(subItems, function(subItem){
				var subSubItems = subItem.subSubItems;
				_.each(subSubItems, function(subSubItem){
					var subItemId = subSubItem.subItemId,
						subSubItemId = subSubItem.subSubItemId;
					if (subItemsList[subItemId]) {
						subItemsList[subItemId].push(subSubItemId);
					} else {
						subItemsList[subItemId] = [subSubItemId];
					}
				});
			});
			//find subItems in version subItems list
			_.each(subItemsList, function(itemInList, itemInListId) {
				var itemSubItem = _.findWhere(subItemsInItem, {subItemId: +itemInListId});
				if (itemSubItem) {
					var prepared = {
						displayText: itemSubItem.displayText,
						selected: []
					};
					//prepare subItems list with appropriate for customization item in basket format
					_.each(itemInList, function(subSubItemIdInList){
						var preparedSubSudItem = _.findWhere(itemSubItem.subSubItems, {subSubItemId: subSubItemIdInList});
						if (preparedSubSudItem) {
							prepared.selected.push(preparedSubSudItem);
						}
					});
					preparedSubItems.push(prepared);
				}
			});
			//add item with subItems (customized)
			return this.getCustomizedModel(item, preparedSubItems);
		}, 

		getCustomizedModel: function(item, preparedSubItems) {
			console.log(item, preparedSubItems);
			var customizationNote = item.itemName,
				adjustedPrice = item.price;

			customizationNote += '[';
			_.each(preparedSubItems, function(subItem, sId) {
				var selected = subItem.selected,
					displayText = subItem.displayText;
				customizationNote += displayText + ':';
				customizationNote += _.reduce(selected, function(first, second){
					var first = first || '';
					return first + '+ ' + second.displayText + '(' + second.priceAdjustment.toFixed(2) + '),'; 
				}, 0);
				customizationNote = customizationNote.slice(0, -1);
				customizationNote += '; ';
				adjustedPrice += _.reduce(_.pluck(selected, 'priceAdjustment'), function(a, b) {return a+b;});
			});
			customizationNote = customizationNote.slice(0, -2);
			customizationNote += ']';
			var customizesModel = new Backbone.Model(item);
			customizesModel.set('customizationNote', customizationNote);
			customizesModel.set('wasCustomized', true);
			customizesModel.set('price', adjustedPrice);
			customizesModel.set('subItems', Object.assign({}, preparedSubItems)); // <= clone without reference
			return customizesModel;
		},

		onBasketChange: function(options, model, temp, changed) {
			var changes = model === 'silent' ? false : 'quantity';
			if (changed) {
				if (changed.add) {
					changes = 'add';
				} else {
					changes = 'remove';
				}
			}
			this.dispatcher.get('order').renderOrder(options, changes);
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