'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    getUserPictures: function (sa, sl) {
        return gateway.sendRequest('getUserPictures', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            lastIndex: 0,
            count: 10,
            mediaType: 'GALLERY_MEMBER'
        }).then(function (pics) {
            return new Backbone.Collection(pics);
        });
    },

    uploadUserMedia: function(sa, sl, file, title, message) {
        return gateway.sendFile('createWNewPictureNewMetaData', {
            image: file,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            title: title,
            message: message,
            UID: getUID()
        });
    }
};
