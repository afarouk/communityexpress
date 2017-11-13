'use strict';

require('../vendor/css/bootstrap.min.css');
require('../vendor/css/fonts.css');
require('../vendor/codecanyon/assets/css/html5imageupload.css');
require('../vendor/skeuocard-master/styles/skeuocard.reset.css');
require('../vendor/skeuocard-master/styles/skeuocard.css');
require('../vendor/star-rating-svg-master/src/css/star-rating-svg.css');
require('!style!css!owl.carousel/dist/assets/owl.carousel.css');

require('../vendor/scripts/bootstrap.min.js');
require('jquery-ui-dist/jquery-ui');
require('../vendor/codecanyon/assets/js/html5imageupload');
require('../vendor/skeuocard-master/javascripts/skeuocard.min.js');
require('owl.carousel');
require('moment');

define([
    './desktop_app/app.js'
    ], function(App){
    console.log('Starting desktop...');
    $(document).ready(function(){
    	App.start();
    });
});
