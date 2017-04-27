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
		serializeData: function() {
			return {
				domainType: saslData.domainEnum
			};
		},
		render: function () {
			this.$el.html(template(this.serializeData()));
			return this;
     	}
	});
	return CatalogsLayoutView;
});