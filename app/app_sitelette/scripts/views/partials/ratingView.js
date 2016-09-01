/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/rating.ejs'),
    h = require('../../globalHelpers');

var RatingView = Backbone.View.extend({

    template: template,

    events: {
        'mouseenter span': 'setRating',
        'click span': 'setRating'
    },

    initialize: function () {
        this.rating = 0;
    },

    render: function () {
        this.$el.html(this.template({rating: this.rating}));
        return this;
    },

    setRating: function (e) {
        e.stopPropagation();
        var offset = 0;
        var target = $(e.target);
        if (e.offsetX < target.width() / 2) {
            offset = 1;
        }
        this.rating = target.index() * 2 + 2 - offset;
        this.render();
    },

    val: function () {
        return this.rating;
    }
});

module.exports = RatingView;
