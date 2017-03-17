'use strict';

require('../vendor/codecanyon/assets/js/html5imageupload');
require('owl.carousel');
require('moment');

define([
    './desktop_app/app.js',
    ], function(App){
    console.log('Starting desktop...');
    App.start();
});
