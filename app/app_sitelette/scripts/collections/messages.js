/*global define*/

'use strict';

var config = require('../appConfig.js'),
    h = require('../globalHelpers.js'),
    MessageModel = require('../models/communicationModel.js');

var MessagesCollection = Backbone.Collection.extend({

    model: MessageModel,

    comparator: function(model) {
        // This is for ordering messages chronologically
        var timeStamp = model.get('timeStamp');
        if (!timeStamp || typeof timeStamp !== 'string') {
            return 0;
        }

        try {
            return - (new Date(timeStamp.split(':UTC')[0]));
        } catch(e) {
            return 0;
        }
    }

});

module.exports = MessagesCollection;
