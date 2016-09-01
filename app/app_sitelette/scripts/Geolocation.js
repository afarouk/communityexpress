/*global console, define, Modernizr*/

'use strict';

var currentLocation = {latitude:'',longitude:''},
    watchProcess,
    NO_SUPPORT_MSG = 'Geolocation is not supported by this browser';

var reportSupportError = function() {
    console.error(NO_SUPPORT_MSG);
    return false;
};

var onLocationSuccess = function(location) {
    console.debug('=========== GEOLOCATION SUCCESS ============');
    console.log(location);
    console.debug('============================================');

    currentLocation = location.coords;

};

var onLocationError = function(error) {

    console.error('=========== GEOLOCATION ERROR ==============');
    console.error(error);
    console.error('============================================');

    var msg;
    switch(error.code){
    case error.PERMISSION_DENIED:
        msg = 'User denied the request for Geolocation.';
        break;
    case error.POSITION_UNAVAILABLE:
        msg = 'Location information is unavailable.';
        break;
    case error.TIMEOUT:
        msg = 'The request to get user location timed out.';
        break;
    case error.UNKNOWN_ERROR:
        msg = 'An unknown error occurred.';
        break;
    }

    return msg;

};

var Geolocation = _.extend( Backbone.Events, {

    getPreviousLocation: function() {
        return currentLocation;
    },

    getLocation: function() {
        var dfd = $.Deferred();

        navigator.geolocation.getCurrentPosition(function(position){
            onLocationSuccess(position);
            dfd.resolve(currentLocation);
        }, function(){
            dfd.reject({ msg: onLocationError() });
        });

        dfd.resolve(currentLocation);

        return dfd.promise();
    },

    startWatching: function() {
        var self = this;

        if(!watchProcess){
            watchProcess = navigator.geolocation.watchPosition(function(p){
                onLocationSuccess(p);
                self.trigger('change', currentLocation );
            },onLocationError);
        }
        return watchProcess;

    },

    stopWatching: function() {
        if(watchProcess){
            navigator.geolocation.clearWatch(watchProcess);
            watchProcess = null;
        }
    }

});

var Mock = ( function() {
    var mock = {};
    for( var func in Geolocation ){
        mock[func] = reportSupportError;
    }
    mock.getPreviousLocation = Geolocation.getPreviousLocation;
    return mock;
})();

module.exports = Geolocation;
// {
//     Geolocation: function() {
//         if (Modernizr.geolocation) {
//             return Geolocation;
//         }
//     },

//     Mock
// };
