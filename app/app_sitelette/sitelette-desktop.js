'use strict';

require('../vendor/codecanyon/assets/js/html5imageupload');
require('owl.carousel');
require('moment');
require('packery');

define([
    './desktop_app/app.js',
    ], function(App){
    console.log('Starting desktop...');
    $(document).ready(function(){
    	App.start();
    });
});
