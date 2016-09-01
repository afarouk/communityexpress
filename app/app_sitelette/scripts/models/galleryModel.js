/*global define*/

'use strict';

var GalleryModel = Backbone.Model.extend({

    idAttribute: "id",

    getImage: function () {
        return this.get('url');
    },

    getText: function () {
        return this.get('message');
    },

    getTitle: function () {
        return this.get('title');
    }

});

module.exports = GalleryModel;
