/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/promotion.ejs'),
    h = require('../../globalHelpers'),
    promotionActions = require('../../actions/promotionActions'),
    loader = require('../../loader');

var PromotionviewView = Backbone.View.extend({

    template: template,

    button: '.book_now_button',

    events: {
        'click .share_button': 'toggleShare',
        'click .like_button': 'voteUp',
        'click .email_button': 'onEmail',
        'click .mobile_button': 'onMobile',
    },

    initialize: function(options) {
        options = options || {};
        this.parent = options.parent;
        this.onEmail = options.onEmail;
        this.onMobile = options.onMobile;
    },

    toggleShare: function () {
        var url = this.$('.cmntyex_promotion_url');
        this.$('.cmntyex_promotion_description').toggle();
        url.toggle();

        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        selectElementContents(url[0]);
        url[0].focus();
    },

    render: function() {
        var data = h().toViewModel( _.extend( this.model.attributes) );
        this.$el.html(this.template(data));
        this.updateLikeCount();
        return this;
    },

    showButton: function() {
        this.$el.find(this.button).show();
    },

    updateLikeCount: function (index) {
        var UUID = this.model.get('promoUUID');
        this.setLikes(-1);

        promotionActions.fetchPromotionFeedback(UUID)
            .then(function (feedback) {
                this.setLikes(feedback.likeCount);
            }.bind(this), function() {
                this.setLikes(0);
            });
    },

    setLikes: function (num) {
        var $likes = this.$el.find('.cmntyex-promotion_likes');
        switch (num) {
            case -1:
                $likes.text('...');
                break;
            case 0:
                $likes.text('');
                break;
            default:
                $likes.text(num + ' likes');
        }
    },

    voteUp: function() {
        var UUID = this.model.get('promoUUID');
        loader.show();
        promotionActions.givePromotionFeedback(UUID, true)
            .then(function (response) {
                this.setLikes(response.likeCount);
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('an error has occurred');
            });
    }

});

module.exports = PromotionviewView;
