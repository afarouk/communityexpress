'use strict';

require('../vendor/css/fonts.css');
require('../vendor/skeuocard-master/styles/skeuocard.reset.css');
require('../vendor/skeuocard-master/styles/skeuocard.css');
require('../vendor/star-rating-svg-master/src/css/star-rating-svg.css');
require('!style!css!owl.carousel/dist/assets/owl.carousel.css');
// require('!style!css!jquery-ui-dist/jquery-ui.min.css');
// require('!style!css!font-awesome/css/font-awesome.css');

require('jquery-ui-dist/jquery-ui');
require('../vendor/skeuocard-master/javascripts/skeuocard.min.js');
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
