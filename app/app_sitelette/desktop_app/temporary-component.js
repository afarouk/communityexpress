'use strict';

define([

	], function() {
	var TemporaryComponent = Mn.Object.extend({
		init: function() {
			var card = new Skeuocard($("#skeuocard"));

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

			$(".owl-carousel").owlCarousel({
				items: 1,
				loop: true,
				autoplay: true,
				autoplayTimeout: 3000,
				animateIn: 'fadeIn',
				animateOut: 'fadeOut'
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
			
			// $(".grid-item .header").click(function(){
			// 	$( this ).next().slideToggle("slow", function() { 
			// 		$grid.packery(); 
			// 	});
			// 	return false;
			// });

			// Catalog
			$('.cmtyx_menu_block .tabcontent').hide();
			$('.cmtyx_menu_block .tabs').hide();

			$('.cmtyx_menu_block .catalog').click(function(event) {
			    $('.cmtyx_menu_block .catalog_main_container').hide();
			    $('.cmtyx_menu_block .tabs').show();

				// Default show the first tab, and add an "active" class to the link that opened the tab
				$('.cmtyx_menu_block #' + $('.tabs + .tabcontent').attr('id')).show();
				$(".cmtyx_menu_block .tabs button:nth-child(1)").addClass('active');
			});

			$('.cmtyx_menu_block .tabs button').click(function(event) {
				// Get all elements with class="tabcontent" and hide them
			    $('.cmtyx_menu_block .tabcontent').hide();

			    // Get all elements with class="tablinks" and remove the class "active"
			    $('.cmtyx_menu_block .tablinks').removeClass('active');

			    // Show the current tab, and add an "active" class to the link that opened the tab
			    $('.cmtyx_menu_block #' + $(this).text().toLowerCase().split(' ').join('_')).show();
			    $(this).addClass('active');
			});

			$('.cmtyx_menu_block .back_to_catalog_btn').click(function(event) {
				$('.cmtyx_menu_block .tabcontent').hide();
				$('.cmtyx_menu_block .tablinks').removeClass('active');

				$('.cmtyx_menu_block .tabs').hide();
				$('.cmtyx_menu_block .catalog_main_container').show();
			});

			$('.cmtyx_menu_block .block.plus').click(function(event) {
				$(this).prev().text(+$(this).prev().text() + 1);
			});

			$('.cmtyx_menu_block .block.minus').click(function(event) {
				if ($(this).next().text() == 1) {
					return;
				}

				$(this).next().text($(this).next().text() - 1);
			});
			//End of Catalog

			//Cart

			$('.cmtyx_cart_block .page').hide();
			$('.cmtyx_cart_block .page.cart_page').show();

			// Default show the first tab, and add an "active" class to the link that opened the tab
			$('.cmtyx_cart_block #' + $('.cmtyx_cart_block .tabs + .tabcontent').attr('id')).show();
			$(".cmtyx_cart_block .tabs button:nth-child(1)").addClass('active');
			
			$('.cmtyx_cart_block .tabs button').click(function(event) {
				var currentPage = $(this).parent().parent();

				// Get all elements with class="tabcontent" and hide them
			    currentPage.find('.tabcontent').hide();

			    // Get all elements with class="tablinks" and remove the class "active"
			    currentPage.find('.tablinks').removeClass('active');

			    // Show the current tab, and add an "active" class to the link that opened the tab
			    currentPage.find('#' + $(this).text().toLowerCase().split(' ').join('_')).show();
			    $(this).addClass('active');
			});

			$('.cmtyx_cart_block .bottom_btns_block .back_btn').click(function() {
				var currentPage = $(this).parent().parent();
				currentPage.hide();
				currentPage.prev().show();
				if (currentPage.prev().find('.tablinks.active').length !== 0) {
					currentPage.prev().find('#' + currentPage.prev().find('.tablinks.active').text().toLowerCase().split(' ').join('_')).show();
				}
				calcCardHeight();
			})

			$('.cmtyx_cart_block .bottom_btns_block .next_btn').click(function() {
				var currentPage = $(this).parent().parent();
				currentPage.hide();
				currentPage.next().show();
				if (currentPage.next().find('.tablinks.active').length !== 0) {
					currentPage.next().find('#' + currentPage.next().find('.tablinks.active').text().toLowerCase().split(' ').join('_')).show();
				}
				calcCardHeight();
			})

			$('.cart_page .order_btn').click(function() {
				var currentPage = $(this).parent();
				currentPage.hide();
				currentPage.next().show();
				if (currentPage.next().find('.tablinks.active').length !== 0) {
					currentPage.next().find('#' + currentPage.next().find('.tablinks.active').text().toLowerCase().split(' ').join('_')).show();
				}
			})

			$('.cmtyx_cart_block .bottom_btns_block .place_order_btn').click(function() {
				alert('order done');

				$('.cmtyx_cart_block .page').hide();
				$('.cmtyx_cart_block .tabcontent').hide();
				$('.cmtyx_cart_block .tablinks').removeClass('active');
				$('.cmtyx_cart_block .page.cart_page').show();
				$('.cmtyx_cart_block #' + $('.cmtyx_cart_block .tabs + .tabcontent').attr('id')).show();
				$(".cmtyx_cart_block .tabs button:nth-child(1)").addClass('active');
			})

			$('.cmtyx_cart_block .remove_item_btn').click(function(event) {
				$(this).parent().parent().remove();
			});
			
			$('.cmtyx_cart_block .order_list_item .block.plus').click(function(event) {
				$(this).prev().text(+$(this).prev().text() + 1);
			});

			$('.cmtyx_cart_block .order_list_item .block.minus').click(function(event) {
				if ($(this).next().text() == 1) {
					if (confirm("Remove item from cart?")) {
						$(this).parent().parent().parent().remove();
					}
					else {
						return;
					}
				}

				$(this).next().text($(this).next().text() - 1);
			});
			//End of Cart

			$( window ).resize(function() {
				calcCardHeight();
			});

			function calcCardHeight() {
				var height = $('#skeuocard .face').width() / 1.6;
				$('#skeuocard.js').height(height);
				$('#skeuocard .face').height(height);
			}
		}
	});

	return new TemporaryComponent();
});