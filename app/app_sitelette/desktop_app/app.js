'use strict';

define([
    'packery/js/packery',
    'jquery-bridget/jquery-bridget'
	], function(Packery, jQueryBridget){
		var App = new Mn.Application({
			onStart: function() {
				Backbone.history.start({pushState: true});

				$(document).ready(function(){
					this.test();
				}.bind(this));
			},

			test: function() {
				jQueryBridget( 'packery', Packery, $ );
		        var $grid = $('.grid').packery({
		          itemSelector: '.grid-item',
		          columnWidth: '.grid-sizer',
		          percentPosition: true,
		          gutter: '.gutter-sizer'
		        });

		        setTimeout(function() { 
		          $('.cssload-thecube').hide();
		          $grid.show();
		          $grid.packery(); 
		        }, 1200)

		        $(".owl-carousel").owlCarousel({
		          items: 1,
		          loop: true,
		          autoplay: true,
		          autoplayTimeout: 3000,
		          animateIn: 'fadeIn',
		          animateOut: 'fadeOut'
		        });

			       
		        $('.tabcontent').hide();
		        $('.tabs').hide();

		        $('.day').click(function(event) {
		            $('.catalog_main_container').hide();
		            $('.tabs').show();

		          // Default show the first tab, and add an "active" class to the link that opened the tab
		          $('#' + $('.tabs + .tabcontent').attr('id')).show();
		          $(".tabs button:nth-child(1)").addClass('active');
		        });

		        $('.tabs button').click(function(event) {
		          // Get all elements with class="tabcontent" and hide them
		            $('.tabcontent').hide();

		            // Get all elements with class="tablinks" and remove the class "active"
		            $('.tablinks').removeClass('active');

		            // Show the current tab, and add an "active" class to the link that opened the tab
		            $('#' + $(this).text()).show();
		            $(this).addClass('active');
		        });

		        $('.back_to_catalog_btn').click(function(event) {
		          $('.tablinks').removeClass('active');
		          $('.tabcontent').hide();
		          $('.tabs').hide();
		          $('.catalog_main_container').show();
		        });
			}
		});

		return App;
});