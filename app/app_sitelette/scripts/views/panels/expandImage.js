 /*global define*/

'use strict';

var template = require('ejs!../../templates/expandImage.ejs'),
    PopupView = require('../components/popupView');

var expandImageView = PopupView.extend({

    template: template,

    initialize: function(options){

        options = options || {};

        this.callback = options.callback || function () {};

        this.renderData = {
            title: options.title || ' ',
            imgSource: options.model
        };

        this.$el.attr('id', 'cmntyex_expand_image');
    },

    beforeShow: function () {
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 480,
            'max-width': 360,
            'width': w * 0.9,
            'margin-top': '-40px'
        });
    }
});

module.exports = expandImageView;
