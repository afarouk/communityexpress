'use strict';

define([
	'./customizationItem',
	], function(CustomizationItemView, CatalogItemVersionsView){
	var CustomizationCollectionView = Mn.CollectionView.extend({
		className: 'customization_block',
		tagName: 'ul',
		childView: CustomizationItemView,
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.options = options;
		}
	});
	return CustomizationCollectionView;
});