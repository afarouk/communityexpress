'use strict';

define([
	'ejs!../templates/catalogsLayout.ejs',
	], function(template){
	var CatalogsLayoutView = Mn.View.extend({
		el: '#catalogs-layout',
		template: template,
		regions: {
			catalogsContainer: '#catalogs-region',
			blinder: '#blinder-region'
		},
		initialize: function() {
			this.render();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return CatalogsLayoutView;
});