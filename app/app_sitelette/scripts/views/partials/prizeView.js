/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/prize.ejs'),
    h = require('../../globalHelpers'),
    config = require('../../appConfig'),
    Vent = require('../../Vent'),
    saslActions = require('../../actions/saslActions');

module.exports = Backbone.View.extend({

    tagName: 'li',

    template: template,

    events: {
        'click .choose_button': 'choose'
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

});
