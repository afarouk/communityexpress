/*global define*/

'use strict';

var MessageCollection = require('../collections/messages.js');

var ReviewListModel = Backbone.Model.extend({

    initialize: function (options) {
        options = options || {};
        this.conversation = options.conversation || new MessageCollection();
    }

});

module.exports = ReviewListModel;
