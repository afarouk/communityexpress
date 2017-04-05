'use strict';

define([
	'./catalogItem',
	'./catalogItemVersions'
	], function(CatalogItemView, CatalogItemVersionsView){

	var CatalogGroupView = Mn.CollectionView.extend({
		childView: function(model){
			var hasVersions = model.get('hasVersions');
			if (hasVersions) {
				return CatalogItemVersionsView;
			} else {
				return CatalogItemView;
			}
		},
		className: 'cmtyx_catalog',
		tagName: 'ul',
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.basket = options.basket;
			this.options = options;
		},
		onChildviewItemsAdded: function(childView) {
			var model = childView.model;
			this.basket.addItem(model, model.get('quantity'), 
				 this.options.groupId, this.options.groupDisplayText, 
				 this.options.catalogId,this.options.catalogDisplayText);
			console.log(this.basket.getTotalPrice());
		},
		onChildviewItemsVersionAdded: function(model, versions, basketItem) {
			this.basket.setBasketVersions(model, versions);
			this.basket.addItem(basketItem, 1,
				 this.options.groupId, this.options.groupDisplayText, 
				 this.options.catalogId,this.options.catalogDisplayText);
		}
	});
	return CatalogGroupView;
});