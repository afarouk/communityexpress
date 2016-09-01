/*global define*/

'use strict';

var PanelView = require('../components/panelView'),
    template = require('ejs!../../templates/restaurantMenu.ejs'),
    config = require('../../appConfig');

var defaults = {
    imagePath: config.imagePath
};

var RestaurantMenuView = PanelView.extend({

    template: template,

    initialize: function(options){
        this.options = options || {};
        this.$el.attr('id', 'cmntyex_menu_panel');
        this.menuOptions = _.extend({}, defaults, options);
        this.addEvents();
    },

    render: function() {
        var buttons = _.filter(this.options, function (option, key) {
            if (!option || !option.masterEnabled) return false;
            option.key = key;
            return true;
        });
        this.$el.html(this.template({buttons: buttons}));
        return this;
    }
});

module.exports = RestaurantMenuView;
