'use strict';

//TODO add all styles to desktop webpack build
// require('../vendor/skeuocard-master/styles/skeuocard.reset.css');
// require('../vendor/skeuocard-master/styles/skeuocard.css');
require('../vendor/skeuocard-master/javascripts/skeuocard.min.js');
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
