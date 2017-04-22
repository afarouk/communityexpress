'use strict';

define([

	], function() {
	var TemporaryComponent = Mn.Object.extend({
		init: function() {
			//disabling autofocus in popups
			$.ui.dialog.prototype._focusTabbable = function(){};

			var $grid = $('.grid').packery({
			  itemSelector: '.grid-item',
			  columnWidth: '.grid-sizer',
			  percentPosition: true,
			  gutter: '.gutter-sizer'
			});

			// make all grid-items draggable
			// $grid.find('.grid-item').each( function( i, gridItem ) {
			//   var draggie = new Draggabilly( gridItem, {
			//   	handle: '.header'
			//   } );
			//   // bind drag events to Packery
			//   $grid.packery( 'bindDraggabillyEvents', draggie );
			// });

			setTimeout(function() { 
				$('.cssload-thecube').hide();
				$grid.show();
				$grid.packery(); 
			}, 1200)

			$(".cmtyx_gallery_block .owl-carousel").owlCarousel({
				items: 1,
				loop: true,
				autoplay: true,
				autoplayTimeout: 3000
			});

			$(".cmtyx_promotion_block .owl-carousel, .cmtyx_promocodes_block .owl-carousel").owlCarousel({
				items: 1,
				loop: true,
				nav: true,
				navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]
			});

			// $(".my-rating").starRating({
		 //        initialRating: 3.5,
		 //        strokeColor: '#EFCE4A',
		 //        strokeWidth: 30,
		 //        starSize: 25,
		 //        emptyColor: 'transparent',
		 //        starShape: 'rounded',
		 //        useGradient: false
		 //    });
		    
		 //    $('.current_rating').text($('.my-rating').starRating('getRating'));
		}
	});

	return new TemporaryComponent();
});