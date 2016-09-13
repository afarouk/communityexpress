/*global define*/

'use strict';

var template = require('ejs!../../templates/leftMenuView.ejs'),
loader = require('../../loader'),
PanelView = require('../components/panelView'),
h = require('../../globalHelpers');

var LeftMenuView = PanelView.extend({

    template : template,

    initialize : function(options) {
        this.options = options;
        options = options || {};
    },

    // render : function() {
    //     this.$el.html(this.template());
    //     return this;
    // }

});

module.exports = LeftMenuView;
