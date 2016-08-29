/*global define*/

'use strict';

var LandingView = require('./views/landingView'), //
    ChatView = require('./views/chatView'), //
    ReviewsView = require('./views/reviewsView'), //
    EditView = require('./views/editView'),//
    CatalogView = require('./views/catalogView'),//
    CatalogsView = require('./views/catalogsView'),//
    RosterView = require('./views/rosterView'),//
    PostsView = require('./views/postsView'),//
    ContestsView = require('./views/contestsView'),//
    PhotoContestView = require('./views/photoContestView'), //
    PollContestView = require('./views/pollContestView'), //
    RootView = require('./views/rootView'),//
    AboutUsView = require('./views/aboutUsView'), //
    CatalogOrderView = require('./views/catalogOrderView'),//
    RosterOrderView = require('./views/rosterOrderView'),//
    EventActiveView = require('./views/eventActiveView'),//
    NavbarView = require('./views/headers/navbarView');

module.exports = {
    create : function(viewName, options) {
        var view;
        switch (viewName) {
        case 'restaurant':
        case 'promotions':
            view = new LandingView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    restaurant : options.model,
                    back : false
                }
            }));
            break;
        case 'chat':
            view = new ChatView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    restaurant : options.model,
                    title : 'Chat'
                }
            }));
            break;
        case 'reviews':
            view = new ReviewsView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    restaurant : options.model,
                    title : 'Reviews'
                }
            }));
            break;
        case 'editable':
            view = new EditView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.restaurant,
                    title : ''
                }
            }));
            break;
        case 'catalog':
            view = new CatalogView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    restaurant : options.model
                }
            }));
            break;
        case 'catalogs':
            if (typeof options === 'undefined') {
                view = new CatalogsView(_.extend(options, {
                    navbarView : NavbarView,
                    navbarData : {
                        //sasl : options.sasl
                    }
                }));
            } else {
                view = new CatalogsView(_.extend(options, {
                    navbarView : NavbarView,
                    navbarData : {
                        sasl : options.sasl
                    }
                }));
            }

            break;
        case 'roster':
            view = new RosterView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl
                }
            }));
            break;
        case 'posts':
            view = new PostsView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'Wall'
                }
            }));
            break;
        case 'contests':
            view = new ContestsView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'Contests'
                }
            }));
            break;
        case 'photoContest':
            view = new PhotoContestView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    contest : options.model,
                    title : 'Photo Contest'
                }
            }));
            break;
        case 'pollContest':
            view = new PollContestView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    contest : options.model,
                    title : 'Poll Contest'
                }
            }));
            break;
        case 'checkinContest':
            view = new CheckinContestView(_.extend(options, {
                navbarView : ContestHeader,
                navbarData : {
                    sasl : options.sasl,
                    contest : options.model,
                    title : 'Checking Contest'
                }
            }));
            break;
        case 'aboutUs':
            view = new AboutUsView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'About Us'
                }
            }));
            break;
        case 'catalog_order':
            view = new CatalogOrderView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'Order'
                }
            }));
            break;
         case 'roster_order':
            view = new RosterOrderView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'Order'
                }
            }));
            break;
        case 'eventActive':
            view = new EventActiveView(_.extend(options, {
                navbarView : NavbarView,
                navbarData : {
                    sasl : options.sasl,
                    title : 'Active Event'
                }
            }));
        }
        return view;
    }
};
