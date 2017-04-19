'use strict';

define([
	'./catalogItem',
	'./catalogItemVersions'
	], function(CatalogItemView, CatalogItemVersionsView){

	var CatalogGroupView = Mn.CollectionView.extend({
		className: 'cmtyx_catalog',
		tagName: 'ul',
		childView: function(model){
			if (model.get('hasVersions')) {
				return CatalogItemVersionsView;
			} else {
				return CatalogItemView;
			}
		},
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.basket = options.basket;
			this.options = options;
		},
		getVersionsFromBasket: function(model) {
	        var versionsFromBasket = this.basket.getBasketVersions(model) || null,
	            versions = [];

	        if (!versionsFromBasket) return versions;
	        _.each(versionsFromBasket.selectedVersions, function(version){
	            versions.push({
	                version: version.version,
	                selected: version.selected,
	                quantity: version.quantity
	            });
	        });

	        return versions;
	    },
		onChildviewItemsAdded: function(childView) {
			var model = childView.model;
			this.basket.addItem(model, model.get('quantity'), 
				 this.options.groupId, this.options.groupDisplayText, 
				 this.options.catalogId,this.options.catalogDisplayText);
			console.log(this.basket.getTotalPrice());
		},
		onChildviewItemsVersionAdded: function(model,  basketItem) {
			this.basket.addItem(basketItem, 1,
				 this.options.groupId, this.options.groupDisplayText, 
				 this.options.catalogId,this.options.catalogDisplayText);
		}
	});
	return CatalogGroupView;
});