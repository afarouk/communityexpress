/*global define*/

'use strict';

var template = require('ejs!../../templates/userPictures.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView');

var PromotionsView = PopupView.extend({

    template: template,

    id: 'cmntyex_user_pictures_popup',

    className: 'popup',

    initialize: function() {
        this.addEvents({
            'click .close_button': 'shut',
        });
    },

    beforeShow: function(){
        var w = $(window).width();
        this.$el.css({
            'max-width': 400,
            'width': w * 0.85
        });
    },

    onShow: function(){
        this.init();
    },

    init: function() {
        this.initGallery();
    },

    initGallery: function(){
        this.gallery = this.$el.find('.slider').Swipe({
            callback: function(index) {
                this.loadImage(index);
                this._toggleButtons(index);
            }.bind(this)
        }).data('Swipe');
    },

    goToSlide: function(index) {
        this.gallery.slide(index);
    }

});

module.exports = PromotionsView;
