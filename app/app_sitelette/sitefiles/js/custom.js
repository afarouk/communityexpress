/*
 * @package Droplet
 * @subpackage Droplet HTML
 *
 * Template Scripts
 * Created by Themeturn


 */

$(function() {
	var url = "https://simfel.com/apptsvc/rest/sasl/getSASLSummaryLightByUIDAndLocation?domain=ALL&UID=&latitude=37.307793&longitude=-122.002228&simulate=true",
		sasls = getSASLS(url),
		markers = getMarkers(sasls),
		map = initMap();

	function getSASLS(url) {
		var saslsArr = [];

		$.ajax({
            url: url,
            async: false
      	})
		  .done(function(data) {
		    saslsArr = data.sasls;
		  	console.log("sasl data received");
		  })
		  .fail(function() {
		    console.log("error on receiving sasl data");
		  });

		  return saslsArr;
	}

	function getMarkers(sasls) {
		var sasls = sasls,
			markers = []; 

		for( var index in sasls ) {
			var marker, position, name, url;

			position = {
				lat : Number(sasls[index].latitude),
				lng : Number(sasls[index].longitude)
			};
			name = sasls[index].name;
			url = sasls[index].onClickURL;

			marker = {
				name: name, 
				position : position,
				url: url
			};

			markers.push(marker)
		}

		return markers;
	}

	function initMap() {
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom : 15,
			scrollwheel : false
		});

		return map;
	}

	function placeMarkers(map, markers) {
		for( var index in markers ) { 
			var marker = new MarkerWithLabel({
			   position: markers[index].position,
			   map: map,
			   labelContent: markers[index].name,
			   labelAnchor: new google.maps.Point(33, 0),
			   labelClass: "labels" // the CSS class for the label
			});

			google.maps.event.addListener(marker, 'click', (function(markers, marker, index) {
				return function() {
					window.location.href = markers[index].url;
				}
			})(markers, marker, index));
		}
		console.log('markers placed')
	}

	$("a[href='#map_tab']").click(function(event) {
		setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
			map.setCenter(new google.maps.LatLng(markers[0].position.lat, markers[0].position.lng));
			placeMarkers(map, markers);
		}, 1000);
	});
});

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

	function setHeaderColor() {
		if ( $(window).width() > 768 ) {
			if (window.location.pathname == "/sendsample") {
				$('nav.navbar').css('background-color','#363636');
				$('.li_demo').addClass('active');
			}
			if (window.location.pathname == "/portalexpress") {
				$('nav.navbar').css('background-color','#363636');
				$('.li_login').addClass('active');
			}
			if (window.location.pathname == "/signup") {
				$('nav.navbar').css('background-color','#363636');
				$('.li_signin').addClass('active');
			}
			if (window.location.pathname == "/testflyer") {
				$('nav.navbar').css('background-color','#363636');
				$('.li_flayer').addClass('active');
			}
			if (window.location.pathname == "/support") {
				$('nav.navbar').css('background-color','#363636');
				$('.li_support').addClass('active');
			}
		}
	}

	setHeaderColor();
	$( window ).resize(function() {
		setHeaderColor();
	});

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
				$('a[data-rel^=lightcase]').lightcase({
					swipe: true
				});

		});

$(window).load(function() {
	colorFadeBlockSize();
});
