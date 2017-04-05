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
		childViewOptions: function(model) {
			if (model.get('hasVersions')) {
				var versions = this.getVersionsFromBasket(model);
				return {
					versions: versions
				};
			}
		},
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.basket = options.basket;
			this.options = options;

			//TODO use some marionet feature for losten off basket
			this.basket.on('remove', this.onBasketRemove.bind(this));
			this.basket.on('reset', this.onBasketReset.bind(this));
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
		onChildviewItemsVersionAdded: function(model, versions, basketItem) {
			this.basket.setBasketVersions(model, versions);
			this.basket.addItem(basketItem, 1,
				 this.options.groupId, this.options.groupDisplayText, 
				 this.options.catalogId,this.options.catalogDisplayText);
		},
		onBasketRemove: function(model) {
			if (model.get('isVersion')) {
				var uuid = model.get('uuid').split('_._')[0],
					view = this.children.find(function(view){
				  return view.model.get('uuid') === uuid
				});
				if (view) {
					view.onRemoveVersion(model.get('uuid'));
				}
			}
		},
		onBasketReset: function() {
			this.basket.versions = {}; //reset versions
			this.children.each(function(view){
				if (view.model.get('hasVersions')) {
					view.onResetVersions();
				}
			})
		}
	});
	return CatalogGroupView;
});