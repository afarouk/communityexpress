/*
 * @package Droplet
 * @subpackage Droplet HTML
 *
 * Template Scripts
 * Created by Themeturn


 */

$(window).load(function() { // makes sure the whole site is loaded
	"use strict";

	/*
	 * ============================================== Menu toggle
	 * ===============================================
	 */
	$(window).bind('scroll', function() {
		var navHeight = $(window).height() - 40;
		if ($(window).scrollTop() > navHeight) {
			$('.navbar-default').addClass('on');
		} else {
			$('.navbar-default').removeClass('on');
		}
	});

	$('body').scrollspy({
		target : '.navbar-default',
		offset : 70
	})

	if (window.location.pathname == "/common_senddemo.php") {
		$('nav.navbar').css('background-color','#363636');
		$('.li_demo').addClass('active');
	}
	if (window.location.pathname == "/common_portalexpress.php") {
		$('nav.navbar').css('background-color','#363636');
		$('.li_login').addClass('active');
	}
	if (window.location.pathname == "/common_signup.php") {
		$('nav.navbar').css('background-color','#363636');
		$('.li_signin').addClass('active');
	}

});

function colorFadeBlockSize() {
	  if( $(".color_fade_block").length >0 ){
      $(".color_fade_block").css("height", parseInt($(".browse_chalkboards_block").css("height").substring(0,$(".browse_chalkboards_block").css("height").length - 2)) + 1 + "px");
      $(".color_fade_block").css("width", $(".browse_chalkboards_block").css("width"));
		}
}

$(document).ready(
		function() {

			"use strict";

			$("a[data-rel^='prettyPhoto']").prettyPhoto();

			/*
			 * ==============================================
			 * Testimonialcarousel
			 * ===============================================
			 */

			$("#testimonial-carousel").owlCarousel({

				navigation : false, // Show next and prev buttons
				slideSpeed : 600,
				pagination : true,
				itemsDesktop : [ 1199, 3 ],
				itemsDesktopSmall : [ 979, 3 ],
				singleItem : true

			});

			// Custom Navigation Events
			var owl = $("#testimonial-carousel");

			// Custom Navigation Events
			$(".next").click(function() {
				owl.trigger('owl.next');
			})
			$(".prev").click(function() {
				owl.trigger('owl.prev');
			})
			$(".play").click(function() {
				owl.trigger('owl.play', 1000); // owl.play event accept
												// autoPlay speed as second
												// parameter
			})
			$(".stop").click(function() {
				owl.trigger('owl.stop');
			})

			/*
			 * ============================================== Client carousel
			 * ===============================================
			 */

			$("#client-carousel").owlCarousel({
				navigation : false, // Show next and prev buttons
				slideSpeed : 400,
				pagination : false,
				items : 5,
				rewindNav : true,
				itemsDesktop : [ 1199, 3 ],
				itemsDesktopSmall : [ 979, 3 ],
				stopOnHover : true,
				autoPlay : true

			});

			/* ----------------------------------------------------------- */
			/*
			 * Main slideshow /*
			 * -----------------------------------------------------------
			 */

			$('#slider-carousel').carousel({
				pause : true,
				interval : 1000000,
			});

			$('#app-carousel').carousel({
				interval : 100000
			})

			/*
			 * ============================================== Bactstretch js
			 * ===============================================
			 */
			// $.backstretch([ "sitefiles/images/bg/bg1.jpg", "sitefiles/images/bg/bg2.jpg",
			// 		"sitefiles/images/bg/bg3.jpg" ], {
			// 	fade : 950,
			// 	duration : 10000
			// });

			/*
			 * ============================================== Back To Top Button
			 * ===============================================
			 */

			$(window).scroll(function() {
				if ($(this).scrollTop() > 50) {
					$('#back-top').fadeIn();
				} else {
					$('#back-top').fadeOut();
				}
			});
			// scroll body to 0px on click
			$('#back-top').click(function() {
				$('#back-top a').tooltip('hide');
				$('body,html').animate({
					scrollTop : 0
				}, 800);
				return false;
			});

			$('#back-top').tooltip('hide');


			/*==============================================================================================================*/
			/*==============================================================================================================*/

			new WOW().init();

		    $('.gallery').slick({
		        dots: true
		        , arrows: false
		        , infinite: true
		        , speed: 700
		        , slidesToShow: 1
		        , autoplay: true
		        , autoplaySpeed: 5000
		    });

		    setTimeout(function() {
		        $('.gallery').hide().css('visibility','visible').fadeIn('slow');
		    }, 100);

		    function headerColorChange() {
		    	if( $(window).width() >= 768 && (window.location.pathname == "/" || window.location.pathname == "/index.php") ) {
			    	if($("body").scrollTop() > 50) {
						$("nav.navbar.navbar-default.navbar-fixed-top.top-nav-collapse").css("background-color","#363636");
					}
					if($("body").scrollTop() < 50) {
						$("nav.navbar").css("background-color","transparent");
					}
				}
				if ( $(window).width() < 768 ) {
					$("nav.navbar").css("background-color","white");
				}
		    }


		    headerColorChange();

		    $( window ).scroll(function() {
		    	headerColorChange();
			});
			$( window ).resize(function() {
		        headerColorChange();
		        colorFadeBlockSize();
			  	$( window ).scroll(function() {
			    	headerColorChange();
				});
			});

		    // $.validator.addMethod(
		    //     "regex_name",
		    //     function(value, element, regexp) {
		    //     var check = false;
		    //     return this.optional(element) || regexp.test(value);
		    //     },
		    //     "Please enter valid symbols"
		    // );

		    // $("#contactUsForm").validate({
		    //     rules: {
		    //         name: {
		    //             regex_name : /^[A-Za-z][A-Za-z ,.'-]+$/
		    //         }
		    //     },
		    //     submitHandler: function () {
		    //         alert("successful submit");
		    //         $('#name').val('');
		    //         $('#email').val('');
		    //         $('#message').val('');
		    //         return false;
		    //     },
		    //     errorPlacement: function(error, element) {
		    //         error.insertBefore(element);
		    //     }
		    // });

		});

$(window).load(function() {
	colorFadeBlockSize();
});
