'use strict';

define([
	'./customizationItem',
	], function(CustomizationItemView, CatalogItemVersionsView){
	var CustomizationCollectionView = Mn.CollectionView.extend({
		className: 'customization_block',
		tagName: 'ul',
		childView: CustomizationItemView,
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		childViewOptions: function() {
			return this.options;
		}
	});
	return CustomizationCollectionView;
});