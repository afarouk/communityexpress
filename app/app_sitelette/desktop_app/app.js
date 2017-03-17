'use strict';

define([

	], function(){
		var App = new Mn.Application({
			onStart: function() {
				Backbone.history.start({pushState: true});
			}
		});

		return App;
});