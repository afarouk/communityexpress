/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/review.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent'),
    moment = require('moment');

var ReviewView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-review reviews_block',

    template: template,

    moment: moment,

    initialize: function(options) {
        this.on('show', this.onShow, this);
        options.index%5 === 0 ? this.index = 5 : this.index = options.index%5;
        this.$el.addClass('review_background_color_' + this.index);
    },

    onShow: function() {
        this.$el.find('.my-rating').starRating({
            initialRating: this.model.get('rating'),
            emptyColor: '#464646',
            strokeColor: '#EECB49',
            activeColor: '#EECB49',
            hoverColor: '#EECB49',
            strokeWidth: 45,
            starSize: 20,
            useGradient: false,
            useFullStars: true
        });
        this.$('.current_rating').text(this.model.get('rating'));
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.toTimeString = this.moment(viewModel.timeStamp).format('LT');
        viewModel.timeStamp = this.moment(viewModel.timeStamp).format('ll');
        this.$el.html(this.template( viewModel ));
        this.trigger('show');
        return this;
    },

});

module.exports = ReviewView;
