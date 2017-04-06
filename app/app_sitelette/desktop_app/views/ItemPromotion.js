'use strict';

define([
	'ejs!../templates/itemPromotion.ejs',
	'./partials/catalogGroup'
	], function(template, CatalogGroupView){
	var ItemPromotionView = Mn.View.extend({
		template: template,
		regions: {
			group: '#catalog-group'
		},
		className: 'height-100pc',
		events: {
			'click .back_to_catalog_btn': 'onBackToCatalog'
		},
		initialize: function(options) {
			console.log(options);
			this.options = options;
		},
		onRender: function() {
			var collection = new Backbone.Collection(this.options.item);
			this.catalogGroup = new CatalogGroupView({
				collection: collection,
				basket: this.options.basket,
				groupId: null,
				groupDisplayText: null,
				catalogId: null,
				catalogDisplayText: null
			})
			this.showChildView('group', this.catalogGroup);
		},
		onBackToCatalog: function() {
			this.trigger('backToCatalog');
		}
	});
	return ItemPromotionView;
});