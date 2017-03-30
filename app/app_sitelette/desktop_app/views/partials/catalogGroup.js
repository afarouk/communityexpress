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
			this.groupId = options.groupId;
		},
		onChildviewItemsAdded: function(childView) {
			var model = childView.model;
			this.basket.addItem(model, model.get('quantity'), this.groupId);
			console.log(this.basket.getTotalPrice());
		}
	});
	return CatalogGroupView;
});