'use strict';

define([
    'packery/js/packery',
    'jquery-bridget/jquery-bridget',
    '../scripts/appCache.js',
    '../../vendor/scripts/js.cookie',
    '../scripts/actions/configurationActions',
    '../scripts/actions/sessionActions',
    './controllers/catalogs-controller',
    './controllers/cart-controller'
	], function(Packery, jQueryBridget, appCache, Cookies,
		configurationActions, sessionActions, catalogsController, cartController){
		var App = new Mn.Application({
			onStart: function() {
				this.options.initAnimationsOnPage();
				//Get sasl data for busineses
				if (window.saslData) {
			        appCache.set('saslData', window.saslData);
			    }
			    if (window.saslData.error) {
		            loader.showFlashMessage(window.saslData.error.message);
		            return;
		        }

		        this.options.initSubviews();

				var conf = configurationActions.getConfigurations();

				this.params = window.community;
		        if (this.params.demo) {
		            configurationActions.toggleSimulate(true);
		        };
		        if (this.params.embedded) {
		            conf.set('embedded', true);
		        };
		        if (this.params.UID) {
		            Cookies.set("cmxUID", this.params.UID, {expires:365});
		            sessionActions.authenticate(this.params.UID)
		                .always(function() {
		                    Backbone.history.start({
		                        pushState: true
		                    });
		                });
		        } else if (Cookies.get('cmxUID')) {
		            sessionActions.getSessionFromLocalStorage().then(function() {
		                Backbone.history.start({
		                    pushState: true
		                });
		            });
		        } else if (this.params.canCreateAnonymousUser) {
		            $.when(sessionActions.createAnonymousUser()).done(function() {
		                sessionActions.getSessionFromLocalStorage().then(function() {
		                    Backbone.history.start({
		                        pushState: true
		                    });
		                });
		            });
		        } else {
		        	debugger;
		            // this.afterTriedToLogin();
		            return;
		        }
			},

			initSubviews: function() {
				catalogsController.manageCatalog();
			},

			initAnimationsOnPage: function() {
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
		        }.bind(this), 1200)

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