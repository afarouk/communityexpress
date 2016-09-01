/* global define */

'use strict';

$(document).on('mobileinit', function(){

    $.mobile.autoInitializePage = false;
    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;
    $.mobile.pageContainer = 'body';
    $.mobile.defaultPageTransition = 'slide';
    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;

});
