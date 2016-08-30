/*global define */

'use strict';

var GalleryModel = require('../models/galleryModel.js'),
    gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    getGallery: function (sa, sl, password) {
        return gateway.sendRequest('retrieveAugmentedMediaMetaDataBySASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            visitorPassword: password,
            UID: getUID()
        }).then(function(gallery){
            return new Backbone.Collection(gallery);
        });
    },

    createAdhocGalleryItem: function (sa, sl, file, title, message, type) {
        return gateway.sendFile('createAdhocMedia', {
            image: file,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            title: title,
            message: message,
            type: 'GALLERY_OWNER',
            UID: getUID()
        });
    },

    getApprovedThumbnails: function (sa, sl) {
        return gateway.sendRequest('retrieveMediaMetaDataBySASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            status: 'APPROVED',
        }).then(function(gallery){
            return new Backbone.Collection(gallery, {
                model: GalleryModel
            });
        });
    },

    getActiveThumbnails: function (sa, sl) {
        return gateway.sendRequest('retrieveMediaMetaDataBySASL', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            status: 'ACTIVE',
        }).then(function(gallery){
            return new Backbone.Collection(gallery, {
                model: GalleryModel
            });
        });
    },

    activateGalleryItem: function (sa, sl, id) {
        return gateway.sendRequest('activateMedia', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            id: id,
            UID: getUID()
        });
    },

    deactivateGalleryItem: function (sa, sl, id) {
        return gateway.sendRequest('deactivateMedia', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            id: id,
            insertAfterId: 0,
            UID: getUID()
        });
    }
};
