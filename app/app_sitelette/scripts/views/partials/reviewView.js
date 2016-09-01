/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/review.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var ReviewView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-review',

    template: template,

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

module.exports = ReviewView;
