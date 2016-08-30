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
    orderActions = require('./actions/orderActions'),
    galleryActions = require('./actions/galleryActions'),
    catalogActions = require('./actions/catalogActions'),
    contestActions = require('./actions/contestActions'),
    eventActions = require('./actions/eventActions'),
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

    catalog: function(options) { // options is an array with either sasl or
        // urlKey
        var sasl;

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

                var basket;
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

                return {
                    sasl: sasl,
                    catalog: catalog,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/catalog',
                    rosterId: rosterId,
                    backToRoster: backToRoster,
                    basket: basket, // catalogActions.getBasket(sasl.sa(),
                    // sasl.sl()),
                    backToCatalogs: backToCatalogs,
                    catalogId: catalogId,
                    navbarView: navbarView,
                    launchedViaURL :launchedViaURL
                };
            });
    },

    catalogs: function(options) {
        var sasl;
        var id = options;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return catalogActions.getCatalogs(sasl.sa(), sasl.sl());
            }).then(function(options) {
                if (options.data.length === 1) {
                    Vent.trigger('viewChange', 'catalog', {
                        id: id,
                        catalogId: options.data.catalogId,
                        backToCatalogs: false,
                        backToRoster: false
                    });
                } else {
                    return {
                        sasl: sasl,
                        catalogs: options
                    };
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
        var catalogDisplayText=options.catalogDisplayText;

        return saslActions.getSasl(id)
            .then(function(ret) {
                sasl = ret;
                return catalogActions.getRoster(sasl.sa(), sasl.sl(), rosterId);
            }).then(function(roster) {

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
                        rosterBasket.catalogs.models.push(catalogClone);
                    } else {
                        console.log("Roster already has catalog: " + catalogId );
                    }
                }else if(typeof cloneCatalogAndAdd !== 'undefined' && cloneCatalogAndAdd === false){

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
                    launchedViaURL: launchedViaURL
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

    catalog_order: function(options) {
        var sasl,
            cardType,
            catalogId = options.catalogId,
            backToCatalog = true, // options.backToCatalogs;
            backToCatalogs = options.backToCatalogs;
        return saslActions.getSasl(options.id)
            .then(function(ret) {
                sasl = ret;
                return orderActions.getCreditInfo();
            }).then(function(ret) {
                cardType = ret;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId');
                return orderActions.getPriceAddons(sa, sl);
            }).then(function(ret) {
                /*
                 * pull up the basket for this sasl
                 */
                var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + catalogId + ':catalogbasket');
                return {
                    sasl: sasl,
                    cardType: cardType,
                    priceAddons: ret,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/catalog',
                    basket: basket,
                    catalogId: catalogId,
                    backToCatalog: backToCatalog,
                    backToCatalogs: backToCatalogs
                };
            });
    },
    roster_order: function(options) {
        var sasl,
            cardTypes,
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
                return orderActions.getCreditInfo();
            }).then(function(ret) {
                cardTypes = ret.acceptedCards;
                fundsource = ret.fundsource;
                var sa = sasl.get('serviceAccommodatorId'),
                    sl = sasl.get('serviceLocationId');
                return orderActions.getPriceAddons(sa, sl);
            }).then(function(ret) {
                /*
                 * pull up the basket for this sasl
                 */
                var basket = appCache.get(sasl.sa() + ':' + sasl.sl() + ':' + rosterId + ':rosterbasket');
                return {
                    sasl: sasl,
                    cardTypes: cardTypes,
                    fundsource: fundsource,
                    priceAddons: ret,
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
