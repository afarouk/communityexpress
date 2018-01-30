 /*global define console*/

'use strict';

var Vent = require('./Vent'),
    appCache = require('./appCache.js'),
    CatalogBasketModel = require('./models/CatalogBasketModel.js'),
    CatalogBasketItem = require('./models/CatalogBasketItem.js'),
    RosterBasketModel = require('./models/RosterBasketModel'), //
    communicationActions = require('./actions/communicationActions'),
    filterActions = require('./actions/filterActions'),
    saslActions = require('./actions/saslActions'),
    sessionActions = require('./actions/sessionActions'),
    promotionActions = require('./actions/promotionActions'),
    mediaActions = require('./actions/mediaActions'),
    orderActions = require('./actions/orderActions'),
    galleryActions = require('./actions/galleryActions'),
    catalogActions = require('./actions/catalogActions'),
    contestActions = require('./actions/contestActions'),
    eventActions = require('./actions/eventActions'),
    vantivStyles = require('ejs!./templates/rosterOrder/vantivStyles.ejs'),
    ReviewsCollection = require('./collections/reviews');

var visited = {
    sasl: false,
};

var hasBeenVisited = function(page) {
    var beenVisited = visited[page];
    if (beenVisited) {
        return true;
    } else {
        visited[page] = true;
        return false;
    }
};

var getUrl = function(sasl) {

    var url = sasl.getFriendlyUrlKey();

    if (!url) {
        console.error('urlKey could not be found');
    }

    return url;
};

module.exports = {

    root: function() {
        return $.Deferred().resolve({
            url: ''
        }).promise();
    },

    restaurant: function(options, pid) { // options is an array with either
        // sasl or urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    model: response,
                    user: sessionActions.getCurrentUser(),
                    isFirstTime: !hasBeenVisited('sasl'),
                    url: getUrl(response),
                    pid: pid
                };
            }, function() {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    chat: function(options) { // options is an array with either sasl or
        // urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    restaurant: response,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(response) + '/chat'
                };
            }, function() {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    reviews: function(options) { // options is an array with either sasl or
        // urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    collection: new ReviewsCollection(),
                    restaurant: response,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(response) + '/reviews'
                };
            }, function() {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    promotions: function(options) {
        return this.restaurant(options[0], options[1]);
    },

    editable: function(options) {
        var itemsFn = {
            promotion: {
                activate: function(sa, sl) {
                    return promotionActions.getPromotions(sa, sl, 'APPROVED');
                },
                delete: function(sa, sl) {
                    return promotionActions.getPromotions(sa, sl, 'ACTIVE');
                }
            },
            gallery: {
                activate: function(sa, sl) {
                    return galleryActions.getApprovedThumbnails(sa, sl);
                },
                delete: function(sa, sl) {
                    return galleryActions.getActiveThumbnails(sa, sl);
                }
            }
        };

        var actionFunctions = {
            promotion: {
                activate: promotionActions.activatePromotion,
                delete: promotionActions.deActivatePromotion
            },
            gallery: {
                activate: galleryActions.activateGalleryItem,
                delete: galleryActions.deactivateGalleryItem
            }
        };

        return $.when(
            saslActions.getSasl(options.sasl),
            sessionActions.getCurrentUser(),
            itemsFn[options.item][options.action].apply(null, [options.sasl[0], options.sasl[1]])
        ).then(function(restaurant, user, items) {
            return {
                items: items,
                user: user,
                url: getUrl(restaurant),
                restaurant: restaurant,
                action: options.action,
                actionfn: function(itemId) {
                    return actionFunctions[options.item][options.action]
                        .apply(null, [restaurant.sa(), restaurant.sl(), itemId]);
                }
            };
        });
    },

    singleton: function(options) {
        var sasl,
            // promoPrice = options.promoPrice || null,
            discount = options.discount || null,
            discountType = options.discountType || '',
            promoCode = options.promoCode || null,
            // type = options.type,
            // uuid = options.uuid,
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
        var reOrder = options.reOrder;
        var orderUUID = options.orderUUID;
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

                if (reOrder) {
                    this.reOrder(catalog, orderUUID, basket);
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
            }.bind(this));
    },

    reOrder: function(catalog, orderUUID, basket) {
        //TODO get order by uuid
        orderActions.retrieveOrderByUUID(orderUUID)
            .then(function(order) {
               this.addOrderItems(order, catalog, basket);
                //trigger change without show add item change quantity animation
                basket.trigger('change', 're-order'); 
            }.bind(this));
    },

    addOrderItems: function(order, catalog, basket) {
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
                basket.addItem(model, orderItem.quantity , item.groupId, null, item.catalogId, null, true);
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

    customization: function(options) {
        var sasl,
            catalogId = options.catalogId,
            isVersion = options.model.get('hasVersions'),
            catalogDetails = {
                catalogUUID: catalogId,
                catalogDisplayText: options.catalogDisplayText
            };
        return saslActions.getSasl()
            .then(function(ret) {
                sasl = ret;
                var basket = new CatalogBasketModel();
                basket.setCatalogDetails(catalogDetails);
                basket = appCache.fetch(sasl.sa() + ':' + sasl.sl() + ':' + catalogId + ':catalogbasket', basket);
                return {
                    sasl: sasl,
                    subItems: options.subItems,
                    model: options.model,
                    basket: basket,
                    version: isVersion && options.savedVersion ? options.savedVersion.version : null,
                    showCustomizationMark: options.showCustomizationMark
                };
            });
    },

    posts: function(options) { // options is an array with either sasl or
        // urlKey
        return saslActions.getSasl(options)
            .then(function(sasl) {
                return {
                    collection: new Backbone.Collection(),
                    sasl: sasl,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/posts'
                };
            });
    },

    contests: function(options) {
        var sasl;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return contestActions.getContests(sasl.sa(), sasl.sl());
            }).then(function(contests) {
                return {
                    sasl: sasl,
                    contests: contests,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/contests'
                };
            });
    },

    photoContest: function(options) {
        return $.when(
            contestActions.photo(options.id),
            saslActions.getSasl(options.sasl)
        ).then(function(contest, sasl) {
            return {
                sasl: sasl,
                model: contest,
                user: sessionActions.getCurrentUser(),
                url: getUrl(sasl) + '?t=h&u=' + contest.contestUUID
            };
        }, function(e) {
            console.error(e);
            Vent.trigger('viewChange', 'root');
            return e;
        });
    },

    pollContest: function(options) {
        return $.when(
            contestActions.poll(options.id),
            saslActions.getSasl(options.sasl)
        ).then(function(contest, sasl) {
            return {
                sasl: sasl,
                model: contest,
                user: sessionActions.getCurrentUser(),
                url: getUrl(sasl) + '?t=l&u=' + contest.contestUUID
            };
        }, function(e) {
            console.error(e);
            Vent.trigger('viewChange', 'root');
            return e;
        });
    },

    checkinContest: function(options) {
        return $.when(
            contestActions.checkin(options.id),
            saslActions.getSasl(options.sasl)
        ).then(function(contest, sasl) {
            return {
                sasl: sasl,
                model: contest,
                user: sessionActions.getCurrentUser(),
                url: getUrl(sasl) + '?t=c&u=' + contest.contestUUID
            };
        }, function(e) {
            console.error(e);
            Vent.trigger('viewChange', 'root');
            return e;
        });
    },

    aboutUs: function(options) {
        var sasl;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return saslActions.getAboutUs(sasl.sa(), sasl.sl());
            }).then(function(html) {
                return {
                    html: html,
                    sasl: sasl,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/aboutUs'
                };
            });
    },

    contactUs: function(options) {
        return saslActions.getSasl(options)
            .then(function(sasl) {
                return $.Deferred().resolve({sasl: sasl}).promise();
            });
    },

    businessHours: function(options) {
        return saslActions.getSasl(options)
            .then(function(sasl) {
                return saslActions.getOpeningHours(sasl.sa(), sasl.sl())
                    .then(function(hours){
                        return $.Deferred().resolve({
                            sasl: sasl,
                            hours: hours
                        }).promise();
                    },function (e) {
                        $.Deferred().resolve({
                            error: e,
                            sasl: sasl
                        }).promise();
                    })
            });
    },

    upload_photo: function(options) {
        return saslActions.getSasl(options)
            .then(function(sasl) {
                return $.Deferred().resolve({
                    sasl: sasl
                }).promise();
            }.bind(this), function (err) {
                return err;
            });
    },

    blog_posts: function(options) {
        return saslActions.getSasl(options)
            .then(function(sasl) {
                return $.Deferred().resolve({
                    sasl: sasl
                }).promise();
            }.bind(this), function (err) {
                return err;
            });
    },

    appointments: function(options){
        return saslActions.getSasl(options)
            .then(function (sasl) {
                return $.Deferred().resolve({
                    sasl: sasl,
                }).promise();
            }.bind(this), function (err) {
                return err;
            });
    },

    orders_history: function(options){
        return saslActions.getSasl(options)
            .then(function (sasl) {
                return orderActions.retrieveOrdersByUID()
                    .then(function(ordersHistory){
                        return $.Deferred().resolve({
                            sasl: sasl,
                            ordersHistory: ordersHistory
                        }).promise();
                    },function (e) {
                        $.Deferred().resolve({
                            error: e,
                            sasl: sasl
                        }).promise();
                    })
            }.bind(this), function (err) {
                return err;
            });
    },

    order_details: function(orderId){
        return orderActions.retrieveOrderByID(orderId)
            .then(function(html){
                return $.Deferred().resolve({
                    html: html
                }).promise();
            },function (e) {
                $.Deferred().resolve({
                    error: e
                }).promise();
            })
    },

    catalog_order: function(options) {
        var sasl,
            orderPrefillInfo,
            catalogId = options.catalogId,
            backToCatalog = true, // options.backToCatalogs;
            backToCatalogs = options.backToCatalogs;
        return saslActions.getSasl(options.id)
            .then(function(ret) {
                sasl = ret;
                return orderActions.getOrderPrefillInfo();
            }).then(function(ret) {
                orderPrefillInfo = ret;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId');
                /*
                 * pull up the basket for this sasl
                 */
                var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + catalogId + ':catalogbasket');
                return {
                    sasl: sasl,
                    orderPrefillInfo: orderPrefillInfo,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/catalog',
                    basket: basket,
                    catalogId: catalogId,
                    backToCatalog: backToCatalog,
                    backToCatalogs: backToCatalogs
                };
            });
    },

    address: function(options) {
        var sasl,
            basketType,
            addresses,
            fundsource,
            discountPrice = options.discountPrice || 0,
            promoCode = appCache.get('promoCode') || null,
            promoUUID = options.promoUUID || null,
            type = options.type,
            uuid = options.uuid,
            rosterId = options.rosterId || options.catalogId,
            backToCatalog = options.backToCatalog || false, // options.backToCatalogs;
            backToRoster = options.backToRoster || false,
            backToCatalogs = options.backToCatalogs || false,
            backToSingleton = options.backToSingleton,
            deliveryPickupOptions = options.deliveryPickupOptions,
            editModel=options.editModel,
            launchedViaURL=options.launchedViaURL;
        options.rosterId ? basketType = ':rosterbasket' : basketType = ':catalogbasket';
        return saslActions.getSasl(options.id)
            .then(function(ret) {
                sasl = ret;
                return orderActions.getOrderPrefillInfo();
            }).then(function(ret) {
                addresses = ret.addresses;
                fundsource = ret.fundsource;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId'),
                    paymentProcessor = sasl.get('services').catalog.paymentProcessor;
                /*
                 * pull up the basket for this sasl
                 */
                var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + basketType);
                options.rosterId ? backToRoster = true : backToRoster = false;
                return {
                    sasl: sasl,
                    type: type,
                    uuid: uuid,
                    addresses: addresses,
                    fundsource: fundsource,
                    paymentProcessor: paymentProcessor,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/roster',
                    basket: basket,
                    editModel:editModel,
                    rosterId: backToRoster ? rosterId : backToRoster,
                    catalogId: backToRoster ? backToRoster : rosterId,
                    backToRoster: backToRoster,
                    backToCatalog: backToRoster? false : backToCatalog,
                    backToCatalogs: backToCatalogs,
                    backToSingleton: backToSingleton,
                    launchedViaURL: launchedViaURL,
                    promoCode: promoCode,
                    promoUUID: promoUUID,
                    discountPrice: discountPrice,
                    deliveryPickupOptions: deliveryPickupOptions
                };
            });
    },

    add_address: function(options) {
        return $.Deferred().resolve(options).promise();
    },

    order_time: function(options) {
        return $.Deferred().resolve(options).promise();
    },

    payment: function(options) {
        return $.Deferred().resolve(options).promise();
    },

    payment_card: function(options) {
        return $.Deferred().resolve(options).promise();
    },

    summary: function(options) {
        return $.Deferred().resolve(options).promise();
    },

    vantiv: function(options) {
        return saslActions.getSasl(options.id)
            .then(function(ret) {
                var sasl = ret,
                    user = sessionActions.getCurrentUser(),
                    vantivParams = {
                        UID: user.getUID(),
                        serviceAccommodatorId: sasl.sa(),
                        serviceLocationId: sasl.sl(),
                        payload: _.extend(options.model.toJSON() , {
                            vantivReturnURL: (community.host === 'localhost' ? 'http://' : community.protocol) + community.host + '/Vantiv',
                            vantivCSS: vantivStyles() //tweak for vantiv styles)
                        })
                    };
            return orderActions.vantivTransactionSetup(vantivParams)
                .then(function(data){
                    options.model.set('orderUUID', data.orderUUID);
                    return {
                        model: new Backbone.Model(data),
                        summaryModel: options.model
                    };
                }.bind(this));
            });
    },

    roster_order: function(options) {
        var sasl,
            addresses,
            fundsource,
            rosterId = options.rosterId,
            backToCatalog = true, // options.backToCatalogs;
            backToRoster = true,
            backToCatalogs = options.backToCatalogs,
            editModel=options.editModel,
            launchedViaURL=options.launchedViaURL;
        return saslActions.getSasl(options.id)
            .then(function(ret) {
                sasl = ret;
                return orderActions.getOrderPrefillInfo();
            }).then(function(ret) {
                addresses = ret.addresses;
                fundsource = ret.fundsource;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId');
                /*
                 * pull up the basket for this sasl
                 */
                var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + ':rosterbasket');
                return {
                    sasl: sasl,
                    addresses: addresses,
                    fundsource: fundsource,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/roster',
                    basket: basket,
                    editModel:editModel,
                    rosterId: rosterId,
                    backToRoster: true,
                    backToCatalog: backToCatalog,
                    backToCatalogs: backToCatalogs,
                    launchedViaURL: launchedViaURL
                };
            });
    },
    eventActive: function(options) {
        var sasl = options.sasl;
        return saslActions.getSasl(sasl)
            .then(function(ret) {
                sasl = ret;
                return eventActions.getEvents(options);
            }).then(function(eventAttrs) {
                return {
                    sasl: sasl,
                    eventAttrs: eventAttrs,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '?t=e&u=' + options.id
                };
            });
    }
};
