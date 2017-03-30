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
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		onChildviewSelectGroup: function(childView) {
			this.trigger('group:selected', childView.model.get('catalogId'));
		}
	});
	return CatalogGroupView;
});