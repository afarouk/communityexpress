/*global define*/

'use strict';

var ReviewModel = Backbone.Model.extend({

    idAttribute: 'communicationId',

    defaults: {
        rating: 0,
        'rating_img_url': '',
        'rating_img_url_small': '',
        reviewDate: '',
        'text_excerpt': '',
        userName: ''
    },

    initialize: function () {
        this.set('id', this.get('communicationId') + '|' + this.get('offset'));
    }

});

module.exports = ReviewModel;
