'use strict';

define([
	], function(){
	var VideosView = Mn.View.extend({
    el: '#cmtyx_video_block',
    initialize: function() {
      this.initGallery();
    },
    initGallery: function() {
      this.$('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]
      });
    }
	});
	return VideosView;
});