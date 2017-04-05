'use strict';

define([
	'ejs!../templates/cartLoader.ejs',
	], function(template){
	var CartLoaderView = Mn.View.extend({
		template: template,
		className: 'loader-content',
		onRender: function() {
			
		}
	});
	return CartLoaderView;
});