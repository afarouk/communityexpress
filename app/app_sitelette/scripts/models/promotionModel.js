/*global define*/

'use strict';

var PromotionModel = Backbone.Model.extend({

    idAttribute: "promoUUID",

    getImage: function () {
        return this.get('url');
    },

    getText: function () {
        return this.get('messageText');
    },

    getTitle: function () {
        return this.get('promotionSASLName');
    }

});

module.exports = PromotionModel;
