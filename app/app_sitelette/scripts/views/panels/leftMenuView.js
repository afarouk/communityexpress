/*global define*/

'use strict';

var template = require('ejs!../../templates/leftMenuView.ejs'),
loader = require('../../loader'),
PanelView = require('../components/panelView'),
RestaurantModel = require('../../models/restaurantModel'),
appCache = require('../../appCache.js'),
Vent = require('../../Vent'),
h = require('../../globalHelpers');

var LeftMenuView = PanelView.extend({

    template : template,

    events: {
    	'click .catalog': 'onOpenCatalog',
    	'click .openingHours': 'onOpenBusinessHours',
        'click .userMediaService': 'onOpenUploadPhoto',
        'click .userReviewsService': 'onOpenUserReviews',
        'click .wallService': 'onOpenCreateBlogPosts',
    	'click .contactUs': 'onOpenContactUs',
        'click .messagingService': 'onOpenChat'
    },

    initialize : function(options) {
        this.options = options || {};
        this.PopupController = options.parent;
        this.saslData = appCache.get('saslData');
        this.sasl = new RestaurantModel(this.saslData);
        this.model = new Backbone.Model(this.getActiveButtons());
        setTimeout(this._onOpen.bind(this), 500);
    },

    getActiveButtons: function() {
        var buttons = _.filter(this.sasl.get('services'), function (option, key) {
            if (!option || !option.masterEnabled) return false;
            option.key = key;
            return true;
        });
        return {buttons: buttons};
    },

    // render : function() {
    //     this.$el.html(this.template());
    //     return this;
    // }

    onOpenCatalog: function() {
        if (this.saslData) {
            switch (this.saslData.retailViewType) {
                case 'ROSTER':
                    this.triggerRosterView();
                    break;
                case 'CATALOGS':
                    Vent.trigger('viewChange', 'catalogs',
                    	[this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
                    break;
                case 'CATALOG':
                    Vent.trigger('viewChange', 'catalog', {
                        backToRoster: false,
                        backToCatalogs: false,
                        backToCatalog: true
                    });
                    break;
            default:
            }
        }
    },

    triggerRosterView: function() {
        var uuid = 'ROSTER';
        Vent.trigger('viewChange', 'roster', {
            id: uuid,
            backToRoster: false,
            rosterId: uuid,
            launchedViaURL: false
         }, { reverse: false });
    },

    onOpenBusinessHours: function() {
    	loader.show('retrieving opening hours');
    	Vent.trigger('viewChange', 'businessHours',
    		[this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
    },

    onOpenContactUs: function() {
    	Vent.trigger('viewChange', 'contactUs',
    		[this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
    },

    onOpenChat: function() {
        this.PopupController.requireLogIn(this.sasl, function() {
            Vent.trigger('viewChange', 'chat',
            [this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
        }.bind(this));
    },

    onOpenUserReviews: function() {
        console.log('user reviews');
        this.PopupController.requireLogIn(this.sasl, function() {
            Vent.trigger('viewChange', 'reviews',
            [this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
        }.bind(this));
    },

    onOpenUploadPhoto: function() {
        console.log('upload photo');
        this.PopupController.requireLogIn(this.sasl, function() {
            Vent.trigger('viewChange', 'upload_photo',
            [this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
        }.bind(this));
    },

    onOpenCreateBlogPosts: function() {
        console.log('create blog posts');
    }

});

module.exports = LeftMenuView;
