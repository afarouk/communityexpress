/*global define*/

'use strict';

var template = require('ejs!../../templates/leftMenuView.ejs'),
loader = require('../../loader'),
PanelView = require('../components/panelView'),
appCache = require('../../appCache.js'),
Vent = require('../../Vent'),
h = require('../../globalHelpers');

var LeftMenuView = PanelView.extend({

    template : template,

    events: {
    	'click .open_catalog_btn': 'onOpenCatalog',
    	'click .business_hours_btn': 'onOpenBusinessHours',
    	'click .contact_us_btn': 'onOpenContactUs'
    },

    initialize : function(options) {
        this.options = options || {};
        this.saslData = appCache.get('saslData');
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

    onOpenBusinessHours: function() {
    	loader.show('retrieving opening hours');
    	Vent.trigger('viewChange', 'businessHours',
    		[this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
    },

    onOpenContactUs: function() {
    	Vent.trigger('viewChange', 'contactUs',
    		[this.saslData.serviceAccommodatorId, this.saslData.serviceLocationId]);
    }

});

module.exports = LeftMenuView;
