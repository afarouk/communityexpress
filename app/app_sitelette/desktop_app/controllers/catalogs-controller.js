'use strict';

define([
	'../../scripts/appCache',
 //    CatalogBasketItem = require('./models/CatalogBasketItem.js'),
 //    RosterBasketModel = require('./models/RosterBasketModel'), //
	'../../scripts/actions/saslActions',
    '../../scripts/actions/catalogActions',
    '../../scripts/actions/sessionActions',
    '../views/catalogsLayout',
    '../views/catalogs',
    '../views/singleCatalog',
    '../../scripts/models/CatalogBasketModel.js'
	], function(appCache, saslActions, catalogActions, sessionActions,
		CatalogsLayoutView, CatalogsView, SingleCatalogView, CatalogBasketModel){
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
	         
	                basket.each(function(item, index, list) {
	                    var quantity = item.get('quantity');
	                    var itemName = item.itemName;
	                    var group = item.groupId;
	                    console.log("retrieved catalog from cache ### " + itemName + ":[" + quantity + "] from Group:" + group);
	                });

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
		            	this.listenTo(singleCatalogView, 'backToCatalog' , this.onBackToCatalog.bind(this));
	            }.bind(this));
		},

		onBackToCatalog: function() {
			//TODO show confirm popup

			//temporary
			//TODO get catalogs from cache
			this.manageCatalog();
		},

		getUrl: function(sasl) {

		    var url = sasl.getFriendlyUrlKey();

		    if (!url) {
		        console.error('urlKey could not be found');
		    }

		    return url;
		},

		singleton: function(options) {
	        var sasl,
	            discount = options.discount || null,
	            discountType = options.discountType || '',
	            promoCode = options.promoCode || null,
	            backToRoster = options.backToRoster,
	            backToCatalog = options.backToCatalog,
	            backToCatalogs = options.backToCatalogs,
	            backToSingleton = options.backToSingleton,
	            singletonItem = {
	                uuid: options.uuid || null,
	                type: options.type || null
	            };
	        singletonItem = appCache.fetch('singletonItem', singletonItem);
	        var uuid = singletonItem.uuid,
	            type = singletonItem.type;
	        return saslActions.getSasl()
	        .then(function(ret) {
	            sasl = ret;
	            return type === 'PROMO'? catalogActions.getItemDetailsForPromoItem(uuid) :
	                catalogActions.getEventDetails(uuid);
	        }).then(function(item) {
	            var basket = new CatalogBasketModel(),
	            // Should we have isOpen and isOpenWarningMessage in response?
	                isOpen = true,
	                isOpenWarningMessage = 'message';
	            basket.addItem(new Backbone.Model(item), 1);
	            if (backToSingleton) {
	                basket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + item.uuid + ':catalogbasket', basket);
	            } else {
	                appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + item.uuid + ':catalogbasket', basket);
	            }
	            return {
	                promoCode: promoCode,
	                promoUUID:uuid,
	                type: type,
	                uuid: item.uuid,
	                sasl: sasl,
	                basket: basket,
	                backToRoster: backToRoster,
	                backToCatalog: backToCatalog,
	                backToCatalogs: backToCatalogs,
	                backToSingleton: true,
	                item: item,
	                isOpen: isOpen,
	                isOpenWarningMessage: isOpenWarningMessage
	            }
	        });
	    },

	    catalog: function(options) { // options is an array with either sasl or
	        var sasl;
	        var rosterBasket = options.rosterBasket || false;
	        var catalogId = options.catalogId;
	        var backToRoster = options.backToRoster;
	        var rosterId = options.rosterId;
	        var backToCatalogs = options.backToCatalogs;
	        var backToCatalog = options.backToCatalog;
	        var catalogId = options.catalogId;
	        var navbarView = options.navbarView;
	        var launchedViaURL = options.launchedViaURL;
	        return saslActions.getSasl(options.id)
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getCatalog(sasl.sa(), sasl.sl(), catalogId);
	            }).then(function(catalog) {
	                /*
	                 * check if we are going back to catalogs. If yes, pull up old
	                 * catalog, else create new.
	                 */

	                var basket,
	                    isOpen = catalog.data.isOpen,
	                    isOpenWarningMessage = catalog.data.isOpenWarningMessage;
	                var catalogDetails = {
	                    catalogUUID: catalog.data.catalogId,
	                    catalogDisplayText: catalog.data.displayText,
	                    catalogType: catalog.data.catalogType.enumText
	                };
	                var basket;
	                if (backToCatalog === true) {
	                    basket = new CatalogBasketModel();
	                    basket.setCatalogDetails(catalogDetails);
	                    basket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + catalog.data.catalogId + ':catalogbasket', basket);
	                } else {
	                    var basket = new CatalogBasketModel();
	                    basket.setCatalogDetails(catalogDetails);
	                    appCache.set(sasl.sa() + ':' + sasl.sl() + ':' + catalog.data.catalogId + ':catalogbasket', basket);
	                }
	                basket.each(function(item, index, list) {
	                    var quantity = item.get('quantity');
	                    var itemName = item.itemName;
	                    var group = item.groupId;
	                    console.log("retrieved catalog from cache ### " + itemName + ":[" + quantity + "] from Group:" + group);
	                });
	                if (catalogId === 'SIDES' && rosterBasket) {
	                    basket = rosterBasket;
	                }

	                return {
	                    sasl: sasl,
	                    catalog: catalog,
	                    user: sessionActions.getCurrentUser(),
	                    url: getUrl(sasl) + '/catalog',
	                    rosterId: rosterId,
	                    backToRoster: backToRoster,
	                    basket: basket,
	                    rosterBasket: rosterBasket, // catalogActions.getBasket(sasl.sa(),
	                    // sasl.sl()),
	                    backToCatalogs: backToCatalogs,
	                    catalogId: catalogId,
	                    navbarView: navbarView,
	                    launchedViaURL :launchedViaURL,
	                    isOpen: isOpen,
	                    isOpenWarningMessage: isOpenWarningMessage
	                };
	            });
	    },

	    catalogs: function(options) {
	        var sasl,
	            id = options.id;
	        return saslActions.getSasl(options)
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getCatalogs(sasl.sa(), sasl.sl());
	            }).then(function(options) {
	                    return {
	                        sasl: sasl,
	                        catalogs: options
	                    };
	            });
	    },
	    roster: function(options) {
	        var sasl;
	        var id = options.sasl;
	        var rosterId = options.id;
	        var roster;
	        var backToRoster = options.backToRoster;
	        var launchedViaURL = options.launchedViaURL;
	        var cloneCatalogAndAdd = options.cloneCatalogAndAdd;
	        var catalogId = options.catalogId;
	        var catalogType = options.catalogType;
	        var catalogDisplayText = options.catalogDisplayText;

	        return saslActions.getSasl(id)
	            .then(function(ret) {
	                sasl = ret;
	                return catalogActions.getRoster(sasl.sa(), sasl.sl(), rosterId);
	            }).then(_.bind(function(roster) {

	                var rosterBasket;
	                var rosterDetails = {
	                    rosterUUID: roster.data.rosterId,
	                    rosterDisplayText: roster.data.displayText,
	                    rosterType: roster.data.rosterType.enumText
	                }
	                if (backToRoster === true) {
	                    rosterBasket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + roster.data.rosterId + ':rosterbasket');
	                } else {
	                    rosterBasket = new RosterBasketModel();
	                    rosterBasket.setRosterDetails(rosterDetails);
	                    appCache.set(sasl.sa() + ':' + sasl.sl() + ':' + roster.data.rosterId + ':rosterbasket', rosterBasket);
	                }
	                /* if we are returning from a catalog to this view, AND user
	                   'added' and did not just hit back, then we have to clone the
	                    catalog in the appcache and add it to rosterbasket */
	                if (typeof cloneCatalogAndAdd !== 'undefined' && cloneCatalogAndAdd === true) {
	                    console.log("Must clone and add:" + cloneCatalogAndAdd + " " + catalogId);
	                    /*pull up catalog from appcache (it better be there!); */
	                    var catalog = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + catalogId + ':catalogbasket');

	                    var itemizedCatalogAlreadyAdded = false;
	                    _(rosterBasket.catalogs.models).each(function(model, index, list) {
	                        if (model.id === catalogId) {
	                            itemizedCatalogAlreadyAdded = true;
	                        }
	                    });
	                    if ((!itemizedCatalogAlreadyAdded) || catalogType === 'COMBO') {
	                        /*clone and push */
	                        var catalogClone = new CatalogBasketModel();
	                        catalog.each(function(catalogEntry) {
	                            catalogClone.add(new CatalogBasketItem(catalogEntry.toJSON()));
	                        });
	                        var catalogDetails = {
	                            catalogUUID: catalogId,
	                            catalogDisplayText: catalogDisplayText,
	                            catalogType: catalogType,
	                            price:catalog.price,
	                            quantity:1// can only add one at a time
	                        };
	                        catalogClone.setCatalogDetails(catalogDetails);

	                        //var catalogClone = $.extend({}, catalog);
	                        //var catalogClone = JSON.parse(JSON.stringify(catalog));
	                        this.checkCatalogsIdentity(catalogClone, rosterBasket);
	                    } else {
	                        console.log("Roster already has catalog: " + catalogId );
	                    }
	                } else if (typeof cloneCatalogAndAdd !== 'undefined' && cloneCatalogAndAdd === false){

	                  var itemizedCatalogAlreadyAdded = false;
	                  _(rosterBasket.catalogs.models).each(function(model, index, list) {
	                      if (model.id === catalogId) {
	                          itemizedCatalogAlreadyAdded = true;
	                      }
	                  });
	                  if ((!itemizedCatalogAlreadyAdded) && catalogType !== 'COMBO') {
	                    /* this is an itemized catalog and we have to add it once only */
	                      var catalog = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + catalogId + ':catalogbasket');
	                      rosterBasket.catalogs.models.push(catalog);
	                  }

	                }


	                return {
	                    sasl: sasl,
	                    roster: roster,
	                    user: sessionActions.getCurrentUser(),
	                    basket: rosterBasket,
	                    rosterId: roster.data.rosterId,
	                    rosterDisplayText: roster.data.displayText,
	                    rosterType: roster.data.rosterType.enumText,
	                    backToRoster: false,
	                    launchedViaURL: launchedViaURL,
	                    isOpen: roster.data.isOpen,
	                    isOpenWarningMessage: roster.data.isOpenWarningMessage
	                };

	            }, this));
	    },

	    // for equal 'build your combo'
	    checkCatalogsIdentity: function(catalogClone, basket) {
	        // TODO check why model order is different second time
	        var models = basket.catalogs.models,
	            ownCombos = _.where(models, {'id': 'BUILDYOURCOMBO'});
	        if (ownCombos.length > 0) {
	            if (_.filter(ownCombos, function(catalog){
	                if (_.every(catalog.models, function(model, index){
	                    return catalogClone.models[index].id === model.id;
	                })){
	                    catalog.quantity ++;
	                    return true;
	                }
	            }).length === 0) {
	                models.push(catalogClone);
	            }
	        } else {
	            models.push(catalogClone);
	        }
	    },
	});
	return new CatalogsController();
});