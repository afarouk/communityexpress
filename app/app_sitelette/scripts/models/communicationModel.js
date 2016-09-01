/*global define*/

'use strict';

var appConfig = require('../appConfig.js'),
    h = require('../globalHelpers');

var MessageModel = Backbone.Model.extend({

    defaults:  {
        fromUser: true,
        timeStamp: ''
    },

    initialize: function() {
        var id = this.get('communicationId') + '-' + this.get('offset');
        this.set('id', id);
    }

});

module.exports = MessageModel;
