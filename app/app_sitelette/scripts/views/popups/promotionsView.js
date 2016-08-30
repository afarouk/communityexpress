/*global define*/

'use strict';

var template = require('ejs!../../templates/promotions.ejs'),
    loader = require('../../loader'),
    PromotionView = require('../partials/promotionView'),
    PopupView = require('../components/popupView'),
    promotionsController = require('../../controllers/promotionsController'),
    promotionActions = require('../../actions/promotionActions');

var PromotionsView = PopupView.extend({

    template: template,

    id: 'cmntyex_promotions_popup',

    className: 'popup',

    initialize: function(options) {
        this.addEvents({
            'click .back': 'triggerRestaurantView',
            'click .close_button': 'shut',
            'click .prev_button': 'prevSlide',
            'click .next_button': 'nextSlide'
        });

        this.sasl = options.sasl;
        if (options.pid) {
            this.pid = options.pid;
        }

    },

    beforeShow: function(){
        var w = $( window ).width();
        this.$el.css({
            'max-width': 400,
            'width': w * 0.85
        });
    },

    onShow: function(){
        this.prevButton = this.$el.find('.prev_button');
        this.nextButton = this.$el.find('.next_button');
        this.init(this.pid);
    },

    prevSlide: function () {
        this.goToSlide(this.gallery.getPos() - 1);
    },

    nextSlide: function () {
        this.goToSlide(this.gallery.getPos() + 1);
    },

    findIndex: function (pid) {
        var ind;
        this.collection.each(function (promotion, i) {
            if (promotion.get('UUID') == pid) {
                ind = i;
            }
        });
        return ind;
    },

    init: function() {
        var i = this.findIndex(this.pid);
        this.initGallery();
        if (i) {
            this.goToSlide(i);
        } else {
            this.loadImage(0);
        }
    },

    initGallery: function(){
        this.gallery = this.$el.find('.slider').Swipe({
            callback: function(index) {
                this.loadImage(index);
                this.toggleButtons(index);
            }.bind(this)
        }).data('Swipe');
    },

    loadImage: function(index) {
        var placeholder = this.$el.find('.promotion_placeholder').eq(index);
        if( placeholder.find('img').length !== 0){ return; } // return if placeholder already has an image
        var UUID = this.collection.at(index).get('UUID');

        promotionsController.fetchPromotionByUUID(UUID).done(function(viewmodel){
            placeholder.html(new PromotionView({
                model: viewmodel,
                parent: this,
                onEmail: function () { this.sendEmail(UUID); }.bind(this),
                onMobile: function () { this.sendMobile(UUID); }.bind(this)
            }).render().el);
        }.bind(this));

        this.toggleButtons(index);
    },

    sendEmail: function (UUID) {
        this.once('closed', function () {
            setTimeout(function () {
                this.parent.openSubview('contactPopup', {}, {
                    promoUUID: UUID,
                    sasl: this.sasl
                });
            }.bind(this), 300);
        }.bind(this));
        this.shut();
    },

    sendMobile: function (UUID) {
        this.once('closed', function () {
            setTimeout(function () {
                this.parent.openSubview('mobilePopup', {}, {
                    promoUUID: UUID,
                    sasl: this.sasl
                });
            }.bind(this), 300);
        }.bind(this));
        this.shut();
    },

    toggleButtons: function (index) {
        if (index === 0) {
            this.prevButton.addClass('ui-state-disabled');
        } else {
            this.prevButton.removeClass('ui-state-disabled');
        }
        if (index === this.collection.length - 1) {
            this.nextButton.addClass('ui-state-disabled');
        } else {
            this.nextButton.removeClass('ui-state-disabled');
        }
    },


    goToSlide: function(index) {
        this.gallery.slide(index);
    },


});

module.exports = PromotionsView;
