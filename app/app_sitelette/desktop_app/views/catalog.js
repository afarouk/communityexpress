'use strict';

define([
	'ejs!../templates/catalog.ejs',
	], function(template){
	var CatalogView = Mn.View.extend({
		template: template,
		onRender: function() {
			console.log('CatalogView');
		}
	});
	return CatalogView;
});